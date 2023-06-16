var admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert({
    "type": process.env.TYPE,
    "project_id": process.env.PROJECT_ID,
    "private_key_id": process.env.PRIVATE_KEY_ID,
    "private_key": process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
    "client_email": process.env.CLIENT_EMAIL,
    "client_id": process.env.CLIENT_ID,
    "auth_uri": process.env.AUTH_URI,
    "token_uri": process.env.TOKEN_URL,
    "auth_provider_x509_cert_url": process.env.AUTH_PROVIDE,
    "client_x509_cert_url": process.env.CLIENT_URL,
    "universe_domain": process.env.UNIVERSE_DOMAIN
  })
});

const db = admin.firestore();

module.exports = db;
