const User = require("../db/Model/userModel");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require('../auth');
const multer = require('multer');
const {OAuth2Client} = require('google-auth-library');
const uuidv4 = require('uuid');
const {Novu} = require("@novu/node");
const {response, application} = require("express");
const sharp = require('sharp');
//Novu api key
const novu = new Novu("2792de1aa02ee6b16edec7d66f1bcd8b");

const DIR = './public/';
// const storage = multer.diskStorage({     destination: (req, file, cb) => {
//      cb(null, DIR);     },     filename: (req, file, cb) => {         const
// fileName = file.originalname.toLowerCase().split(' ').join('-');         //
// cb(null, uuidv4() + '-' + fileName)         cb(null, file.originalname + '-'
// + Date.now() + '.png')     } });
const storage = multer.memoryStorage();

var upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

let code;
const generateID = () => Math
    .random()
    .toString(36)
    .substring(2, 10);
const generateCode = () => Math
    .random()
    .toString(36)
    .substring(6, 12);
var token,
    user_email,
    phone_number;

const sendNovuNotification = async(recipient, email, verificationCode) => {
    try {
        let response = await novu.trigger('mention-in-a-comment', {
            to: {
                subscriberId: recipient,
                phone: recipient,
                email: email
            },
            payload: {
                code: verificationCode
            }
        });
        console.log(code);
    } catch (error) {
        console.error(error);
    }
}

router.post('/user-profile', upload.single('file'), async(req, res, next) => {
    const url = req.protocol + '://' + req.get('host');

    const path = `../images/user/${req.body.email}.png`;
    const savePath = `/images/user/${req.body.email}.png`;

    // console.log(req.file.filename)

    await sharp(req.file.buffer)
        .resize(300, 300)
        .toFile(path);

    await User.findOneAndUpdate({
        email: req.body.email
    }, {
        avatar: savePath
    }).then((result) => {
        // console.log(result.avatar);
        res
            .status(201)
            .json({message: "Updated Profile image successfully!"})
    }).catch(err => {
        console.log(err),
        res
            .status(500)
            .json({error: err});
    })
})

router.get("/userlist", auth, async(request, response) => {
    try {
        const data = await User.find();
        response.json(data)
    } catch (error) {
        response
            .status(500)
            .json({message: error.message})
    }
})

router.post("/register", (request, response) => {
    // response.json({message:"register"}); hash the password console.log(request)
    bcrypt
        .hash(request.body.password, 10)
        .then((hashedPassword) => {
            // create a new user instance and collect the data
            const user = new User({first_name: request.body.first_name, last_name: request.body.last_name, phone_number: request.body.phone_number, email: request.body.email, password: hashedPassword});

            // console.log("user was created")
            const token = jwt.sign({
                userId: user._id,
                userEmail: user.email
            }, "RANDOM-TOKEN", {expiresIn: "24h"});

            // save the new user
            user.save()
            // return success if the new user is added to the database successfully
                .then((result) => {
                code = generateCode();
                // console.log(user);
                user_email = user.email;
                phone_number = user.phone_number;
                sendNovuNotification(phone_number, user_email, code);

                response
                    .status(201)
                    .send({message: "User Created Successfully", email: user.email, token});

            })
            // catch error if the new user wasn't added successfully to the database
                .catch((error) => {
                response
                    .status(500)
                    .send({message: "Error creating user", error});
            });
        })
        // catch error if the password hash isn't successful
        .catch((e) => {
            response
                .status(500)
                .send({message: "Password was not hashed successfully", e});
        });
});

// login endpoint
router.post("/login", async(request, response) => {
    // check if email exists
    const {email, password} = request.body;

    await User.findOne({email: email})

    // if email exists
        .then((user) => {
        // compare the password entered and the hashed password found
        bcrypt.compare(password, user.password)

        // if the passwords match
            .then((passwordCheck) => {

            // check if password matches
            if (!passwordCheck) {
                return response
                    .status(400)
                    .send({message: "Passwords does not match!!!", error});
            }

            //   create JWT token
            token = jwt.sign({
                userId: user._id,
                userEmail: user.email
            }, "RANDOM-TOKEN", {expiresIn: "24h"});

            // let result = user.filter(         (user) => user.email === email &&
            // user.password === password     );
            code = generateCode();
            // console.log(user);
            user_email = user.email;
            phone_number = user.phone_number;
            if (phone_number === undefined) {
                phone_number = Math.floor(Math.random() * 1000000) + '1';
            }
            sendNovuNotification(phone_number, user_email, code);

            //   return success response
            response
                .status(200)
                .send({message: "Login Successful", email: user.email, tsv: user.twostepverify, token});
        })
        // catch error if password does not match
            .catch((error) => {
            response
                .status(400)
                .send({message: "Passwords does not match", error});
        });
    })
    // catch error if email does not exist
        .catch((e) => {
        response
            .status(400)
            .send({message: "Email not found", e});
    });
});

router.post('/verify', async(request, response) => {
    // console.log('code:', code);
    if (code === request.body.code) {
        return response
            .status(200)
            .send({token: token, email: user_email});
    }
    response
        .status(500)
        .send({error_message: "Verify code is wrong, try to check."});
});
router.get('/verify', async(request, response) => {
    code = generateCode();
    console.log(phone_number, user_email, code);
    if (user_email === undefined) 
        user_email = request.query.email;
    
    if (phone_number === undefined) {
        phone_number = Math.floor(Math.random() * 1000000) + '1';
    }
    sendNovuNotification(phone_number, user_email, code);
    response.json({message: 'Sent verification code again!'});

});
router.get('/password-reset', async(req, res) => {

    const data = await User.findOne({email: req.query.email});
    code = generateCode();
    if (data === null) {
        res
            .status(500)
            .send({message: 'Unregisterd Email, try again!'});
        return;
    } else {

        phone_number = data.phone_number;
        token = jwt.sign({
            userId: data._id,
            userEmail: data.email
        }, "RANDOM-TOKEN", {expiresIn: "24h"});
        if (phone_number === undefined) {
            // console.log(parseInt(user_email));
            phone_number = Math.floor(Math.random() * 1000000) + '1';
        }
        // console.log(phone_number, req.query.email, code);
        sendNovuNotification(phone_number, req.query.email, code);
        res.json({token, message: 'Verification code was sent to your email successfully.'});
    }
});

router.put('/login', auth, async(request, response) => {
    await User.findOneAndUpdate({
        email: request.body.email
    }, {twostepverify: request.body.tsv}).then((result) => {
        response
            .status(200)
            .send({message: 'Changed', result});
    }).catch((error) => {
        response
            .status(500)
            .send(error);
    })
});

const client = new OAuth2Client(process.env.client_id)

router.post('/googlelogin', async(request, res) => {
    const {idToken} = request.body;
    client
        .verifyIdToken({idToken, audience: process.env.client_id})
        .then((response) => {
            const {email_verified, name, email, given_name, family_name} = response.payload;
            // console.log(response.payload)
            if (email_verified) {
                User
                    .findOne({email})
                    .then((err, user) => {
                        if (user) {
                            token = jwt.sign({
                                userId: user._id,
                                userEmail: user.email
                            }, "RANDOM-TOKEN", {expiresIn: "24h"});
                            const {_id, email, name, first_name} = user;
                            // console.log(user);
                            return res
                                .status(200)
                                .send({
                                    token,
                                    user: {
                                        _id,
                                        email,
                                        name,
                                        first_name
                                    }
                                });
                        } else {
                            const password = email + process.env.JWT_SECRET;

                            user = new User({first_name: given_name, last_name: family_name, email, password, social: 'google'});

                            user
                                .save()
                                .then((data) => {
                                    const token = jwt.sign({
                                        _id: data._id
                                    }, process.env.JWT_SECRET, {expiresIn: '7d'});
                                    const {_id, email, name} = data;

                                    return res.json({
                                        token,
                                        user: {
                                            _id,
                                            email,
                                            name
                                        }
                                    });
                                })
                                .catch(() => {
                                    return res
                                        .status(500)
                                        .send({message: 'Signup error'});
                                });
                        }
                    });
            } else {
                return res
                    .status(400)
                    .json({error: "Google login failed, try again"});
            }
        });
})
router.post('/facebooklogin', async(request, res) => {
    const {user} = request.body;
    const {accessToken, id, name, email, userID, data_access_expiration_time, expiresIn, graphDomain, signedRequest} = user;
    console.log(user)
    console.log(request.payload)
    console.log(request.body)
    if (email) {
        User
            .findOne({email})
            .then((user) => {
                if (user) {
                    token = jwt.sign({
                        userId: user._id,
                        userEmail: user.email
                    }, "RANDOM-TOKEN", {expiresIn: "24h"});
                    const {_id, email, name, first_name} = user;
                    // console.log(user);
                    return res
                        .status(200)
                        .send({
                            token,
                            user: {
                                _id,
                                email,
                                name,
                                first_name
                            }
                        });
                } else {
                    const password = email + process.env.JWT_SECRET;
                    console.log("signup")
                    user = new User({first_name: name, last_name: "", email, password, social: 'facebook'});
console.log("signup 1")
                    user
                        .save()
                        .then((data) => {
                            console.log("1")
                            const token = jwt.sign({
                                _id: data._id,
                            }, process.env.JWT_SECRET, {expiresIn: '7d'});
                            const {_id, email, name, first_name} = data;
                            console.log("2")
                            return res.json({
                                token,
                                user: {
                                    _id,
                                    email,
                                    name,
                                    first_name
                                }
                            });
                        })
                        .catch(() => {
                            return res
                                .status(500)
                                .send({message: 'Signup error'});
                        });
                }
            });
    } else {
        return res
            .status(400)
            .json({error: "Facebook login failed, try again"});
    }

})

module.exports = router;