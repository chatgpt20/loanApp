const db = require('../controllers/firebaseAdmin');

module.exports.create = async(amount,loanId) => {

    let sysdate = new Date();

    transaction = {};

    db.collection('notpaid').add({
        Date: sysdate,
        Amount: amount,
        LoanId: loanId
      }).then((result) => {
        console.log('Added document with ID: ', result.id);
        transaction.success = 201;
        return transaction;
      }).catch((err) => {
        console.log(err);
        transaction.err = err;
        return transaction;
      });

}