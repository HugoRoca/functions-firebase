import * as admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp();
}

export function validateToken(tokenRoles: any) {
  return async function (req: any, res: any, next: any) {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      res.status(200);
      res.send({ status: "error", message: "not found token" });
      return;
    }

    try {
      const split = authorization.split("Bearer ");

      if (split.length !== 2) {
        res.status(200);
        res.send({ status: "error", message: "not found token" });
        return;
      }

      const token = split[1];
      const tokenDeCodification = await admin.auth().verifyIdToken(token);
      let statusRequest = false;

      tokenRoles.map((role: string) => {
        if (tokenDeCodification[role] === true) {
          statusRequest = true;
        }
      });

      if (!statusRequest) {
        res.status(200);
        res.send({ status: "error", message: "not permission exists" });
        return;
      }

      req.user = tokenDeCodification;

      next();
    } catch (error) {
      res.status(200);
      res.send({ status: "error", message: "error when de-codification" });
    }
  };
}
