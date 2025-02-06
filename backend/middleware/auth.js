/* eslint-disable no-undef */
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretKey = process.env.SECRETkEY;

function VerifyToken (req, res, next){
    const token = req.headers.authorization;
    
    if (!token){
        res.json({message: 'Le token obligatoire pour l\'authentification'});
    }
    try{
        const decoded = jwt.verify(token.split(' ')[1], secretKey);
        if (!decoded) {
            res.json({message: 'Token invalide'});
        }
        next();
    // eslint-disable-next-line no-unused-vars
    }catch (error){
        res.json({message: 'Token invalide'});
    }
}

module.exports = VerifyToken;