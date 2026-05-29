// 引入工具
const express = require('express');
const cors = require('cors');
const app = express();
const nodemailer = require('nodemailer');
// 傳 json 資料
app.use(express.json());
app.use(cors());
// 設定port
const port = 3000;


// 設定寄信者
const postMan = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'chouyu10811701@gmail.com',
        pass:'d w v w t i u n w z d v k ub i'
    }
});

// 接收表單+給前端
app.post('/send/form', function(req,res){
    const formData = req.body;
    console.log('後端收到資料', formData);

    // 信件內容物
    const mailOptions = {
        from: 'chouyu10811701@gmail.com',
        to: 'chouyu10811701@gmail.com',
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
            return res.status(500).json({messsge:'後端已經收到資料，但寄信失敗'})
        }
        else {
            console.log('寄信成功', info);
            return res.json({message:'後端已經收到資料，並成功寄出'});
        }
    })
});

// 監聽
app.listen(port, function(){
    console.log('Server is working...')
});