var express = require('express');
var bodyParser = require('body-parser');
const hbs = require('hbs');

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

	var user = new User({

		email: req.body.email

	});

	user.save().then((user) => {

		res.send(user);

	},(err)=>{

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

app.listen(port,() => {

	console.log('App Started on' + port);

});

module.exports = {app};