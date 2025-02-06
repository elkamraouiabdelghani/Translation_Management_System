/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require('express');
const route = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();
const UserModel = require('../models/user');
const secretKey = process.env.SECRETkEY;

/*********************************Sign In*********************************/
route.post('/sign-in', async (req, res)=>{
    try{
        await UserModel.findOne({email: req.body.email})
            .then(async user => {
                if(user){
                    await bcrypt.compare(req.body.password, user.password)
                        .then(isvalide =>{
                            if(isvalide){
                                const token = jwt.sign(
                                    {userId: user._id},
                                    secretKey,
                                    {expiresIn: '1h'}
                                );

                                res.json({
                                    message: 'Connection successful',
                                    token: token,
                                    user: user
                                });
                            }else{
                                res.json({message: 'Incorrect password'});
                            }
                        });
                }else{
                    res.json({message: 'User not found'});
                }
            })
            .catch(err => res.json(err));
    }catch(err){
        res.status(500).send({message: 'Error during user login'});
    }
});

/*********************************Sign Up*********************************/
route.post('/sign-up', async (req, res) => {
    try{
        await UserModel.findOne({email: req.body.email})
            .then(async user =>{
                if(user){
                    res.json('Email already exists !');
                }else{
                    const hashedPassword = await bcrypt.hash(req.body.password, 10);
            
                    const newUser = new UserModel({
                        fullname: req.body.fullname,
                        email: req.body.email,
                        password: hashedPassword,
                        role: req.body.role,
                        secretkey: crypto.randomBytes(10).toString('hex')
                    });
            
                    await newUser.save();
            
                    res.status(201).json('User registered');
                }
            })
            .catch(err => res.json(err));
    }catch(err){
        res.status(500).json({ message: 'Error registering user' });
    }
});

module.exports = route;