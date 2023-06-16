const db = require('../controllers/firebaseAdmin');
const { remove } = require('./Event');
const Transaction = require('./Transaction');

module.exports.create = async(description,eventId,amount,type,user,name) => {
  createdStatus = {};

  var loanId = await getLoanId();

  try {
    const result = await db.collection('loans').add({
      Id: loanId,
      Description: description,
      EventId: eventId,
      Amount: amount,
      Status: type,
      User: user,
      OtherUser: name,
      CompletedDate:null
    });

    console.log('Added document with ID: ', result.id);
    createdStatus.loan = result.id;
    createdStatus.transaction = await Transaction.create(amount,loanId,user,name);

    if (createdStatus.transaction == 'error') {
      createdStatus.loan = remove(createdStatus.loan);
    }
    return createdStatus
  } catch (err) {
    console.log(err);
    createdStatus.loan = 'error';
    createdStatus.transaction = 'not created'
    return createdStatus;

  }

}

module.exports.remove = async (docId) => {
  deletedStatus = '';
  try {

    const res = await db.collection('loans').doc(docId).delete();
    console.log(res);
    deletedStatus = 'deletion successful';
    return deletedStatus
    
  } catch (err) {
    deletedStatus = 'loan deletion unsuccessful';
    return deletedStatus;
  }
}

getLoanId = async () => {
    var loanId;
    let loans = db.collection("loans");

    const snapshot = await loans.orderBy('Id', 'desc').limit(1).get();

    snapshot.forEach(doc => {
        // console.log(doc.data());
        loanId = doc.data()['Id'];
    });

    return loanId + 1;
}