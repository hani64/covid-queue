const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp();


//const express = require('express');
//const app = express();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions//


 exports.helloWorld = functions.https.onRequest((request, response) => {
   functions.logger.info("Hello logs!", {structuredData: true});
   response.send("Hello from Firebase!");
});

////us-central1-hack-the-north-2021.cloudfunctions.net/helloWorld

exports.addUser = functions.https.onRequest((data, response) => {
  admin.firestore().collection('users').doc(data.health_card).set({
    "first_name" : data.first_name,
    "last_name" : data.last_name,
    "age" : data.age,
    "is_essential" : data.last_name,
    "in_group_setting" : data.in_group_setting,
    "is_nurse" : data.is_nurse,
    "is_ pregnant" : data.is_pregnant,
    "heath_card_number" : data.health_card_number
  }).then(response.send("Added User"));
});
