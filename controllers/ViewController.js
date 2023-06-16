const db = require("./firebaseAdmin");

module.exports.dashboard_get = async (req, res) => {
    const currentUser = req.body.userId;
  
    try {
      let usersRef = db.collection("users");
  
      var userSnapshots = await usersRef.where("UserId", "==", currentUser).get();
      var userFullName;
  
      userSnapshots.forEach((document) => {
        userFullName = document.data()["Name"];
      });
  
      var totalAmount = 0;
  
      // ----------------------------------------- Not Paid ---------------------------------------------------------
  
      let transactionRef = db.collection("notpaid");
  
      var transactionSnapshots = await transactionRef
        .where("User", "==", currentUser)
        .get();
  
      transactionSnapshots.forEach((document) => {
        const amount = document.data()["Amount"];
        totalAmount = totalAmount + amount;
      });
  
      var transactionSnapshots = await transactionRef
        .where("OtherUser", "==", currentUser)
        .get();
  
      transactionSnapshots.forEach((document) => {
        const amount = document.data()["Amount"];
        totalAmount = totalAmount - amount;
      });
  
      //--------------------------------------- Paid --------------------------------------------------------
  
      let paidRef = db.collection("paid");
  
      var paidSnapshots = await paidRef
        .where("User", "==", currentUser)
        .get();
  
      paidSnapshots.forEach((document) => {
        const amount = document.data()["Amount"];
        totalAmount = totalAmount - amount;
      });
  
      var paidSnapshots = await paidRef
        .where("OtherUser", "==", currentUser)
        .get();
  
        paidSnapshots.forEach((document) => {
        const amount = document.data()["Amount"];
        totalAmount = totalAmount + amount;
      });
  
      const numArray = totalAmount.toFixed(2).split(".");
      
  
      res.render("dashboard", {
        amountMain: numArray[0],
        amountCents: numArray[1],
        userFullName: userFullName,
      });
    } catch (error) {
      res.send(error);
    }
  }


  module.exports.view_users_get = async (req, res) => {
    const currentUser = req.body.userId;
  
    try {
      var otherUsers = [];
      let usersRef = db.collection("users");
      let transactionRef = db.collection("notpaid");
      let paidRef = db.collection("paid");
      const usersnapshots = await usersRef.get();
      const transactionSnapshotsDebit = await transactionRef
        .where("User", "==", currentUser)
        .get();
      const transactionSnapshotsCredit = await transactionRef
        .where("OtherUser", "==", currentUser)
        .get();
  
        const paidSnapshotDebit = await paidRef
        .where("User", "==", currentUser)
        .get();
      const paidSnapshotsCredit = await paidRef
        .where("OtherUser", "==", currentUser)
        .get();
  
      usersnapshots.forEach((document) => {
        
        if (
          document.data()["UserId"] != "admin" && document.data()["UserId"] != currentUser
        ) {
  
          var userDetails = {
            user: document.data()['Name'],
            amount : 0
          };
          transactionSnapshotsDebit.forEach((debitDoc) => {
            if (debitDoc.data()['OtherUser'] === document.data()["UserId"]) {
              userDetails.amount = userDetails.amount + debitDoc.data()['Amount'];
            }
          });
  
          transactionSnapshotsCredit.forEach((creditDoc) => {
            if (creditDoc.data()['User'] === document.data()["UserId"]) {
              userDetails.amount = userDetails.amount - creditDoc.data()['Amount'];
            }
          });
  
          paidSnapshotDebit.forEach((paidDebitDoc) => {
            if (paidDebitDoc.data()['OtherUser'] === document.data()["UserId"]) {
              userDetails.amount = userDetails.amount - paidDebitDoc.data()['Amount'];
            }
          });
  
          paidSnapshotsCredit.forEach((paidCreditDoc) => {
            if (paidCreditDoc.data()['User'] === document.data()["UserId"]) {
              userDetails.amount = userDetails.amount + paidCreditDoc.data()['Amount'];
            }
          });
  
          otherUsers.push(userDetails);
        }
      });
  
      res.render('viewUsers',{ users: otherUsers });
    } catch (error) {
      res.send(error);
    }
  }

  module.exports.view_events_get = async (req, res) => {
  
    const currentUser = req.body.userId;
  
    let eventRef = db.collection("events");
  
    const otherEvents = await eventRef.where("Loaned", "array-contains", currentUser).get();
  
    const paidEvents = await eventRef.where("Paid", "==", currentUser).get();
  
    var events = [];
  
    otherEvents.forEach((doc) => {
      var eventDetails = {
        name: doc.data()['Name'],
        amount: doc.data()['Amount']
      };
  
      const createdDate = doc.data()["CreatedDate"].toDate();
      eventDetails.createdDate = createdDate;
  
      const dateString = createdDate.getFullYear() + ' ' + createdDate.toLocaleString('en-US', { month: 'short' }) + ' ' + String(createdDate.getDate()).padStart(2, '0');
      eventDetails.dateString = dateString;
  
      events.push(eventDetails);
  
    });
  
    paidEvents.forEach((doc) => {
      var eventDetails = {
        name: doc.data()['Name'],
        amount: doc.data()['Amount']
      };
  
      const createdDate = doc.data()["CreatedDate"].toDate();
      eventDetails.createdDate = createdDate;
  
      const dateString = createdDate.getFullYear() + ' ' + createdDate.toLocaleString('en-US', { month: 'short' }) + ' ' + String(createdDate.getDate()).padStart(2, '0');
      eventDetails.dateString = dateString;
  
      events.push(eventDetails);
  
    });
  
    events.sort(function (a, b) {
      return new Date(b.createdDate) - new Date(a.createdDate);
    });
  
    res.render('viewEvents',{ events: events });
    
  }

  module.exports.completed_loans_get = async (req, res) => {
  
    const currentUser = req.body.userId;
    var loans = [];
    var loanUsers = [];
  
    try {
      let users = db.collection("users");
      userSnapshots = await users.get();
  
      userSnapshots.forEach((document) => {
        if (document.data()["UserId"] != "admin" && document.data()["UserId"] != currentUser) {
          loanUsers[document.data()["UserId"]] = document.data()["Name"];
        }
      });
  
    let loanRef = db.collection("loans");
  
    const loanSnapshotDebit = await loanRef.where('User', '==', currentUser).where('Status', '==', 'Paid').get();
  
    const loanSnapshotCredit = await loanRef.where('OtherUser', '==', currentUser).where('Status', '==', 'Paid').get();
  
    loanSnapshotDebit.forEach((doc) => {
      var loanDetails = {
        description: doc.data()['Description'],
        amount: doc.data()['Amount'],
        user: doc.data()['OtherUser'],
        type: 'Debit'
      }
  
      const completedDate = doc.data()["CompletedDate"].toDate();
      loanDetails.createdDate = completedDate;
  
      const dateString = completedDate.getFullYear() + ' ' + completedDate.toLocaleString('en-US', { month: 'short' }) + ' ' + String(completedDate.getDate()).padStart(2, '0');
      loanDetails.completedDateString = dateString;
  
      loans.push(loanDetails);
    });
  
    loanSnapshotCredit.forEach((doc) => {
      var loanDetails = {
        description: doc.data()['Description'],
        amount: (doc.data()['Amount'] * -1),
        user: doc.data()['User'],
        type: 'Credit'
      }
  
      const completedDate = doc.data()["CompletedDate"].toDate();
      loanDetails.createdDate = completedDate;
  
      const dateString = completedDate.getFullYear() + ' ' + completedDate.toLocaleString('en-US', { month: 'short' }) + ' ' + String(completedDate.getDate()).padStart(2, '0');
      loanDetails.completedDateString = dateString;
  
      loans.push(loanDetails);
    });
  
  
    loans.sort(function (a, b) {
      return new Date(b.createdDate) - new Date(a.createdDate);
    });
    res.render("completedLoans", {
      chooseUser: loanUsers,
      loans: loans
    });
  
  } catch (error) {
      res.send(error);
  }
   
  }

