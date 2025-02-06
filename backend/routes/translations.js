/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require('express');
const route = express.Router();
const TransModel = require('../models/translations');
const AppModel = require('../models/apps');
const VerifyToken = require('../middleware/auth');
const CheckSecretKey = require('../middleware/checkSecretKey');

/*********************************Create Translations*********************************/
route.post('/create-translations/:app_id', async (req, res) => {
    try{
        const trans = await TransModel.findOne({
            key: req.body.key,
            app_id: req.params.app_id
        });

        if(trans){
            res.json('Already existing key !');
        }else{
            const newTrans = new TransModel({
                tags: req.body.tags,
                key: req.body.key,
                vfr: req.body.vfr,
                ven: req.body.ven,
                var: req.body.var,
                app_id: req.params.app_id
            });

            await newTrans.save()
                .then(() => res.json('Translation successfully created'))
                .catch(err => res.json(err));
        }
    }catch(err){
        res.status(500).send({message: 'Error creating translations !'});
    }
});

/*********************************Update Translations*********************************/
route.patch('/update-translation/:app_id/:id', async (req, res) => {
    try{
        const trans = await TransModel.findOne({
            _id: req.params.id,
            app_id: req.params.app_id
        });

        trans.updateOne(req.body)
            .then(() => res.json('Data has been updated'))
            .catch(err => res.json(err));
    }catch(err){
        res.status(500).send({message: 'Error updating translation !'});
    }
});

/*********************************Delete Translations*********************************/
route.delete('/delete-translation/:app_id/:id', async (req, res) => {
    try{
        await TransModel.findOneAndDelete({
            _id: req.params.id,
            app_id: req.params.app_id
        })
            .then(() => res.json('Data has been deleted !'))
            .catch(err => res.json(err));
    }catch(err){
        res.status(500).send({message: 'Error deleting translation !'});
    }
});

/*********************************Get All Translations*********************************/
route.get('/get-trans', VerifyToken, async (req, res) => {
    try{
        const trans = await TransModel.find({});

        res.json(trans);
    }catch(err){
        res.status(500).send({message: 'Error fetching translations !'});
    }
});

/*********************************Get All Translations By po_id*********************************/
route.get('/get-trans/:po_id', VerifyToken, async (req, res) => {
    try{
        const apps = await AppModel.find({po_id: req.params.po_id}, {_id: 1});
        const appsId = apps.map(app => app._id);
        const trans = await TransModel.find({app_id: {$in: appsId}});
        
        res.json(trans);
    }catch(err){
        res.status(500).send({message: 'Error getting translations !'});
    }
});

/*********************************Get All Translations By app_id*********************************/
route.get('/get-translations/:app_id', async (req, res) => {
    try{
        const trans = await TransModel.find({ app_id: req.params.app_id });

        res.json(trans);
    }catch(err){
        res.status(500).send({message: 'Error fetching translations !'});
    }
});

/*********************************Get Translation By app_id*********************************/
route.get('/get-translation/:app_id/:id', async (req, res) => {
    try{
        const tran = await TransModel.findOne({
            _id: req.params.id,
            app_id: req.params.app_id
        });

        res.json(tran);
    }catch(err){
        res.status(500).send({message: 'Error fetching translation !'});
    }
});

/*********************************Valid Data*********************************/
route.patch('/valid-data/:app_id/:id', async (req, res) => {
    try{
        const tran = await TransModel.findOne({
            app_id: req.params.app_id,
            _id: req.params.id
        });

        if(tran.status == 'valid' || tran.status == 'new'){
            if(tran.publish == 'published'){
                res.json('Data is already published ! you can\'t invalid data');
            }else{
                tran.updateOne({
                    status: req.body.status
                })
                    .then(() => res.json('data has been valided'))
                    .catch(err => res.json(err));
            }
        }else{
            tran.updateOne({
                status: req.body.status
            })
                .then(() => res.json('data has been valided'))
                .catch(err => res.json(err));
        }

    }catch(err){
        res.status(500).send({message: 'Error validating data !'});
    }
});

/*********************************Publish Data*********************************/
route.patch('/publish-data/:app_id/:id', async (req, res) => {
    try{
        const tran = await TransModel.findOne({
            app_id: req.params.app_id,
            _id: req.params.id
        });

        if(tran.status != 'valid'){
            res.json('Invalid Data! Please valid data for publishing');
        }else{
            tran.updateOne({
                publish: req.body.publish
            })
                .then(() => res.json('Data has been published'))
                .catch(err => res.json(err));
        }
    }catch(err){
        res.status(500).send({message: 'Error publishing data !'});
    }
});

/*********************************Get All Translations By po_id and AppName*********************************/
route.get('/get-trans/:po_id/:appname/:tag?', CheckSecretKey, async (req, res) => {
    try{
        const tag = req.params.tag || null;
        
        if(!tag){
            const app_id = await AppModel.find({po_id: req.params.po_id, appname: req.params.appname}, {_id: 1});
            const trans = await TransModel.find({app_id: app_id, publish: 'published'});
            return res.json(trans);
        }
        const app_id = await AppModel.find({po_id: req.params.po_id, appname: req.params.appname}, {_id: 1});
        const trans = await TransModel.find({app_id: app_id, publish: 'published', tags: {$in: [tag]}});
        return res.json(trans);
    }catch(err){
        res.json('Error getting translations !');
    }
});

/*********************************Get Translations for TMS Documentation*********************************/
route.get('/api/translations/:lng', async (req, res) => {
    const { lng } = req.params;
    let languageField;

    // Déterminez le champ de langue à utiliser
    switch (lng) {
    case 'fr':
        languageField = 'vfr';
        break;
    case 'en':
        languageField = 'ven';
        break;
    case 'ar':
        languageField = 'var';
        break;
    default:
        return res.status(400).json({ error: 'Langue non supportée' });
    }

    try {
        // Récupérez les traductions publiées
        const translations = await TransModel.find({ publish: 'published' }).select(`key ${languageField}`);
        const response = {};

        // Formatez les traductions pour la réponse
        translations.forEach(translation => {
            response[translation.key] = translation[languageField];
        });

        res.json(response);
    }
    catch (err) {
        res.json('Error getting translations !');
    }
});

module.exports = route;