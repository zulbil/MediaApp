const mongoose      = require('mongoose'); 
const bcrypt        = require('bcryptjs'); 

require('./../../config/db'); 


var UserSchema = new mongoose.Schema({
    local: {
        lastname: {
            type: String,  
            require: true,
            trim: true
        },
        firstname: {
            type: String,  
            require: true,
            trim: true
        },
        email: {
            type: String,
            require: true,
            minlength: 1,
            trim: true,
            unique: true
        },
        username: {
            type: String,  
            require: true,
            trim: true
        },
        password: {
            type: String, 
            minlength: 6,
            require: true
        }
    } 
}); 


/** Verify if password is valid */
UserSchema.methods.validPassword = function ( password ) {
    var user = this; 
    return bcrypt.compareSync(password, user.local.password ); 
}

//Middleware : this function will run right before we save a new user into the database
UserSchema.pre('save', function (next) {
    var user = this; 
    var userPassword = user.local.password; 
    //Check if a pasword has been updated
    // if yes, we'll hash the given password and store it to the database
    // if no, we'll simply call next 
    if(user.isModified('local.password')) {
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(userPassword, salt, function(err, hash) {
                user.local.password = hash; 
                next(); 
            });
        });
    } else {
        next(); 
    }

})


var User = mongoose.model('User', UserSchema); 

module.exports = { User }; 