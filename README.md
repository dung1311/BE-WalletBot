# BE-WalletBot

Backend of AI-integrated expense management application.

## 📌 Mô tả

BE-WalletBot là backend cho một ứng dụng quản lý chi tiêu tích hợp AI. Hệ thống sử dụng Node.js, Express, MongoDB và Redis để quản lý người dùng, xác thực và bảo mật dữ liệu.

## 🚀 Cài đặt

### Yêu cầu hệ thống
- Node.js >= 16
- MongoDB
- Redis

### Cài đặt và chạy dự án

Clone repository:
```sh
git clone https://github.com/dung1311/BE-WalletBot.git
cd BE-WalletBot
```

Cài đặt các dependencies:
```sh
npm install
```

Tạo file `.env` dựa theo `.env.example` và cấu hình các biến môi trường.

Chạy server ở chế độ development:
```sh
npm run dev
```

Chạy server ở chế độ production:
```sh
npm start
```

## 📂 Cấu trúc thư mục (Dự kiến)
```
📂 BE-WalletBot  
 ┣ 📂 src   # Source code chính  
 ┃ ┣ 📂 controllers  # Xử lý logic API  
 ┃ ┣ 📂 models  # Định nghĩa mô hình dữ liệu (MongoDB)  
 ┃ ┣ 📂 routes  # Định nghĩa các route API  
 ┃ ┣ 📂 middleware  # Middleware bảo mật và xác thực  
 ┃ ┣ 📂 config  # Cấu hình ứng dụng  
 ┃ ┗ 📄 server.js  # Điểm khởi động của ứng dụng  
 ┣ 📄 package.json  
 ┣ 📄 .env.example  
 ┣ 📄 README.md  
```

## 🔑 Cấu hình Môi trường (`.env`)
```env
PORT 

DEV_DB_HOST 
DEV_DB_PORT 
DEV_DB_NAME

JWT_SECRET_KEY 
JWT_SECRET_ACCESS 
JWT_SECRET_REFRESH 
ACCESS_TOKEN_EXPIRY 
REFRESH_TOKEN_EXPIRY

EMAIL_SERVER 
EMAIL_PORT 
EMAIL_HOST 
EMAIL_APP_PASSWORD 

REDIS_HOST 
REDIS_PASSWORD 
REDIS_PORT
REDIS_EXPIRY
REDIS_SESSION_SECRET

DB_CLOUD 
```

## 📌 API Endpoints

### 🔹 Xác thực (Auth)
- **POST** `/api/auth/register` - Đăng ký người dùng
- **POST** `/api/auth/login` - Đăng nhập & nhận JWT
- **POST** `/api/auth/otp` - Gửi OTP xác thực
- **POST** `/api/auth/forgotPassword` - Quên mật khẩu
- **POST** `/api/auth/verifyOTP` - Xác minh OTP (Dùng cho cả đăng ký và đặt lại mật khẩu)
- **POST** `/api/auth/refresh-token` - Làm mới token
- **POST** `/api/auth/logout` - Đăng xuất
- **GET** `/api/auth/index` - Test API

### 🔹 Quản lý tài chính
- **GET** `/api/expense/getExpenseByAmount` - Lấy danh sách giao dịch theo số tiền
- **GET** `/api/expense/getExpenseByDate` - Lấy danh sách giao dịch theo ngày
- **GET** `/api/expense/getExpenseByCategory` - Lấy danh sách giao dịch theo danh mục
- **GET** `/api/expense/sortExpenses` - Sắp xếp danh sách giao dịch
- **GET** `/api/expense/sortPartner` - Sắp xếp theo đối tác
- **GET** `/api/expense/get-expense` - Lấy tất cả giao dịch
- **GET** `/api/expense/:expenseId` - Lấy chi tiết giao dịch
- **GET** `/api/expense/search/:keySearch` - Tìm kiếm giao dịch
- **POST** `/api/expense/add-expense` - Thêm giao dịch mới
- **DELETE** `/api/expense/:expenseId` - Xóa giao dịch
- **PATCH** `/api/expense/:expenseId` - Cập nhật giao dịch

## 🛠 Công nghệ sử dụng
- Node.js & Express
- MongoDB & Mongoose
- Redis
- JWT (JSON Web Token)
- bcrypt (mã hóa mật khẩu)
- Nodemailer (Gửi email xác thực)
- Helmet & Compression (Bảo mật & tối ưu)

## 🧪 Chạy kiểm thử (Testing)
```sh
npm test
```

## 🤝 Đóng góp
1. Fork repository
2. Tạo branch mới (`git checkout -b feature-moi`)
3. Commit thay đổi (`git commit -m "Mô tả thay đổi"`)
4. Push lên GitHub (`git push origin feature-moi`)
5. Tạo Pull Request

## 📞 Liên hệ
🔗 GitHub: [BE-WalletBot](https://github.com/dung1311/BE-WalletBot)
📧 Email: co.adm1n.sup@gmail.com


