import * as functions from "firebase-functions";
import * as cors from "cors";
import * as express from "express";
import * as nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "hugo.rock20@gmail.com",
    pass: "",
  },
});
const endPointExpress = express();
const corsVal = cors({ origin: true });

endPointExpress.options("*", corsVal);
endPointExpress.use(corsVal).use(express.json);
endPointExpress.post("*", async (req: any, res: any) => {
  const _email = req.body.email;
  const _title = req.body.title;
  const _message = req.body.message;
  const emailOptions = {
    from: "hugo.rock20@gmail.com",
    to: _email,
    subject: _title,
    html: `<p>${_message}</p>`,
  };

  transport.sendMail(emailOptions, function (err, info) {
    if (err) res.send(err);
    else {
      res.send("Email sended");
    }
  });
});

exports = module.exports = functions.https.onRequest((request, response) => {
  return endPointExpress(request, response);
});
