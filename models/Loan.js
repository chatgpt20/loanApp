const db = require('../controllers/firebaseAdmin');
const Transaction = require('./Transaction');

module.exports.create = async(id,description,eventId,amount,status,user,name) => {
  status = {};
    db.collection('loans').add({
        Id: id,
        Description: description,
        EventId: eventId,
        Amount: amount,
        Status: status,
        User: user,
        OtherUser: name
      }).then((result) => {
        console.log('Added document with ID: ', result.id);
        status.transaction = Transaction.create(amount,id);
        status.loan.success = 201;
        return status
        
      }).catch((err) => {
        console.log(err);
        status.loan.err = err;
        return status;
      }); 
      
}