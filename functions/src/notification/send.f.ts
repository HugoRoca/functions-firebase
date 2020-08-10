import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as cors from "cors";
import * as express from "express";
import * as cookieParser from "cookie-parser";

if (!admin.apps.length) {
  admin.initializeApp();
}

const messaging = admin.messaging();
const endPointExpress = express();
const corsVal = cors({ origin: true });

endPointExpress.options("*", corsVal);
endPointExpress.use(corsVal).use(cookieParser());
endPointExpress.post("*", async (req: any, res: any) => {
  try {
    const notificationToken = req.body.token;
    const options = {
      priority: "high",
      timeToLive: 60 * 60 * 24,
    };
    const payLoad = {
      notification: {
        title: "Hi of app functions",
        body: "this is a notification of test",
      },
      data: {
        additionalRock: "This is attribute optional",
        additionalHugo: "This is a attribute optional",
      },
    };

    if (notificationToken && notificationToken.length > 0) {
      const response = await messaging.sendToDevice(
        notificationToken,
        payLoad,
        options
      );
      res.status(200);
      res.send({
        status: "success",
        message: "The notification send correctly",
        detail: response,
      });
    } else {
      res.status(200);
      res.send({ status: "success", message: "Token is not found" });
    }
  } catch (error) {
    res.status(401);
    res.send(error);
  }
});

exports = module.exports = functions.https.onRequest((request, response) => {
  return endPointExpress(request, response);
});
