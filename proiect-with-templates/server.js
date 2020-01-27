const express = require('express');
const app = express(); 
const model = require('./model.js'); 
const mongoose = require('mongoose');
app.use(express.urlencoded());
app.use(express.json());      // if needed

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

const cookieParser = require('cookie-parser');
app.use(cookieParser());



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

app.get('/register',function(req,res){
	data = { page: "register" };
	res.render('index',{data});
});

app.post('/register', function (req, res) {
	// var id = mongoose.Types.ObjectId();

	var hashedPassword = bcrypt.hashSync(req.body.psw, 8);

	model.Users.create(
		{	email: req.body.email,
			password: hashedPassword},
		function (err, user) {
			if (err) return res.status(500).send("There was a problem registering the user.")
			// create a token
			// var token = jwt.sign({ id: user._id }, config.secret, {
			// 	expiresIn: 86400 // expires in 24 hours
			// });
			// res.status(200).send('Successfully registered!');
			res.redirect('/login');
			//cookie
	});
});

app.get('/login',function(req,res){
	data = {page:"login"};
	res.render('index',{data});
});

app.post('/login', function(req, res) {

	model.Users.findOne({ email : req.body.email }, function (err, user) {
	  if (err) return res.status(500).send('Error on the server.');
	  if (!user) return res.status(404).send('No user found.');
	  
	  var passwordIsValid = bcrypt.compareSync(req.body.psw, user.password);
	  if (!passwordIsValid) return res.status(401).send('Invalid password.');
	  
	  var token = jwt.sign({ id: user._id }, "123456789", {
		expiresIn: 86400 // expires in 24 hours
	  });
	  
	//   res.status(200).send({ auth: true, token: token, user: user.id });

	  res.cookie('token', token, {httpOnly: true})

	  res.redirect('/projects');
	});
	
  });

function validateUser(req, res, next) {
  jwt.verify(req.cookies['token'], '123456789', function(err, decoded) {
    if (err) {
      res.redirect('/login');
    }else{
      // add user id to request
      req.body.id_user = decoded.id;
      next();
    }
  });
  
}

app.get('/projects', validateUser, function(req,res){
		model.Projects.find({id_users: req.body.id_user}, '', function(err, projects){
			data = {
				page: "projects",
				proj: projects
			};	
			res.render('index', {data});
		});
});

app.post('/updateproj', validateUser, function(req,res){
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

app.post('/addproj', validateUser, function(req, res){
	const proj_id = new mongoose.Types.ObjectId()
	const project = new model.Projects({
		_id: proj_id,
		id_users: [req.body.id_user],
		title: req.body.proj_title,
		description: req.body.proj_description,
		deadline: req.body.proj_deadline
	})

	project.save(function (err) {
    	if (err) return handleError(err);
  	});

  	res.send({id: proj_id})
})




 /*-- adauga in baza de date userul la inregistrare --*/
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

// app.post('/tasks',function(req,res){
// 	console.log("ihhkkjg")
// 	// res.send('asd')
// 	res.send({message: "Task added!"});
// 	res.end();
// });


app.post('/addticket', validateUser, function(req, res){

	var new_task = new model.Tickets();
	var ID_task = new mongoose.Types.ObjectId()

	new_task._id = ID_task;
	new_task.name =  req.body.name;
	new_task.status = false

	new_task.save(function(err, saved_task){
		if(err){
			console.log("eroare: " + err);
		}
		console.log("adaugat task");
		
	});

	model.Categories.findByIdAndUpdate(req.body.cat_id,
		{$push: {id_tickets: ID_task }},
		function (error, success) {
	        if (error) {
	            // console.log(error);
	        } else {
	            // console.log(success);
	        }
    	}
	);

	res.set('Content-Type', 'application/json');
	res.send({id: ID_task});
})

app.post('/delticket', validateUser, function(req, res){

	var cat = model.Categories;

	model.Tickets.findByIdAndRemove(req.body.id_ticket, 
		function(err, success){
			if(err){
				console.log(err);
			}else{
				console.log("yeey, deleted task");
			}
		}
	)
	
	cat.findByIdAndUpdate(
		req.body.id_cat,
		 {$pull : {'id_tickets' : req.body.id_ticket}},
		 	function(err, success){
				 if(err){
					 // console.log(err);
				 }else{
					 // console.log("yeey, deleted task from category");
				 }
		 	}
	 );
})

app.post('/updateticket', validateUser, function(req, res){

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

app.get('/board', validateUser, function(req,res){
	model.Projects.findOne({_id: new mongoose.Types.ObjectId(req.query.id)})
	//'populate' replaces ObjectIds with actual documents
	//id_categories become documents, then their id_tickets become documents
	.populate({
    	path: 'id_categories',
    	populate: { path: 'id_tickets' }
  	})
	.exec(
		function(err, proj){
			data = {
				page: "boards",
				cat: proj.id_categories
			};
			res.render('index', {data});
	});
});

app.post('/addcat', validateUser, function(req,res){
	// var cat = model.Categories;
	// var ID = mongoose.mongo.ObjectID("5e1cc83426fd042b5830f189");
	
	var newcategory = new model.Categories();
	var ID_cat = new mongoose.Types.ObjectId()

	newcategory._id = ID_cat;
	newcategory.name =  req.body.name;

	newcategory.save(function(err, savedCat){
		if(err){
			console.log("eroare: " + err);
		}
		console.log("adaugat cat");
		
	});

	model.Projects.findByIdAndUpdate(req.body.id_project,
		{$push: {id_categories: ID_cat }},
		function (error, success) {
	        if (error) {
	            // console.log(error);
	        } else {
	            // console.log(success);
	        }
    	}
	);

	res.set('Content-Type', 'application/json');
	res.send({id: ID_cat});
})