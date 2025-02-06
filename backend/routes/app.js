/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require('express');
const route = express.Router();
const AppModel = require('../models/apps');
const TransModel = require('../models/translations');
const VerifyToken = require('../middleware/auth');

/*********************************Get All Apps By po_id*********************************/
route.get('/get-apps/:po_id', VerifyToken, async (req, res) => {
    try{
        const apps = await AppModel.find({po_id: req.params.po_id});

        res.json(apps);
    }catch(err){
        res.status(500).send({message: 'Error recovering applications'});
    }
});

/*********************************Get App By id*********************************/
route.get('/get-app/:id', async (req, res) => {
    try{
        const app = await AppModel.findOne({
            _id: req.params.id
        });

        res.json(app);
    }catch(err){
        res.status(500).send({message: 'Error recovering application'});
    }
});

/*********************************Create App*********************************/
route.post('/create-app/:po_id', async (req, res) => {
    try{
        const app = await AppModel.findOne({
            appname: req.body.appname, 
            po_id: req.params.po_id
        });

        if(app){
            return res.json({
                type: 'error',
                message: 'Already existing application !'
            });
        }else{
            const newApp = new AppModel({
                appname: req.body.appname,
                po_id: req.params.po_id,
            });

            await newApp.save();
            res.json(newApp);
        }
    }catch(err){
        res.status(500).send({message: 'Error creating application !'});
    }
});

/*********************************Update App*********************************/
route.patch('/update-app/:po_id/:id', async (req, res) => {
    try{
        const app = await AppModel.findOne({
            po_id: req.params.po_id,
            _id: req.params.id
        });

        if(!app){
            return res.status(404).json({message: 'Application not found !'});
        }
        app.appname = req.body.appname;
        app.save();
        res.json('App has been updated');
    }catch(err){
        res.status(500).send({message: 'Error updating application !'});
    }
});

/*********************************Delete App*********************************/
route.delete('/delete-app/:po_id/:id', async (req, res) => {
    try{
        await TransModel.deleteMany({app_id: req.params.id});

        await AppModel.findOneAndDelete({
            po_id: req.params.po_id,
            _id: req.params.id
        })
            .then(() => res.json('Application has been deleted'))
            .catch(err => res.json(err));
    }catch(err){
        res.status(500).send({message: 'Error deleting application !'});
    }
});

module.exports = route;