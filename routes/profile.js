const User = require("../db/Model/userModel");
const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const auth = require('../auth');

router.post('/accountinfo', auth, async (request, response) => {
    await User.findOne({ email: request.body.email })
        .then((result) => {
            response.json(result)
        })
});

router.put('/saveuserinfo', async (request, response) => {

    await User.findOneAndUpdate({ email: request.body.email }, { first_name: request.body.first_name, last_name: request.body.last_name, phone_number: request.body.phone_number, birthday: request.body.birthday })
        .then((result) => {
            response.status(201).send({
                message: "User information was saved!!",
                result
            })
        })
})

router.post('/editemail', async (request, response) => {

    await User.findOneAndUpdate({ email: request.body.email }, { email: request.body.new_email })
        .then((result) => {
            response.status(201).send({
                message: "Email was changed successfully!",
                result
            })
        })
})
router.put('/changepassword', auth, async(request, response) => {
    await User.findOne({email:request.body.email})
    .then((user)=>{
        bcrypt.hash(request.body.password, 10)
        .then((hashpassword)=>{
            User.findOneAndUpdate({email:request.body.email}, {password: hashpassword})
            .then((result)=>{
                response.status(200).send({message:'Password was changed successfully.', result});

            })
            .catch((e)=>{
                response.status(500).send({
                    e
                })
            })
        })
        .catch((e)=>{
            response.status(500).send({
                message:'Password was not hashed',
                e
            })
        })
    })
})

router.post('/changepassword', auth, async (request, response) => {

    await User.findOne({ email: request.body.email })
        // if email exists
        .then((user) => {
            // compare the password entered and the hashed password found
            bcrypt
                .compare(request.body.password, user.password)

                // if the passwords match
                .then((passwordCheck) => {

                    // check if password matches
                    if (!passwordCheck) {
                        return response.status(400).send({
                            message: "Current Passwords does not match",
                            error,
                        });
                    }
                    bcrypt.hash(request.body.new_password, 10)
                        .then((hashpassword) => {
                            User.findOneAndUpdate({ email: request.body.email }, { password: hashpassword })
                                .then((result) => {
                                    response.status(201).send({
                                        message: 'Password was changed successfully!',
                                        result
                                    })
                                })
                        })
                        .catch((e) => {
                            response.status(500).send({
                                message: "Password was not hashed successfully",
                                e,
                            });
                        });
                })
                // catch error if password does not match
                .catch((error) => {
                    response.status(400).send({
                        message: "Passwords does not match",
                        error,
                    });
                });
        })
        // catch error if email does not exist
        .catch((e) => {
            response.status(404).send({
                message: "Email not found",
                e,
            });
        });
});

module.exports = router;