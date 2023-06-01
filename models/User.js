const db = require('../controllers/firebaseAdmin');

module.exports.login = async (username,password) => {

    // console.log(username);
    let users = db.collection("users");

    const snapshot = await users.where('UserId','==',username).where('Password','==',password).get();
   
    let user = {};    
    if (snapshot.empty) {
        user.error = 'Enter a valid Username or Password';
        return user;
    }
        
    snapshot.forEach((document) => {
        // console.log(document.id);
        user.id = document.id;
        user.username = document.data()['UserId'];
        user.password = document.data()['Password'];
          });
        
    return user;
    
  

  
}