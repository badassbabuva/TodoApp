var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var todoSchema = new Schema({

	name: {

		type:String,
		required: true
	},
	completed:{

		type:Boolean,
		default: false

	} 
});

var Todo = mongoose.model('Todo',todoSchema);

module.exports = {Todo};
