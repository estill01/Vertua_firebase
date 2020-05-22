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
		let user = {
			uid: userRecord.uid,
			displayName: userRecord.displayName || '',
			photoURL: userRecord.photoURL || '',
			visibilty: 'public',
			createdAt: userRecord.metadata.creationTime,
		} 

		try {
			await app.firestore().collection('users').doc(userRecord.uid).set(user)
		} catch (err) {
			console.error("Error: ", err)
			// sendErrorNotificationToAdmin(userRecord)
		}
		// sendSuccessNotificationToAdmin(userRecord)

		// TODO Add to search index
		// TODO Fix mailers; SendGrid is wonky, see if NodeMailer is more straightforward

	})

export const onAccountDelete = functions.auth.
	user()
	.onDelete(async (userRecord, context) => {
		try {
			let resp = await app.firestore().collection('users').doc(userRecord.uid).delete()
			console.log("[Delete] Successfully deleted user: ", resp)
		} catch (err) {
			console.error("[Error] Failed to delete user: ", err)
		}

		// TODO Remove from search index
	})


// --------------------------
// Utils
// --------------------------

// TODO Fix: this doesn't seem to be working; should have fired in the catch block..
function sendEmailToAdmin({ subject, text, html }) {
	const msg = {
		to: 'ethan@vertua.com',
		from: 'ethan@vertua.com',
		subject: subject,
		text: text,
		html: html,
	}
	try { SendGrid.send(msg) }
	catch (err) {
		console.error("Error sending email notification: ", err)
	}
}

function sendErrorNotificationToAdmin(userRecord) {
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

function sendSuccessNotificationToAdmin(userRecord) {
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
// - remove from users collection
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

