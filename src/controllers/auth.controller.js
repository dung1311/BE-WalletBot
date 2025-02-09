const UserService = require("../services/user.service"); // Lấy UserService
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

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });

        return res.status(200).json({
            message: "Đăng nhập thành công",
            token,
        });
    }
}

module.exports = AuthController;
