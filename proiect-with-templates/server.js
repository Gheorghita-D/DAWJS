const express = require('express');
const app = express(); 
const model = require('./model.js'); 
const mongoose = require('mongoose');

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
app.post('/register', function(request,response){

	var email = request.body.email;
	var password = request.body.psw;

	var newuser = new model.Users();
	newuser.username = email;
	newuser.password = password;
	newuser.id = '123345'; // trebuie pus random id

	newuser.save(function(err, savedUser){
		if(err){
			console.log("eroare: " + err);
			return response.status(500).send();
		}
		
		return response.render('index', {data});
	
	});
});
/* --end-- */

app.post('/tasks',function(req,res){
	console.log("ihhkkjg")
	// res.send('asd')
	res.send({message: "Task added!"});
	res.end();
});


app.post('/delete', function(req, res){

	var cat = model.Categories;
	var ID = mongoose.mongo.ObjectID(req.body.id.split(" ")[1]);
	
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
	var ID = mongoose.mongo.ObjectID(req.body.id.split(" ")[1]);
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
	var ID = mongoose.mongo.ObjectID("5e1cc83426fd042b5830f189");
	
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

