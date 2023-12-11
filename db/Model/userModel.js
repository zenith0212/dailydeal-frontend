const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  avatar:{
    type: String,
    data: Buffer
  },

  first_name: {
    type: String,
    require: [true, "Please provide First Name"],
    unique: false
  },

  last_name: {
    type: String,
    require: [true, "Please provide Last Name"],
    unique: false
  },

  phone_number: {
    type: String,
    require: [true, "Insert Phone Number"],
    unique: false
  },
  
  birthday:{
    type: Date,
  },

  email: {
    type: String,
    required: [true, "Please provide an Email!"],
    unique: [true, "Email Exist"],
  },

  password: {
    type: String,
    required: [true, "Please provide a password!"],
    unique: false,
  },
  admin_permission:{
    type:Boolean,
    default:false
  },
  twostepverify: {
    type: Boolean,
    // required: []
    default: true
  },
  social:{
    type: String,
    default: 'none'
  },
  created_date:{
    type: Date,
    default: Date.now,
  }
  
});

module.exports = mongoose.model.Users || mongoose.model("Users", UserSchema);