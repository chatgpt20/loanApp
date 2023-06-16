const db = require("./firebaseAdmin");

module.exports.payloan_get = async (req,res) => {
    const currentUser = req.body.userId;
    // console.log(currentUser);

  let users = db.collection("users");
  let transactionRef = db.collection("notpaid");
  let payReceiveRef = db.collection("paid");
  let loanRef = db.collection("loans");
  var loanUsers = {};
  var userTransactions = [];

  try {
    userSnapshots = await users.get();
    userSnapshots.forEach((document) => {
      if (document.data()["UserId"] != "admin" && document.data()["UserId"] != currentUser) {
        loanUsers[document.data()["UserId"]] = document.data()["Name"];
      }
    });

    const transactionSnapshotsDebit = await transactionRef
      .where("User", "==", currentUser)
      .get();

    // -----------------------------------------------------------------------------------------------------------------------

    var totalDebit = 0;
    var transactionDebitDocs = [];
    
    transactionSnapshotsDebit.forEach((doc) => {
      transactionDebitDocs.push(doc);
    });

    for (let i = 0; i < transactionDebitDocs.length; i++) {
      const loanDoc = transactionDebitDocs[i];


      transactionDebitDetails = {
        loanId: loanDoc.data()["LoanId"],
        amount: loanDoc.data()["Amount"],
        user:loanDoc.data()['OtherUser'],
        type: "Debit",
      };

      const loansSnapshot = await loanRef
        .where("Id", "==", transactionDebitDetails.loanId)
        .get();


      loansSnapshot.forEach((loanDetails) => {
        transactionDebitDetails.description = loanDetails.data()["Description"];
      });

      // console.log(transactionDebitDetails.description);
      const createdDate = loanDoc.data()["Date"].toDate();

      // console.log(createdDate);

      const dateString = createdDate.getFullYear() + "-" +  String((createdDate.getMonth() + 1)).padStart(2, '0')+ "-" + String(createdDate.getDate()).padStart(2, '0');;

      transactionDebitDetails.createdDate = createdDate;
      transactionDebitDetails.createdDateString = dateString;
      // console.log(dateString);

      const receivedSnapshot = await payReceiveRef
        .where("LoanId", "==", transactionDebitDetails.loanId)
        .get();

      if (receivedSnapshot.empty) {
        console.log("No Paid Transactions.");
      } else {
        receivedSnapshot.forEach((receivedDoc) => {
          console.log(receivedDoc.data()["Amount"]);
          transactionDebitDetails.amount =
            transactionDebitDetails.amount - receivedDoc.data()["Amount"];
            paidDocIds.push(receivedDoc.id);
        });
      }

      totalDebit = totalDebit + transactionDebitDetails.amount;
      // console.log(totalDebit);
      userTransactions.push(transactionDebitDetails);
      
    }

    // -------------------------------------------------------------------------------------------------------------------------------------

    const transactionSnapshotsCredit = await transactionRef
      .where("OtherUser", "==", currentUser)
      .get();
    // console.log(transactionSnapshotsCredit);

    var totalCredit = 0;
    var transactionCreditDocs = [];

    transactionSnapshotsCredit.forEach((doc) => {
      transactionCreditDocs.push(doc);
    });

    for (let i = 0; i<transactionCreditDocs.length; i++){

      const loanDoc = transactionCreditDocs[i];

      const transDocId = loanDoc.id;

      transactionDetails = {
        loanId: loanDoc.data()["LoanId"],
        amount: (loanDoc.data()["Amount"] * -1),
        user:loanDoc.data()['User'],
        type: "Credit",
      };

      // console.log(loanDoc.data()["LoanId"]);

      const loansSnapshot = await loanRef
        .where("Id", "==", loanDoc.data()["LoanId"])
        .get();
      // console.log(loansSnapshot);
      var loanDocId;

      loansSnapshot.forEach((loanDetails) => {
        loanDocId = loanDetails.id;
        transactionDetails.description = loanDetails.data()["Description"];
      });

      // console.log(transactionDetails.description);

      // console.log(loanDoc.data());
      const createdDate = loanDoc.data()["Date"].toDate();

      // console.log(createdDate);

      const dateString =
        createdDate.getFullYear() + "-" +  String((createdDate.getMonth() + 1)).padStart(2, '0')+ "-" + String(createdDate.getDate()).padStart(2, '0');
      transactionDetails.createdDate = createdDate;
      transactionDetails.createdDateString = dateString;
      // console.log(dateString);

      const paidSnapshots = await payReceiveRef
        .where("LoanId", "==", loanDoc.data()["LoanId"])
        .get();

        var paidDocIds = [];

      paidSnapshots.forEach((receivedDoc) => {
        transactionDetails.amount =
          transactionDetails.amount + receivedDoc.data()["Amount"];
          paidDocIds.push(receivedDoc.id);
      });

      if (transactionDetails.amount == 0) {
        console.log(loanDoc.data()["LoanId"]);

          const res = await db.collection('notpaid').doc(transDocId).delete();
          for (let i = 0;i<paidDocIds.length;i++) {
            const res = await db.collection('paid').doc(paidDocIds[i]).delete();
          }

          let sysdate = new Date();

          const resSetData = await db.collection('loans').doc(loanDocId).update(
            {
              Status:'Paid',
              CompletedDate:sysdate
            }
          );
        
      } else {

      totalCredit = totalCredit + transactionDetails.amount;
      userTransactions.push(transactionDetails);
      }
    }

    userTransactions.sort(function (a, b) {
      return new Date(b.createdDate) - new Date(a.createdDate);
    });

    res.render("myloans", {
      chooseUser: loanUsers,
      userTransactions: userTransactions,
      totalCredit: totalCredit,
      totalDebit: totalDebit,
    });


  } catch (error) {
    res.send(error);
  }
}

module.exports.payment_get = async (req, res) => {
  const loanId = req.query.loanId;
  const amount = Math.abs(req.query.amount);
  res.render('payment',{ loanId:loanId,amount: amount });

}

module.exports.payment_post =  async (req, res) => {
  const loanId = req.body.loanId;
  const amount = Number(req.body.amount);

  try {

  let loanRef = db.collection("loans");

  const loanSnapshot = await loanRef.where("Id", "==", loanId).get();

  var user;
  var otherUser;
  var loanAmount;
  var paidAmount = 0;

  loanSnapshot.forEach((doc) => {
    loanAmount = doc.data()['Amount'];
    user = doc.data()['User'];
    otherUser = doc.data()['OtherUser'];
  });

  let paidRef = db.collection("paid");

  const paidSnapshot = await paidRef.where("Id", "==", loanId).get();

  paidSnapshot.forEach((doc) => {
    paidAmount = paidAmount + doc.data()['Amount'];
  });
  
    let sysdate = new Date();

  const result = await db.collection('paid').add({
    Date: sysdate,
    Amount: amount,
    LoanId: loanId,
    User: user,
    OtherUser: otherUser
  });

  if (result.id) {
    res.status(201).json({success: result.id});
  }
  } catch (error) {
    res.status(400).json({err: error});
  }


}

module.exports.paymentSuccess_get = async (req, res) => {

  res.render('paymentSuccess');

}
