const joi = require("joi");
const JWT = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();



const signupSchema = joi.object ({
    fullname: joi.string()
        .min(3)
        .max(30)
        .required(),
    password: joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

     email: joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net']}})   
});

const loginSchema = joi.object ({
    password: joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

     email: joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net']}})   
});

const validateSignupdata = (req, res, next) => {
    try {
        let {error, value} = signupSchema.validate(req.body);
        if(error) {
            return res.status(400).json({message: error.details[0].message });
        };
        next();
    } catch (error) {
        return res.status(500).json({ message: "server error"});
    };
};

const validateLogindata = (req, res, next) => {
    try {
        let {error, value} = loginSchema.validate(req.body);
        if(error) {
            return res.status(400).json({message: error.details[0].message });
        };
        next();
    } catch (error) {
        return res.status(500).json({ message: "server error"});
    };
};

const isTokenValid = (req, res, next) => {
    try {
        const longToken = req.headers.authorization;
        if (!longToken) {
            return res.status(400).json({message: "token not present"});
        }
        const token = longToken.split(" ")[1];
        let user = JWT.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({ message: "invalid token"});
    };
};

module.exports = { validateSignupdata, validateLogindata, isTokenValid, };
