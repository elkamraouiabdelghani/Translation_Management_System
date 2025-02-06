/* eslint-disable no-undef */
require('dotenv').config();
const UserModel = require('../models/user');

function CheckSecretKey (req, res, next){
    const secret_Key = req.headers['secret_key'];

    if(secret_Key){
        UserModel.findById(req.params.po_id)
            .then(user => user.secretkey === secret_Key ? next() : res.status(401).json({message: 'Invalid secret key'}))
            .catch(() => res.json({message: 'User not found'}));
    }else{
        res.status(401).send({message: 'Missing secret key'});
    }
}

module.exports = CheckSecretKey;