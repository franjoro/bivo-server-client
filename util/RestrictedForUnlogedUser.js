const { admin, db } = require('./db');

module.exports = (req, res, next) => {
    let idToken;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('bivo ')
    ) {
        idToken = req.headers.authorization.split('bivo ')[1];
    } else {
        console.error('No token found');
        return res.status(403).json({ error: 'Unauthorized' });
    }

    admin
        .auth()
        .verifyIdToken(idToken)
        .then((decodedToken) => {
            req.user = decodedToken;
            return db
                .collection('users')
                .where('email', '==', req.user.email)
                .limit(1)
                .get();
        })
        .then((data) => {
            req.sesion = data.docs[0].data().email;
            return next();
        })
        .catch((err) => {
            console.error('Error while verifying token ', err);
            return res.status(403).json(err);
        });
};