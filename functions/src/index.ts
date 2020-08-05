import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

export const listHouses = functions.https.onRequest(
  async (request, response) => {
    const houses = db.collection("Properties");
    const snapshot = await houses.get();
    const arrayJson = snapshot.docs.map((doc) => {
      const data = doc.data();
      const id = doc.id;
      return { id, ...data };
    });
    response.send(arrayJson);
  }
);
