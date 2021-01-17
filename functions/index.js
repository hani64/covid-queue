const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions//


exports.helloWorld = functions.https.onCall((req, res) => {
  return "test";
});
exports.initQueue = functions.https.onCall(async (data, response) => {
  qRef = admin.firestore().collection("queue").doc("queue");
  const queue = await qRef.get();
  if (!queue.exists) {
    qRef.set({"queue": []});
    console.log("queue")
    console.log('Queue now initialized');
    console.log("no")
    return null;
  }
  else{
    console.log('Queue already exists');
    return null;
  } 
  });

exports.enQueue = functions.https.onCall(async (data, response) => {
  qRef = admin.firestore().collection("queue").doc("queue");
  qDoc = await qRef.get()
  if (!qDoc.exists) {
    console.log('Queue not initialized');
    return null;
  } 
  else {
    q = qDoc.data()["queue"];
    for (var i = 0; i < q.length;i++){
      if (data["priority_number"] <= q[i]["priority_number"]){
        q.splice( i, 0, data);
        await qRef.set({"queue" : q});
        console.log(`Inserted at ${q["health_card_number"]} at  ${i}`);
        return `Inserted at ${q["health_card_number"]} at  ${i}`
      }
    }
    q.push(data);
    await qRef.set({"queue" : q});
    console.log(`Inserted at ${q["health_card_number"]} at  ${i}`);
    return `Inserted at ${q["health_card_number"]} at  ${q.length}`
  }
  });

  exports.deQueue = functions.https.onCall(async (data, response) => {
    qRef = admin.firestore().collection("queue").doc("queue");
    qDoc = await qRef.get();
  
    if (!qDoc.exists) {
      console.log("Queue not initialized");
    } else {
      q = qDoc.data()["queue"];
      for (let i=0; i < q.length; i++) {
        if (data === q[i]["health_card_number"]) {
          q.splice(i, 1);
          await qRef.set({"queue" : q});
        }
      }
    }
  
    return "Dequeued";
  });

  exports.queueIndex = functions.https.onCall(async (data, response) => {
    qRef = admin.firestore().collection("queue").doc("queue");
    qDoc = await qRef.get()
    if (!qDoc.exists) {
      console.log('Queue not initialized');
      return null;
    } 
    else {
      q = qDoc.data()["queue"];
      for (var i = 0; i < q.length;i++){
        if (data["health_card_number"] == q[i]["health_card_number"]){
          console.log(`Found ${data["health_card_number"]} at ${i}`);
          i++
          return i;
        }
      }
    }
  });


exports.addUser = functions.https.onCall((data, response) => {
  console.log(data);
  admin.firestore().collection("users").doc(data["health_card_number"]).set({
    "first_name": data["first_name"],
    "last_name": data["last_name"],
    "age": data["age"],
    "is_essential": data["is_essential"],
    "in_group_setting": data["in_group_setting"],
    "is_nurse": data["is_nurse"],
    "is_pregnant": data["is_pregnant"],
    "health_card_number": data["health_card_number"],
    "priority_number": data["priority_number"]
  });
});

exports.userCheck = functions.https.onCall(async (data, response) => {
  userRef = admin.firestore().collection("users").doc(data);
  const doc = await userRef.get();
  if (!doc.exists) {
    console.log('No such document!');
    return null;
  } else {
    console.log('Document data:', doc.data());
    return doc.data();
  }
});
