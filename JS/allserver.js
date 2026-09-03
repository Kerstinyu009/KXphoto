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

    // console.log('成功收到註冊請求，email為：', setupemail);

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

// 啟動 Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log(`Server is working on port ${PORT}`);
});