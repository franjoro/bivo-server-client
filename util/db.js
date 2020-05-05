const admin = require('firebase-admin');
let serviceAccount = require('./bivo-2cb42-048ce18e5323.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();


// const config = require('./config_firebase');
// const firebase = require('firebase');
// firebase.initializeApp(config);


module.exports = { db};