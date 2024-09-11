const mongoose = require ("mongoose");
const bcrypt = require("bcryptjs");
const JWT = require ("jsonwebtoken");

const userSchema = new mongoose.Schema(
{
    fullname: {
        type: String,
        required: true,
    },

    age: {
        type: Number,
        required: false,
    },

    goals: {
        type: String,
        required: false,
    },

    bio: {
        type: String,
        required: false,
    },
    image: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
},
    { timestamps: true }
);

userSchema.pre("save", function() {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(this.password, salt);
    this.password = hash;
});

userSchema.method("checkPassword", function(password) {
    let valid = bcrypt.compareSync(password, this.password);
    return valid
});

userSchema.method("generateToken", function() {
    const token = JWT.sign(
        {id: this._id, email: this.email},
         process.env.JWT_SECRET, 
         {issuer: "http://localhost:9898", expiresIn: "2H"}
        );
    return token;
});

const User = mongoose.model("User", userSchema);

module.exports = User;