import 'babel-polyfill'
import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import { AlgoliaSearch, SendGridMailer } from './services'

const app = admin.initializeApp()

// -----------------------
// 	Accounts
// -----------------------
export const onAccountCreate = functions.auth.
	user()
	.onCreate(async (userRecord, context) => {
		let user = {
			uid: userRecord.uid,
			displayName: userRecord.displayName || '',
			photoURL: userRecord.photoURL || '',
			visibilty: 'public',
			createdAt: userRecord.metadata.creationTime,
		} 

		// TODO check if anonymous ; if so, add to 'anonymousUsers' collection
		try {
			await app.firestore().collection('users').doc(userRecord.uid).set(user)
		} 
		catch (err) {
			console.error(err)
			throw new Error("[onAccountCreate]")
			// TODO Fix mailers; SendGrid is wonky, see if NodeMailer is more straightforward
			// SendGridMailer.sendErrorNotificationToAdmin(userRecord)
		}
	})

export const onAccountDelete = functions.auth.
	user()
	.onDelete(async (userRecord, context) => {
		try {
			let resp = await app.firestore().collection('users').doc(userRecord.uid).delete()
		} 
		catch (err) {
			console.error(err)
			throw new Error("[onAccountDelete] Failed to delete user")
		}
	})

// -----------------------
// 	Users
// -----------------------
export const onUserCreate = functions.firestore.
	document('users/{userId}')
	.onCreate(async (doc, context) => {
		try { await AlgoliaSearch.addDocToIndex(doc, 'users') }
		catch (err) { 
			console.error(err)
			throw new Error("[onUserCreate]")
		}
	}) 

export const onUserDelete = functions.firestore.
	document('users/{userId}')
	.onDelete(async (doc, context) => {
		try { await AlgoliaSearch.removeIDFromIndex(doc.uid, 'users') }
		catch (err) { 
			console.error(err)
			throw new Error("[onUserDelete]")}
	}) 

// -----------------------
// 	Projects
// -----------------------
export const onProjectCreate = functions.firestore.
	document('projects/{projectId}')
	.onCreate(async (doc, context) => {
		try { await AlgoliaSearch.addDocToIndex(doc, 'projects') }
		catch (err) { 
			console.error(err)
			throw new Error("[onProjectCreate]") 
		}
	})

export const onProjectDelete = functions.firestore.
	document('projects/{projectId}')
	.onDelete(async (doc, context) => {
		try { await AlgoliaSearch.removeIDFromIndex(doc.uid, 'projects') }
		catch (err) { 
			console.error(err)
			throw new Error("[onProjectDelete]") }
	})





// ----------------------------------------------------
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

