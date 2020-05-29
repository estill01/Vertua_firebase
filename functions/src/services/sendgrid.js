import * as functions from 'firebase-functions'
import SendGridMailer from '@sendgrid/mail'

SendGridMailer.setApiKey(functions.config().sendgrid.api_key)

SendGridMailer.emailAdmin = ({ subject, text, html }) => {
	// TODO Fix: this doesn't seem to be working; should have fired in the catch block..
	const msg = {
		to: 'ethan@vertua.com',
		from: 'ethan@vertua.com',
		subject: subject,
		text: text,
		html: html,
	}
	try { SendGridMailer.send(msg) }
	catch (err) {
		console.error("Error sending email notification: ", err)
	}
}

SendGridMailer.sendAdminErrorNotice = (userRecord) => {
	SendGridMailer.emailAdmin({
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

SendGridMailer.sendAdminSuccessNotice = (userRecord) => {
	SendGridMailer.emailAdmin({
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

export default SendGridMailer
