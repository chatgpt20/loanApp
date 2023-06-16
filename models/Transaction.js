const db = require('../controllers/firebaseAdmin');

module.exports.create = async(amount,loanId,user,name) => {
   transStatus = '';
  try {
    let sysdate = new Date();

    const result = await db.collection('notpaid').add({
        Date: sysdate,
        Amount: amount,
        LoanId: loanId,
        User: user,
        OtherUser: name
      });

      console.log('Added document with ID: ', result.id);
      transStatus = result.id;
      return transStatus;
  } catch (error) {
    console.log(err);
    transStatus = 'error';
    return transStatus;
  }

}

module.exports.remove = async (docId) => {
  deletedStatus = '';
  try {

    const res = await db.collection('notpaid').doc(docId).delete();
    console.log(res);
    deletedStatus = 'deletion successful';
    return deletedStatus
    
  } catch (err) {
    deletedStatus = 'transaction deletion unsuccessful';
    return deletedStatus;
  }
}