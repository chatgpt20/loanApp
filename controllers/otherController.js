const db = require("./firebaseAdmin");
const Loan = require("../models/Loan");
const Event = require("../models/Event");

module.exports.addloan_get = (req, res) => {

    const currentUser = req.body.userId;

    let users = db.collection("users");
  
    users.get().then((querySnapshot) => {
      var loanUsers = {};
      querySnapshot.forEach((document) => {
        if (document.data()["UserId"] != "admin" && document.data()["UserId"] != currentUser) {
          loanUsers[document.data()["UserId"]] = document.data()["Name"];
        }
      });
      res.render("addloan", { chooseUser: loanUsers });
    });
  }

  module.exports.addloan_post = async (req, res) => {
    const name = req.body.name;
    const description = req.body.description;
    const amount = Number(req.body.amount);
    const currentUser = req.body.userId;
    const id = req.body.loanId + 1;
  
    const status = await Loan.create(
      description,
      null,
      amount,
      "Not Paid",
      currentUser,
      name
    );
  
    if (
      status.loan == "error" ||
      status.loan == "deletion successful" ||
      status.loan == "loan deletion unsuccessful"
    ) {
      console.log(status.loan);
      res.status(400).json({ err: status.loan });
    } else {
      res.status(201).json({ success: status.loan });
    }
  }

  module.exports.create_event_get = (req, res) => {
    let users = db.collection("users");
  
    users.get().then((querySnapshot) => {
      var loanUsers = {};
      querySnapshot.forEach((document) => {
        if (document.data()["UserId"] != "admin") {
          loanUsers[document.data()["UserId"]] = document.data()["Name"];
        }
      });
      res.render("createevent", { chooseUser: loanUsers });
    });
  }

  module.exports.create_event_post = async (req, res) => {
    const name = req.body.name;
    const description = req.body.description;
    const amount = Number(req.body.amount);
    const paidUser = req.body.paidUser;
    const tickedUser = req.body.otherUsers;
  
    const status = await Event.create(
      name,
      description,
      amount,
      paidUser,
      tickedUser
    );
    console.log(status);
    if (
      status.event == "error" ||
      status.event == "deletion successful" ||
      status.event == "event deletion unsuccessful"
    ) {
      console.log(status.event);
      res.status(400).json({ err: status.event });
    } else {
      res.status(201).json({ success: status.event });
    }
  }