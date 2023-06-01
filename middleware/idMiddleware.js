const db = require('../controllers/firebaseAdmin');

const getLoanId = async (req,res,next) => {

    let loans = db.collection("loans");

    const snapshot = await loans.orderBy('Id', 'desc').limit(1).get();

    snapshot.forEach(doc => {
        // console.log(doc.data());
        req.body.loanId = doc.data()['Id'];
        next();
    });

 
}

const getEventId = async (req,res,next) => {

    let events = db.collection("events");

    const snapshot = await events.orderBy('Id', 'desc').limit(1).get();

    snapshot.forEach(doc => {
        // console.log(doc.data());
        req.body.eventId = doc.data()['Id'];
        next();
    });

 
}

module.exports = { getLoanId,getEventId };