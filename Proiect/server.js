const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();



router.get('/',function(req,res){
	res.sendFile(path.join(__dirname+'/index.html'));
});

router.get('/board',function(req,res){
	res.sendFile(path.join(__dirname+'/index.html'));
});

router.get('/login',function(req,res){
	res.sendFile(path.join(__dirname+'/index.html'));
});

router.get('/register',function(req,res){
	res.sendFile(path.join(__dirname+'/index.html'));
});

 /*-- adauga in baza de date userul la inregistrare --*/
const model = require('./model.js');
router.use(express.urlencoded());
router.use(express.json());      // if needed
router.post('/register', function(request,response){

	var email = request.body.email;
	var password = request.body.psw;

	var newuser = new model.Users();
	newuser.username = email;
	newuser.password = password;
	newuser.id = '123345';

	newuser.save(function(err, savedUser){
		if(err){
			console.log(err);
			return response.status(500).send();
		}
		return response.sendFile(path.join(__dirname+'/index.html'));
	});
	

	response.sendFile(path.join(__dirname+'/index.html'));
});
/* --end-- */

router.post('/tasks',function(req,res){
	console.log("ihhkkjg")
	res.send({message: "Task added!"})
});

app.use("/static", express.static('./static/'));
//add the router
app.use('/', router);
app.listen(process.env.port || 3003);

console.log('Running at Port 3000');

// const User = require('./model.js')

// // create a new user called chrisx	
// var chris = new User({
//   name: 'Chris' 
// });

// // call the custom method. this will just add -dude to his name
// // user will now be Chris-dude
// chris.dudify(function(err, name) {
//   if (err) throw err;

//   console.log('Your new name is ' + name);
// });

// // call the built-in save method to save to the database
// chris.save(function(err) {
//   if (err) throw err;

//   console.log('User saved successfully!');
// });

// // get all the users
// User.find({}, function(err, users) {
//   if (err) throw err;

//   // object of all the users
//   console.log(users);
// });
