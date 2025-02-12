const UserService = require("../services/user.service");
const KeyTokenService = require("../services/keytoken.service");
const KeyToken = require("../models/keytoken.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class AuthController {
    static async register(req, res) {
        console.log(req.body);
        const { name, email, password } = req.body;
        console.log(name, email, password);
        try {
          const newUser = await UserService.registerUser({ name, email, password });

          return res.status(201).json({
            message: "Đăng ký thành công",
            user: {
              name: newUser.name,
              email: newUser.email,
            },
          });
        } catch (error) {
          return res.status(400).json({
            message: error.message || "Lỗi khi đăng ký người dùng",
          });
        }
    }
    static async login(req, res) {
        const { email, password } = req.body;

        const user = await UserService.getUserByEmail(email);
        if (!user) {
            return res.status(400).json({ message: "Email không tồn tại" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Mật khẩu không đúng" });
        }
        
        const payload = {
          id: user._id,
          name: user.name,
          email: user.email,
        };
        const accessToken = KeyTokenService.generateAccessToken(payload);
        const refreshToken = KeyTokenService.generateRefreshToken(payload);

        let keyToken = await KeyTokenService.getKeyTokenById(user._id);
        console.log(keyToken.refreshToken);
        if(!keyToken){
          keyToken = KeyTokenService.createKeyToken({
            userID: user._id,
            refreshToken: [refreshToken],
          });
        }
        else{
         await KeyTokenService.updateTokens(user._id, refreshToken);
        }
        res.json({ accessToken, refreshToken });
    }
    static refreshAccessToken = async (req, res) => {
      const { refreshToken } = req.body;
      if (!refreshToken) {
          return res.status(400).json({ message: "Refresh Token is required." });
      }
  
      try {
          const decoded = JwtService.verifyRefreshToken(refreshToken);
          const keyToken = KeyTokenService.getKeyTokenById(decoded.id);
  
          if (!keyToken || !keyToken.refreshToken.includes(refreshToken)) {
              return res.status(403).json({ message: "Invalid Refresh Token." });
          }

          const newAccessToken = JwtService.generateAccessToken({ id: decoded.id, name: decoded.name, email: decoded.email });
  
          res.json({ accessToken: newAccessToken });
      } catch (error) {
          res.status(403).json({ message: "Invalid or Expired Refresh Token." });
      }
  };
}

module.exports = AuthController;
