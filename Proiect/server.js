const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');

const PORT = 3000;
app.listen(PORT);
console.log('Running at Port 3000');


//add the router
app.use('/', router);
app.use("/static", express.static('./static/'));
app.use("/src", express.static('./src/'));



//routes
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
	// res.send('asd')
	res.send({message: "Task added!"});
	res.end();
});


