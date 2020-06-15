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
		console.log("context.params.userId: ", context.params.userId)
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
async function intakePipeline(snapshot, searchIndex) {
	if (isNil(snapshot)) { throw new Error('`intakePipeline()` parameter `snapshot` cannot be null') }
	if (isNil(searchIndex)) { throw new Error('`intakePipeline()` parameter `searchIndex` cannot be null') }
	// TODO Check: doc uid != item uid, item uid = doc uid
	
	let docRef = snapshot.ref // <DocumentReference>

	await addTimestampToDoc(docRef, searchIndex)
	if (searchIndex !== 'users') { 
		await addCreatorToDoc(docRef) 
	}
	await addUrlPathToDoc(docRef, searchIndex)
	addDocToSearchIndex(docRef, searchIndex)
}

async function addTimestampToDoc(docRef, collection) {
	try { return docRef.set({ createdAt: Date.now() }, { merge: true }) }
	catch (err) { throw new Error(err) }
}

async function addCreatorToDoc(docRef) {
	console.log('[addCreatorToSnapshot]')
	let snapshot = await docRef.get()
	let data = snapshot.data()
	let creator = null

	// TODO *** Need to get the 'doc.creator.uid' pattern implemented in client and Security Rules ***
	try { creator = await getUserRecord(data.creator.uid) } 
	catch (err) { throw new Error(err) }

	console.log('creator: ', creator)

	// TODO need to set values for anonymous users
	try { await docRef.set(
		{
			creator: {
				displayName: creator.displayName || '',
				photoURL: creator.photoURL || '',
			}
		},
		{ 
			mergeFields: [
				'creator.displayName',
				'creator.photoURL'
			]
		}
	)}
	catch (err) { throw new Error(err) }
}

async function addUrlPathToDoc(docRef, searchIndex) {
	let snapshot = await docRef.get()
	let data = snapshot.data()
	let path = null
	if (searchIndex === 'users') { path = data.displayName } 
	else { path = data.name }
	path.toLowerCase()
	path = path.replace(' ', '_')
	path = encodeURIComponent(path)
	let pathTaken = await _pathTaken(path, searchIndex)
	if (pathTaken) { path = await _generateUniquePath(path, searchIndex) }
	docRef.set({ urlPath: path }, { merge: true } )
}
async function _pathTaken(path, searchIndex) {
	let pathTaken = await app.firestore().collection(searchIndex).where("urlPath", "==", path)
	pathTaken = await pathTaken.get()
	if (pathTaken.docs.length > 0) { return true }
	else { return false }
}
function _generateRandomInt(max) {
	let val = Math.floor(Math.random() * Math.floor(max))
	if (val === 0) { return _generateRandomInt(max) }
	else { return val }
}
function _generatePathExtension(len=6) {
	let pathExtLen = _generateRandomInt(len) 
	let pathExt = "-" + nanoid(pathExtLen)
	return pathExt
}
async function _generateUniquePath(path, searchIndex) {
	let pathExt = _generatePathExtension()
	let tmpPath = path + pathExt
	let pathTaken = await _pathTaken(tmpPath, searchIndex)
	if (pathTaken) { return _generateUniquePath(path, searchIndex) }
	else { return tmpPath }
}

async function addDocToSearchIndex(docRef, searchIndex) {
	console.log("[addDocToSearchIndex]")
	let snapshot = await docRef.get()
	console.log("doc: ", snapshot.data())
	try { AlgoliaSearch.addDocToIndex(snapshot.data(), searchIndex) }
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
	let docRef = await app.firestore().collection('users').doc(id)
	let snapshot = await docRef.get()
	return snapshot.data()
}

