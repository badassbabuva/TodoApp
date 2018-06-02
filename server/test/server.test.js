const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

descirbe('POST/todos',() => {

	it('should create a new todo');

	var text = "Some Text Here";

	request(app)
		  .post('/todos')
		  .send({
		  	text
		  })
		  .

});