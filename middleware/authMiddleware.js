const jwt = require('jsonwebtoken');
const db = require('../controllers/firebaseAdmin');

const requireAuth = (req,res,next) => {

    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token,'this is my secret 1234',async (err,decodedToken) => {
            if (err) {
               console.log(err.message);
               res.redirect('/login');
            } else {
                // console.log(decodedToken);
                const userId = await getUserDetails(decodedToken.id)
                req.body.userId = userId;
                next();
            }
        });
    } else {
        res.redirect('/login');
    }
}

const getUserDetails = async (id) => {
    const userRef = db.collection('users').doc(id);
    // console.log(id);
    const doc = await userRef.get();
    if (!doc.exists) {
        console.log('No such document!');
    } else {
        // console.log(doc.data()['UserId']);
        return doc.data()['UserId'];
    }
}

module.exports = { requireAuth };