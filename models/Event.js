const db = require('../controllers/firebaseAdmin');
const Loan = require('./Loan');
const Transaction = require('./Transaction');

module.exports.create = async(name,description,amount,user,otherUsers) => {
  creatingStatus = {event: '',
loans:'not created',
transactions:'not created'}

var eventId = await getEventId();

  try {
    let sysdate = new Date();
    const result = await db.collection('events').add({
      Id: eventId,
      Name:name,
      Description: description,
      Amount: amount,
      Paid: user,
      Loaned: otherUsers,
      CreatedDate: sysdate,
      status:'not completed'
    });

    console.log('Added document with ID: ', result.id);
    creatingStatus.event = 'success';
    var hasError = false;
    var createdLoans = [];

    var loanAmount = amount / (otherUsers.length + 1);
    loanAmount = Number(loanAmount.toFixed(2));

    for (let i = 0; i< otherUsers.length; i++) {
        const loanStatus = await Loan.create(description,eventId,loanAmount,'Not Paid',user,otherUsers[i]);

        if (loanStatus.loan == 'error' || loanStatus.loan == 'deletion successful' || loanStatus.loan == 'loan deletion unsuccessful') {
            hasError = true;
            
            if (loanStatus.loan == 'error') {
                creatingStatus.loans = 'error' ; 
            } else {
                creatingStatus.transactions = 'error';
            }
            break;
        } else {
            createdLoans.push(loanStatus);
        }
    }

    if (hasError) {
        for (let i = 0;i<createdLoans.length;i++) {
            const loanDel = await Loan.remove(createdLoans[i].loan);
            const transDel = await Transaction.remove(createdLoans[i].transaction);
        }
    } else {
        creatingStatus.loans = 'success';
        creatingStatus.transactions = 'success';
    }
    return creatingStatus;
  } catch (err) {

    console.log(err);
    creatingStatus.event = 'error';
    return creatingStatus;

  }

}

module.exports.remove = async (docId) => {
    deletedStatus = '';
    try {
  
      const res = await db.collection('events').doc(docId).delete();
      console.log(res);
      deletedStatus = 'deletion successful';
      return deletedStatus
      
    } catch (err) {
      deletedStatus = 'event deletion unsuccessful';
      return deletedStatus;
    }
}

getEventId = async () => {

  var eventId;
  let events = db.collection("events");

  const snapshot = await events.orderBy('Id', 'desc').limit(1).get();

  snapshot.forEach(doc => {
      // console.log(doc.data());
      eventId = doc.data()['Id'];
  });

  return eventId + 1;
}