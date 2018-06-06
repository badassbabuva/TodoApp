var mongoose = require('mongoose');
const validator = require('validator');
var Schema = mongoose.Schema;
const jwt= require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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

//.methods means instance method
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
//.statics means Model method
userSchema.statics.findByToken = function (token) {

	var User = this;
	var decoded;

	try {

		decoded=jwt.verify(token, '123abc');
	} 
	catch(e) {

		throw e;
	}
	return User.findOne({
		'_id':decoded._id,
		'tokens.token': token,
		'tokens.access':'auth'
	});
};
//it wil run before save event 
userSchema.pre('save', function (next){

	var user = this;
	if(user.isModified('password')){

		bcrypt.genSalt(10,(err,salt) => {
			bcrypt.hash(user.password,salt,(err,hash) => {
				user.password = hash;
				next();
			});
		});
	} 
	else
	{
		next();
	}

});

var User = mongoose.model('User',userSchema);

module.exports = {User};
