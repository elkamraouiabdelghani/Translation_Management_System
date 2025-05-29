/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require('express');
const route = express.Router();
const bcrypt = require('bcryptjs');
const UserModel = require('../models/user');
const DeveloperModel = require('../models/developers');
const VerifyToken = require('../middleware/auth');

/*********************************Update User Imformations*********************************/
route.patch('/update-informations/:user_id', async (req, res) => {
    try {
        await UserModel.findByIdAndUpdate(
            {_id: req.params.user_id}, 
            {
                fullname: req.body.fullname,
                email: req.body.email
            }
        )
            .then(() => {
                res.json('User informations updated successfully');
            })
            .catch(err => res.json(err));
    }catch(err){
        res.status(500).send({message: 'Error during user update'});
    }
});

/*********************************Update Password*********************************/
route.patch('/update-password/:user_id', async (req, res) => {
    try{
        await UserModel.findOne({_id: req.params.user_id})
            .then(async user => {
                await bcrypt.compare(req.body.oldpass, user.password)
                    .then(async isCorrect => {
                        if(isCorrect){
                            const hashnewpass = await bcrypt.hash(req.body.newpass, 10);

                            user.password = hashnewpass;

                            await user.save()
                                .then(() => {
                                    res.json({message: 'Password updated successfully'});
                                })
                                .catch(err => res.json(err));
                        }else{
                            res.json('Invalid old password');
                        }
                    })
                    .catch(err => res.json(err));
            });
    }catch(err){
        res.status(500).json({ message: 'Error updating password' });
    }
});

/*********************************Get All Users*********************************/
route.get('/users', VerifyToken, async (req, res) => {
    try{
        const users = await UserModel.find({});
        res.json(users);
    }catch(err){
        res.status(500).send({message: 'Error recovering users'});
    }
});

/*********************************Get One User*********************************/
route.get('/user/:id', VerifyToken, async (req, res) => {
    try{
        const user = await UserModel.findById(req.params.id);

        res.json(user);
    }catch(err){
        res.status(500).send({message: 'Erreur lors de la récupération de l\'user'});
    }
});

/*********************************Change User Acount's Status*********************************/
route.patch('/change-status/:id', async (req, res) => {
    try{
        await UserModel.findByIdAndUpdate(
            req.params.id, 
            {status: req.body.status}
        )
            .then(() =>{
                res.json('User account\'s status changed');
            })
            .catch(err => res.json(err));
    }catch(err){
        res.status(500).json({ message: 'Error changing status' });
    }
});

/*********************************Create Developer*********************************/
route.post('/create-developer/:po_id', async (req, res) =>{
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
                        role: 'developer'
                    });
                    await newUser.save();

                    const newDev = new DeveloperModel({
                        user_id: newUser._id,
                        po_id: req.params.po_id
                    });
                    await newDev.save();
            
                    res.json('Developer registered');
                }
            })
            .catch(err => res.json(err));
    }catch(err){
        res.status(500).json({ message: 'Error registering developer' });
    }
});

/*********************************Get All Developers By po_id*********************************/
route.get('/get-developers/:po_id', VerifyToken, async (req, res) => {
    try{
        const devs = await DeveloperModel.find({po_id: req.params.po_id}, {user_id: 1, _id:0});
        const devsId = await devs.map(dev => dev.user_id);
        const developers = await UserModel.find({_id: {$in: devsId}});

        res.json(developers);
    }catch(err){
        res.status(500).json({ message: 'Error recovering developers' });
    }
});

/*********************************Get po By Developer*********************************/
route.get('/get-po/:id', VerifyToken, async (req, res) => {
    try{
        const dev = await DeveloperModel.findOne({user_id: req.params.id});
        const po = await UserModel.findOne({_id: dev.po_id});

        res.json(po);
    }catch(err){
        res.status(500).json({ message: 'Error recovering developer' });
    }
});

module.exports = route;