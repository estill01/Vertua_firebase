import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

// TODO Load .env vars  / Make sure they're set with firestore.

export const app = admin.initializeApp()

// -----------------------
// 	Accounts
// -----------------------
const onAccountCreate = functions.auth.
	user()
	.onCreate(async (userRecord, context) => {
		let user = {
			uid: userRecord.uid,
			displayName: userRecord.displayName || '',
			photoURL: userRecord.photoURL || '',
			createdAt: userRecord.meta.createdAt,
			createdBy: userRecord.uid 
		} 

		try {
			await app.firestore().collection('users').doc(userRecord.uid).set(user)
			// TODO Send admin/me email so I can notice if anyone signs up.
		} catch (err) {
			console.log(err)
			// TODO Send admin/me email if this fails to manually fix.
		}
	})

// TODO onAccountDelete()
// - remove from search index

// -----------------------
// 	Users
// -----------------------
const onUserCreate = functions.firestore.
	document('users/{userId}')
	.onCreate(async (snapshot, context) => {
		// TODO Add to search index
	}) 


// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

