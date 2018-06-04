var mongoose = require('mongoose');
const validator = require('validator');
var Schema = mongoose.Schema;
const jwt= require('jsonwebtoken');
const _ = require('lodash');

var userSchema = new Schema({

	email: {

		type:String,
		required: true,
		trim:true,
		minlength:1,
		unique:true,
		validate:{ 
			validator: validator.isEmail,
			message:'{VALUE} is not valid email'
		}
	},
	password:{

		type:String,
		required:true,
		minlength:8,
	},
	tokens: [{

		access: {

			type:String,
			required:true

		},
		token:{

			type:String,
			required:true
		}

	}]
	 
});

userSchema.methods.toJSON = function (){

	var user = this;
	var userObject = user.toObject();

	return _.pick(userObject,['_id','email']);

};

userSchema.methods.generateAuthToken = function (){

	var user = this;
	var access = 'auth';
	var token = jwt.sign({_id: user._id.toHexString()},'123abc').toString();

	user.tokens.push({

		access: access,
		token: token

	});
	return user.save().then(() => {

		return token;

	});

};

var User = mongoose.model('User',userSchema);

module.exports = {User};
