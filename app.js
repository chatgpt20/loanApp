
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const ejs = require("ejs");
const authRoutes = require('./routes/authRoutes');
const db = require('./controllers/firebaseAdmin');
const { requireAuth } = require('./middleware/authMiddleware');
const { getLoanId,getEventId } = require('./middleware/idMiddleware');
const Loan = require('./models/Loan');


const app = express();

app.set('view engine', 'ejs');

// app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());

app.use(express.static("public"));

app.use(authRoutes);

app.get("/",requireAuth,(req,res) => {
  res.render('dashboard');
})

app.get("/addloan",requireAuth,(req,res) => {

  let users = db.collection("users");

  users.get().then((querySnapshot) => {
     var loanUsers = {};
    querySnapshot.forEach((document) => {
      if (document.data()['UserId'] != 'admin') {
      loanUsers[document.data()['UserId']] = document.data()['Name'];
      }
    });
    res.render('addloan',{chooseUser:loanUsers});
  })


})

app.post("/addloan",[requireAuth,getLoanId],async (req,res) => {

  const name = req.body.name;
  const description = req.body.description;
  const amount = req.body.amount;
  const currentUser = req.body.userId;
  const id = req.body.loanId + 1;

  // console.log(id);

  const status = await Loan.create(id,description,null,amount,'Not Paid',currentUser,name);
  if (status.loan.success || status.transaction.sucess) {
    res.status(201).json(status);
  } else {
    res.status(400).json(status);
  }

})

app.get("/createevent",function(req,res) {

  let users = db.collection("users");

  users.get().then((querySnapshot) => {
     var loanUsers = {};
    querySnapshot.forEach((document) => {
      if (document.data()['UserId'] != 'admin') {
      loanUsers[document.data()['UserId']] = document.data()['Name'];
      }
    });
    res.render('createevent',{chooseUser:loanUsers});
  })
})

app.post("/createevent",[requireAuth,getEventId],async (req,res) => {

  const name = req.body.name;
  const description = req.body.description;
  const amount = req.body.amount;
  const currentUser = req.body.userId;
  const id = req.body.eventId + 1;

  // console.log(id);

  

})

app.listen(3000, function() {
  console.log("Server is running on port 3000");
});
