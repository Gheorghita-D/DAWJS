const express = require('express');
const app = express(); 
const model = require('./model.js'); 
const mongoose = require('mongoose');


var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');



const PORT = 3000;
app.listen(PORT); // change from app
console.log('Running at Port 3000');

app.set('view engine', 'ejs'); // change from app
app.use("/static", express.static('./static/'));
app.use("/src", express.static('./src/'));

var data = {page:"home"};
//routes
app.get('/',function(req,res){
	res.render('index', {data});
});

app.get('/projects',function(req,res){
		model.Projects.find({}, '', function(err, projects){
			data = {
				page: "projects",
				proj: projects
			};	
			res.render('index', {data});
		});
});


app.get('/board',function(req,res){
	model.Categories.find({id_project:req.query.id}, '', function(err, categories){
		data = {
			page: "boards",
			cat: categories,
		};
		res.render('index', {data});
	});
});



app.get('/login',function(req,res){
	data = {page:"login"};
	res.render('index',{data});
});

app.get('/register',function(req,res){
	data = { page: "register" };
	res.render('index',{data});
});


 /*-- adauga in baza de date userul la inregistrare --*/
app.use(express.urlencoded());
app.use(express.json());      // if needed
// app.post('/register', function(request,response){

// 	var email = request.body.email;
// 	var password = request.body.psw;

// 	var newuser = new model.Users();
// 	newuser.username = email;
// 	newuser.password = password;
// 	newuser.id = '123345'; // trebuie pus random id

// 	newuser.save(function(err, savedUser){
// 		if(err){
// 			console.log("eroare: " + err);
// 			return response.status(500).send();
// 		}
		
// 		return response.render('index', {data});
	
// 	});
// });
/* --end-- */

app.post('/tasks',function(req,res){
	console.log("ihhkkjg")
	// res.send('asd')
	res.send({message: "Task added!"});
	res.end();
});


app.post('/delete', function(req, res){

	var cat = model.Categories;
	var ID = req.body.id.split(" ")[1];
	
	cat.findByIdAndUpdate(
		ID,
		 {$pull : {'tickets' : {id:req.body.id.split(" ")[0]}}},function(err, mod){
			 if(err){
				 console.log(err);
			 }else{
				 console.log("yeey, deleted task");
			 }
		 }
	 );
	res.render('index', {data});
})

app.post('/add', function(req, res){

	var cat = model.Categories;
	var ID = req.body.id.split(" ")[1];
	cat.findByIdAndUpdate(
	   ID,
		{$push : {'tickets' : {id:req.body.id.split(" ")[0], name:req.body.name }}},function(err, mod){
			if(err){
				console.log(err);
			}else{
				console.log("yeey, added task");
			}
		}
	);	
   res.render('index', {data});
})



app.post('/addcat', function(req,res){
	var cat = model.Categories;
	// var ID = mongoose.mongo.ObjectID("5e1cc83426fd042b5830f189");
	
	var newcategory = new model.Categories();
	var ID_cat = mongoose.Types.ObjectId()

	newcategory._id = ID_cat;
	newcategory.name =  req.body.name;
	newcategory.id =  req.body.id;
	newcategory.id_project = req.body.id_project;

	newcategory.save(function(err, savedCat){
		if(err){
			console.log("erroare: " + err);
		}
		console.log("adaugat cat");
		
	});
	res.set('Content-Type', 'application/json');
	res.send({id:ID_cat});
})

app.post('/addproject', function(req,res){
	var proj = model.Projects;
	if(req.body.column_name === "title"){
		proj.findOneAndUpdate({id: req.body.proj_id},
			{$set: {title: req.body.data }}, 
			{upsert: true },
			function(err, doc){
				if(err){
					console.log("Error" + err);
				}
		});
	}else if(req.body.column_name === "description"){
		proj.findOneAndUpdate({id: req.body.proj_id},
			{$set: {description: req.body.data }}, 
			{upsert: true },
			function(err, doc){
				if(err){
					console.log("Error" + err);
				}
		});
	}else if(req.body.column_name === "deadline"){
		proj.findOneAndUpdate({id: req.body.proj_id},
			{$set: {deadline: req.body.data }}, 
			{upsert: true },
			function(err, doc){
				if(err){
					console.log("Error" + err);
				}
		});
	}
	
	// var query = {'id':req.body.proj_id};
	// proj.findOneAndUpdate(query, req.body.content)

})


app.post('/register', function (req, res) {
	var id = mongoose.Types.ObjectId();

	var hashedPassword = bcrypt.hashSync(req.body.psw, 8);

	model.Users.create({
		username: req.body.email,
		// email: req.body.email,
		password: hashedPassword,
	  	id: id,
	},
		function (err, user) {
			if (err) return res.status(500).send("There was a problem registering the user.")
			// create a token
			// var token = jwt.sign({ id: user._id }, config.secret, {
			// 	expiresIn: 86400 // expires in 24 hours
			// });
			// res.status(200).send('Successfully registered!');
			data = {page:"login"};
			res.render('index', {data});
			//cookie
		});
});
var authData;
app.post('/login', function(req, res) {

	model.Users.findOne({ username : req.body.uname }, function (err, user) {
	  if (err) return res.status(500).send('Error on the server.');
	  if (!user) return res.status(404).send('No user found.');
	  
	  var passwordIsValid = bcrypt.compareSync(req.body.psw, user.password);
	  if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
	  
	  var token = jwt.sign({ id: user._id }, "123456789", {
		expiresIn: 86400 // expires in 24 hours
	  });
	  
	//   res.status(200).send({ auth: true, token: token, user: user.id });
	
	  authData = {
		auth: true, token: token, user: user.id
	  }
	  data = {page:"projects",authData: authData}
	  res.render('index', {data});
	});
	
  });

  app.get("/token", function(req, res){
	res.send({authData})
  })
