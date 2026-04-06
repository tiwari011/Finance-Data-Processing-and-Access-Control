const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name is required"],
        trim:true
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        trim:true,
        lowercase:true
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        minlength:[6,"Password must be at least 6 characters long"],
        validate: {
            validator: function (value) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/.test(value);
            },
            message: 'Password must contain uppercase, lowercase, number, and special character'
        }
    },
    role: {
        type: String,
        enum: ['viewer', 'analyst', 'admin'],
        default: 'viewer'
    }, 
    status:{
        type:String,
        enum:['active','inactive'],
        default:'active'
    }
}, {
    timestamps: true   // ✅ correct placement
});

module.exports = mongoose.model('User', UserSchema);