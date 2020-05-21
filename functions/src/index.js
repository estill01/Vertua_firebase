import 'babel-polyfill'
import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import SendGrid from '@sendgrid/mail'

const app = admin.initializeApp()


SendGrid.setApiKey(functions.config().sendgrid.api_key)

// -----------------------
// 	Accounts
// -----------------------
export const onAccountCreate = functions.auth.
	user()
	.onCreate(async (userRecord, context) => {

		console.log("userRecord: ", userRecord)

		let user = {
			uid: userRecord.uid,
			displayName: userRecord.displayName || '',
			photoURL: userRecord.photoURL || '',
			visibilty: 'public',
			createdAt: userRecord.metadata.createdAt,
		} 

		try {

			await app.firestore().collection('users').doc(userRecord.uid).set(user)
			// Error: value for argument 'data' is not a valid Firestore document. Cannot use 'undefined' as a Firestore value ('createdAt')

		} catch (err) {
			console.error(err)
			sendErrorNotificationToAdmin()
		}
		sendSuccessNotificationToAdmin()
	})



// --------------------------
// Utils
// --------------------------

// TODO Fix: this doesn't seem to be working; should have fired in the catch block..
function sendEmailToAdmin({ text, html, subject }) {
	const msg = {
		to: 'ethan@vertua.com',
		from: 'ethan@vertua.com',
		subject: subject,
		text: text,
		html: html,
	}
	SendGrid.send(msg)
}

function sendErrorNotificationToAdmin() {
	sendEmailToAdmin({
		subject: '[Error] Error Adding User',
		text: `[Error] A user signed up but a new user record was not created. Fix manually: ${userRecord}`,
		html: `
			<div>
				<h1>Error Adding User</h1>
				<div>${userRecord}</div>
				<hr/>
				<div>Fix manually</div>
			</div>
		`
	})
}

function sendSuccessNotificationToAdmin() {
	sendEmailToAdmin({
		subject: '[New User] Vertua',
		text: `A new user has joined Vertua: ${userRecord}`,
		html: `
			<div>
				<h1>A new user has joined Vertua</h1>
				<div>
					${userRecord}
				</div>
			</div>
		`,
	})
}




// TODO onAccountDelete()
// - remove from search index

// -----------------------
// 	Users
// -----------------------
// const onUserCreate = functions.firestore.
// 	document('users/{userId}')
// 	.onCreate(async (snapshot, context) => {
// 		// TODO Add to search index
// 	}) 


// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

