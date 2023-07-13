const db = require("./firebaseAdmin");

async function findAndDeleteLoan(loanId) {

    deleteStatus = {};

    let loanRef = db.collection("loans");
    let transactionRef = db.collection("notpaid");
    let payReceiveRef = db.collection("paid");

    try {

        const loanSnapshot = await loanRef.where("Id", "==", loanId).get();
        const transactionSnapshot = await transactionRef.where("LoanId", "==", loanId).get();
        const payReceiveSnapshot = await payReceiveRef.where("LoanId", "==", loanId).get();

        var loanDocs = [];
        var transactionDocs = [];
        var payReceiveDocs = [];

        loanSnapshot.forEach((doc) => {
            loanDocs.push(doc);
        });

        transactionSnapshot.forEach((doc) => {
            transactionDocs.push(doc);
        });

        payReceiveSnapshot.forEach((doc) => {
            payReceiveDocs.push(doc);
        });

        for (let i = 0; i<payReceiveDocs.length;i++) {
            const res = await db.collection('paid').doc(payReceiveDocs[i].id).delete();
            // console.log('paid' + payReceiveDocs[i].id);
        }

        for (let i = 0; i<transactionDocs.length;i++) {
            const res = await db.collection('notpaid').doc(transactionDocs[i].id).delete();
            // console.log('not paid' + transactionDocs[i].id);
        }

        for (let i = 0; i<loanDocs.length;i++) {

            const res = await db.collection('loans').doc(loanDocs[i].id).delete();
            // console.log('loan' + loanDocs[i].id);
        }

        deleteStatus.success = true;
        
    } catch (err) {
        console.log(err);
        deleteStatus.error = err;
    }

    return deleteStatus;
}


module.exports.delete_event = async (req,res) => {
    const eventId = req.body.event;

    let loanRef = db.collection("loans");
    let eventRef = db.collection("events");

    // console.log('hi');

    try {
        
    

    const loanSnapshot = await loanRef.where("EventId", "==", eventId).get();
    const eventSnapshot = await eventRef.where("Id", "==", eventId).get();

    var loanDocs = [];
    var eventDocs = [];
    var isNoError = true;
    var errorText = '';

    eventSnapshot.forEach((doc) => {
        eventDocs.push(doc);
    });

    loanSnapshot.forEach((doc) => {
        loanDocs.push(doc);
    });

    for (let i = 0; i<eventDocs.length;i++) {

        const res = await db.collection('events').doc(eventDocs[i].id).delete();
    }

    for (let i = 0; i<loanDocs.length;i++) {

        const res = await findAndDeleteLoan(loanDocs[i].data()['Id']);

        if (res.error) {
            isNoError = false;
            errorText = res.error;
        }
    }

    if (isNoError) {
        res.status(201).json({success: 'success'});
    } else {
        res.status(400).json({err: errorText});
    }

  } catch (err) {
    console.log(err);
    res.status(400).json({err: err});
  } 

}

module.exports.delete_loan = async (req,res) => {
    const loanId = req.body.loanId;

    const res1 = await findAndDeleteLoan(loanId);

    if (res.error) {
        res.status(400).json({err: res.error});
    } else {
        res.status(201).json({success: 'success'});
    }
}
