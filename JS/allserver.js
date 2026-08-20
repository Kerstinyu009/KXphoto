const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// 登入
app.post('/login', function (req, res) {

    const memberEmail = req.body.memberEmail;
    const memberPsw = req.body.memberPsw;

    console.log('登入資料：', memberEmail, memberPsw);

    res.json({
        status: 'success',
        message: '登入成功'
    });
});

// 註冊
app.post('/setup', function (req, res) {

    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const setupemail = req.body.setupemail;

    console.log('成功收到註冊請求，email為：', setupemail);

    res.status(200).json({
        status: 'success',
        message: '後端已經收到資料'
    });
});

// 忘記密碼
app.post('/setpsw', function (req, res) {

    const email = req.body.forgetEmail;

    console.log('成功送達：', email);

    res.json({
        status: 'success',
        message: '後端成功收到資料'
    });
});

// 聯絡表單寄信

const postMan = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

app.post('/send/form', function (req, res) {

    const formData = req.body;

    console.log('後端收到資料：', formData);

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: '新表單通知，有人聯繫',
        text: `
          姓名：${formData.userName}
          電子郵件：${formData.userEmail}
          電話號碼：${formData.userPhone}
          訊息：${formData.userMessage}
        `
    };

    postMan.sendMail(mailOptions, function (error, info) {

        if (error) {

            console.log('寄信失敗：', error);

            return res.status(500).json({
                message: '後端已經收到資料，但寄信失敗'
            });
        }

        console.log('寄信成功：', info);

        return res.json({
            message: '後端已經收到資料，並成功寄出'
        });
    });
});


// 啟動 Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log(`Server is working on port ${PORT}`);
});