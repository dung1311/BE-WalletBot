const jwt = require('jsonwebtoken');
const KeyTokenService = require('../services/keytoken.service');
const KeyToken = require('../models/keytoken.model'); 
const authenticate = async (req, res, next) => {
    const token = req.header('Authorization');
    if(!token){
        return res.status(401).json({message: 'Access Denied. No token provided.'});
    }
    try{
        const decoded = KeyTokenService.verifyAccessToken(token.replace('Bearer ', ''));
        console.log(decoded);
        req.user = decoded;
        const keyToken = await KeyTokenService.getKeyTokenById(decoded.id);
        console.log(keyToken);
        if(!keyToken){
            return res.status(403).json({message: 'Invalid token.'});
        }
        next();
    } catch(e){
        res.status(403).json({message: 'Invalid or Expired token.'});
    }
}
module.exports = authenticate;