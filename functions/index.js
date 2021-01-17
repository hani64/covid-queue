const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});


exports.deQueue = functions.https.onCall(async (data, response) => {
  qRef = admin.firestore().collection("queue").doc("queue");
  dDoc = await qref.get();

  if (!qDoc.exists) {
    console.log("Queue not initialized");
  } else {
    q = qDoc.data()["queue"];
    for (let i=0; i < q.length; i++) {
      if (data["health_card_number"] === q[i]["health_card_number"]) {
        q.splice(i, 1);
      }
    }
  }

  return "Dequeued";
});