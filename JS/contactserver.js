// 載入 dotenv 環境變數
require('dotenv').config();

// 引入工具
const express = require('express');
const cors = require('cors');
const app = express();
const nodemailer = require('nodemailer');

// 傳 json 資料
app.use(express.json());
app.use(cors());

// 設定 port（優先使用環境變數的 PORT，否則預設 3000）
const port = process.env.PORT || 3000;

// 設定寄信者（改由 .env 讀取，避免憑證外洩）
const postMan = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// 接收表單+給前端
app.post('/send/form', function(req, res){
    const formData = req.body;
    console.log('後端收到資料', formData);

    // 信件內容物
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: '新表單通知，有人聯繫',
        text: `
            姓名: ${formData.userName},
            電子郵件: ${formData.userEmail},
            電話號碼: ${formData.userPhone},
            訊息: ${formData.userMessage}
        `
    };

    // 寄送郵件
    postMan.sendMail(mailOptions, function(error, info){
        if(error){
            console.log('寄信失敗', error);
            
            return res.status(500).json({ message: '後端已經收到資料，但寄信失敗' });
        }
        else {
            console.log('寄信成功', info);
            return res.json({ message: '後端已經收到資料，並成功寄出' });
        }
    });
});

// 監聽
app.listen(port, function(){
    console.log(`Server is working on port ${port}...`);
});