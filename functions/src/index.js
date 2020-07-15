import 'babel-polyfill'
import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import { AlgoliaSearch, SendGridMailer } from './services'
import { isNil } from 'lodash'
import { nanoid } from 'nanoid'

const app = admin.initializeApp()

// -----------------------
// 	Accounts
// -----------------------
export const onAccountCreate = functions.auth.
	user()
	.onCreate(async (userRecord, context) => {
		let user = buildUserDoc(userRecord)
		try { await app.firestore().collection('users').doc(userRecord.uid).set(user) } 
		catch (err) { throw new Error("[onAccountCreate]") }
		// TODO check if anonymous ; if so, add to 'anonymousUsers' collection
		// TODO Fix mailers; SendGrid is wonky, see if NodeMailer is more straightforward
	})

export const onAccountDelete = functions.auth.
	user()
	.onDelete(async (userRecord, context) => {
		try { await app.firestore().collection('users').doc(userRecord.uid).delete() } 
		catch (err) { throw new Error("[onAccountDelete]") }
	})


// -----------------------
// 	Users
// -----------------------
export const onUserCreate = functions.firestore.
	document('users/{userId}')
	.onCreate(async (snapshot, context) => {
		// onCreate : <QueryDocumentSnapshot>
		// handler : function(snapshot: <QueryDocumentSnapshot>, context: <EventContext>) : PromiseLike<any>
		console.log("[onUserCreate]")
		intakePipeline(snapshot, 'users')
	}) 

export const onUserDelete = functions.firestore.
	document('users/{userId}')
	.onDelete(async (snapshot, context) => {
		console.log("[onUserDelete]")
		deletionPipeline(context.params.userId, 'users') 
	}) 



// -----------------------
// 	Projects
// -----------------------
export const onProjectCreate = functions.firestore.
	document('projects/{projectId}')
	.onCreate(async (snapshot, context) => {
		console.log("[onProjectCreate]")
		intakePipeline(snapshot, 'projects')
	})

export const onProjectDelete = functions.firestore.
	document('projects/{projectId}')
	.onDelete(async (snapshot, context) => {
		console.log("[onProjectDelete]")
		deletionPipeline(context.params.projectId, 'projects')
	})


// ===========================
// 	Utils 
// ===========================
// ---------------------------
// 	Utils : Intake Pipeline
// ---------------------------
	
// async function intakePipeline(snapshot, searchIndex) {
// 	if (isNil(snapshot)) { throw new Error('`intakePipeline()` parameter `snapshot` cannot be null') }
// 	if (isNil(searchIndex)) { throw new Error('`intakePipeline()` parameter `searchIndex` cannot be null') }
// 	let docRef = snapshot.ref 
// 	let data = snapshot.data()
// 	let promises = []
//
// 	addTimestamp(data)
//
// 	if (searchIndex !== 'users') { promises.push(addCreator(data)) }
// 	promises.push(addSlug(data, searchIndex))
//
// 	return Promise.all(promises).then(async (val) => {
// 		try { 
// 			await docRef.set(data) 
// 			if (!isNil(data.creator)) {
// 				if(!isNil(data.creator.docRef)) { delete data.creator.docRef }  // NB. was causing a circular reference error with algolia
// 			}
// 			await addDocToSearchIndex(data, searchIndex) 
// 		}
// 		catch (err) { 
// 			try { await app.firestore().collection(searchIndex).doc(data.uid).delete() } // Clean up created item (NB. This isn't working)
// 			catch (err) { throw new Error(err) }
// 			throw new Error(err) 
// 		}
// 		return
// 	})
// }

async function intakePipeline(snapshot, searchIndex) {
	if (isNil(snapshot)) { throw new Error('`intakePipeline()` parameter `snapshot` cannot be null') }
	if (isNil(searchIndex)) { throw new Error('`intakePipeline()` parameter `searchIndex` cannot be null') }
	let docRef = snapshot.ref 
	let data = snapshot.data()

	try {
		await Promise.all([
			addTimestamp(data),
			addCreator(data, searchIndex),
			addSlug(data, searchIndex),
		])
		_cleanData(data)
	
		await Promise.all([
			docRef.set(data), 
			addDocToSearchIndex(data, searchIndex),
		])
	} 
	catch (err) { 
		// NB. Document 'delete()' triggers deletion pipeline which handles removing item from Algolia index
		try { await app.firestore().collection(searchIndex).doc(data.uid).delete() } 
		catch (err) { throw new Error(err) }

		throw new Error(err) 
	} 
	return
}

function _cleanData(data) {
	// NB. 'creator.docRef' was causing a circular reference error with Algolia indexing
	if (!isNil(data.creator)) {
		if(!isNil(data.creator.docRef)) { delete data.creator.docRef }  
	}
}

async function addTimestamp(data) { data.createdAt = Date.now() }

// TODO Review for anonymous user case -- e.g. annonymous users 'urlSlug' is blank (?)
async function addCreator(data, searchIndex) {
	console.log("[addCreator]")
	if (searchIndex === 'users') { return }

	let creator = null
	try { creator = await getUserRecord(data.creator.uid) } 
	catch (err) { throw new Error(err) }

	// console.log("data.creator: ", data.creator)
	// console.log("data.creator.displayName: ", data.creator.displayName)

	data.creator.displayName = creator.displayName || ''
	data.creator.photoURL = creator.photoURL || ''
	data.creator.urlSlug = creator.urlSlug || ''
}

async function addSlug(data, searchIndex) {
	let slug = null
	if (searchIndex === 'users') { 
		if (data.displayName === '') { slug = data.uid } // NB. To handle anonymous users which don't have a 'displayName' property.
		else { slug = data.displayName }
	} 
	else { slug = data.name }
	if (slug === '') { slug = data.uid }

	// slug = slug.toLowerCase()
	slug = slug.replace(/ /gi, '_')
	slug = encodeURIComponent(slug)
	const slugTaken = await _slugTaken(slug, searchIndex)
	if (slugTaken) { slug = await _generateUniqueSlug(slug, searchIndex) }
	data.urlSlug = '/' + searchIndex + '/' + slug
}

async function _slugTaken(slug, searchIndex) {
	const fullSlug = '/' + searchIndex + '/' + slug
	let slugTaken = app.firestore().collection(searchIndex).where("urlSlug", "==", fullSlug)
	slugTaken = await slugTaken.get()
	if (slugTaken.docs.length > 0) { return true }
	else { return false }
}

function _generateRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max)) + 1
}

function _generateSlugExtension(len=6) {
	const slugExtLen = _generateRandomInt(len) 
	const slugExt = "-" + nanoid(slugExtLen)
	return slugExt
}

async function _generateUniqueSlug(slug, searchIndex) {
	const slugExt = _generateSlugExtension()
	const newSlug = slug + slugExt
	const slugTaken = await _slugTaken(newSlug, searchIndex)
	if (slugTaken) { return _generateUniqueSlug(slug, searchIndex) }
	else { return newSlug }
}

async function addDocToSearchIndex(data, searchIndex) {
	console.log("[addDocToSearchIndex]")
	try { AlgoliaSearch.addDocToIndex(data, searchIndex) }
	catch (err) { throw new Error(err) }
}

// ---------------------------
// 	Utils : Deletion Pipeline
// ---------------------------
function deletionPipeline(id, searchIndex) {
	removeIdFromSearchIndex(id, searchIndex)
}

async function removeIdFromSearchIndex(id, searchIndex) {
	try { AlgoliaSearch.removeIdFromIndex(id, searchIndex) }
	catch (err) { throw new Error(err) }
}

// async function removeDocFromSearchIndex(docRef, searchIndex) {
// 	let snapshot = await docRef.get()
// 	try { AlgoliaSearch.removeDocFromIndex(snapshot.data(), searchIndex) }
// 	catch (err) { throw new Error(err) }
// }


// ---------------------------
// 	Utils : User
// ---------------------------
function buildUserDoc(userRecord) {
	return {
		uid: userRecord.uid,
		displayName: userRecord.displayName || '',
		photoURL: userRecord.photoURL || '',
		visibilty: 'public',
	} 
}

async function getUserRecord(id) {
	let docRef = app.firestore().collection('users').doc(id)
	let snapshot = await docRef.get()
	console.log("[getUserRecord]")
	console.log("user: ", snapshot.data())
	return snapshot.data()
}
