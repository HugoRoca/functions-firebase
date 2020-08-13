import * as functions from "firebase-functions";
import * as cors from "cors";
import * as express from "express";
import * as admin from "firebase-admin";
import * as cookieParser from "cookie-parser";
import { validateToken } from '../security/validateSession'

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const endPointExpress = express();
const corsVal = cors({ origin: true });

endPointExpress.options("*", corsVal);
endPointExpress.use(corsVal).use(cookieParser());
endPointExpress.use(validateToken(["ADMIN", "OPERATOR"]))
endPointExpress.post("*", async (req: any, res: any) => {
  try {
    const id = req.body.id;
    const role = req.body.role;
    const roles = req.body.roles;

    await admin.auth().setCustomUserClaims(id, role);

    await db
      .collection("Users")
      .doc(id)
      .set({ roles: roles }, { merge: true });

    res.status(200);
    res.send({ status: "success" });
  } catch (error) {
    res.status(403);
    res.send({ status: "error", message: error.message });
  }
});

exports = module.exports = functions.https.onRequest((request, response) => {
  return endPointExpress(request, response);
});
