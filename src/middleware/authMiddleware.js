const jwt = require("jsonwebtoken");
const KeyTokenService = require("../services/keytoken.service");
const KeyToken = require("../models/keytoken.model");

const HEADER = {
  REFRESHTOKEN: "x-rtoken-id"
}

const authenticate = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied. No token provided." });
  }
  try {
    const decoded = KeyTokenService.verifyAccessToken(
      token.replace("Bearer ", "")
    );
    
    // console.log(decoded);
    req.user = decoded;
    const keyToken = await KeyTokenService.getKeyTokenById(decoded.id);
    // console.log(keyToken);
    if (!keyToken) {
      return res.status(403).json({ message: "Invalid token." });
    }
    next();
  } catch (e) {
    res.status(403).json({ message: "Invalid or Expired token." });
  }
};

const authenticateV2 = async(req, res, next) => {
  if(req.headers[HEADER.REFRESHTOKEN]){
    try {
      const refreshToken = req.headers[HEADER.REFRESHTOKEN];
      const decodeUser = KeyTokenService.verifyRefreshToken(refreshToken);

      // asign decodeUser to req
      req.user = decodeUser
      req.refreshToken = refreshToken
      
      return next();
    } catch (error) {
      throw error;
    }
  }
   
  const token = req.header("Authorization");
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied. No token provided." });
  }
  try {
    const accessToken = token.split(" ").slice(-1)[0];
    const decoded = KeyTokenService.verifyAccessToken(accessToken);
    
    req.user = decoded;

    const keyToken = await KeyTokenService.getKeyTokenById(decoded.id);
    if (!keyToken) {
      return res.status(403).json({ message: "Invalid token." });
    }
    return next();
  } catch (e) {
    res.status(403).json({ message: "Invalid or Expired token." });
  }
}

module.exports = {
  authenticate,
  authenticateV2
};
