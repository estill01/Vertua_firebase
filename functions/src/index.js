// TODO Load .env vars (?)
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'


const APP = admin.initializeApp()

export const helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

