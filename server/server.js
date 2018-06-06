var express = require('express');
var bodyParser = require('body-parser');
//const hbs = require('hbs');
const _ = require('lodash');

var {ObjectID} = require('mongodb');
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
var port = process.env.PORT || 3000;
app.set('view engine','hbs');

app.use(bodyParser.json());

app.post('/todos', (req,res) => {

	var todo = new Todo({

		name: req.body.name

	});

	todo.save().then((doc) => {	

		res.send(JSON.stringify(todo,undefined,2));

	},(err) => {
		res.status(400).send(err);
	});

	
});

app.get('/todos',(req,res)=>{

	Todo.find().then((todos) => {

		res.send({todos});
		

	},(err)=>{

		res.status(400).send(e);

	});

});

app.post('/user',(req,res) => {

	var body = _.pick(req.body,['email','password']);
	var user = new User({

		email: req.body.email,
		password: req.body.password

	});

	user.save().then((user) => {

		return user.generateAuthToken();

	},(err)=>{

		res.status(400).send(err);

	}).then((token) => {
		res.header('x-auth',token).send(user);
	},(err)=> {
	
		res.status(400).send(err);		
	});

});

app.get('/todos/:id',(req,res) => {

 	var id = req.params.id;
 	if(!ObjectID.isValid(id)){

 		res.status(404).send('Invalid Id');

 	}
 	else{

 		Todo.findById(id).then((todo) => {

 			if(!todo){

 			 	return res.status(400).send('Todo not Found');

		}	
 			res.status(200).send(JSON.stringify(todo,undefined,2));

 		}, (err) => {

 			res.send("Error" + err);
 		});

 			
 	}

});

app.delete('/remove/:id',(req,res) => {

 	var id = req.params.id;
 	if(!ObjectID.isValid(id)){

 		res.status(404).send('Invalid Id');

 	}
 	else{

 		Todo.findByIdAndRemove(id).then((todo) => {

 			if(!todo){

 			 	return res.status(400).send('Todo not Found with this id');

		}	
 			res.status(200).send(JSON.stringify(todo,undefined,2));

 		}, (err) => {

 			res.send("Error" + err);
 		});

 			
 	}

});

app.patch('/todos/:id',(req,res) => {

	var id = req.params.id;
	var body = _.pick(req.body,['name','completed']);

	if(!ObjectID.isValid(id)){

 		return res.status(404).send('Invalid Id');

 	}

	Todo.findByIdAndUpdate(id,{ $set: {name: body.name,completed: body.completed}} , {new : true}).then((todo)=>{

		if(!todo){

			return res.send("Todo not found with this id");
		}
		res.send(todo);
	}).catch((e) => {

		res.status(400).send(e);

	});

});

var authenticate = (req,res,next) => {

	var token = req.header('x-auth');

	User.findByToken(token).then((user) => {

		if(!user){

			return res.send("Data Not Found");

		}

		req.user = user;
		req.token = token;
		next();
		 

	}).catch((e) => {
		res.status(401).send();
	});


};

app.get('/user/me',authenticate,(req,res) => {

	res.send(req.user);
});



app.listen(port,() => {

	console.log('App Started on' + port);

});

module.exports = {app};