import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'


// const functions = require('firebase-functions');

const APP = admin.initializeApp()

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

export const helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

