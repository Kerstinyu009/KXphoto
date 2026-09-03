// 引入工具
const express = require("express");
const cors = require("cors");
const sql = require("mssql"); 
const app = express();
const port = 3000;

// 跨域設定
app.use(cors());

// 解析 JSON 與表單資料
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// SQL Server 連線設定
const dbConfig = {
    user: "sa",       
    password: "P@ssw0rd",   // 你的 SQL Server 密碼
    server: "localhost",         // 伺服器位址 (例如: localhost 或 127.0.0.1)
    database: "KXphotoDB",    // 你的資料庫名稱
    options: {
        encrypt: false,          // 本地開發通常設為 false，若為 Azure 需設為 true
        trustServerCertificate: true // 本地開發測試設為 true
    }
};

// 建立資料庫連線池並測試連線
const poolPromise = new sql.ConnectionPool(dbConfig)
    .connect()
    .then(pool => {
        console.log("SQL Server 資料庫連線成功！");
        return pool;
    })
    .catch(err => {
        console.error("SQL Server 資料庫連線失敗:", err);
    });

// 1. 註冊 API (/setup)
app.post("/setup", function (request, response) {
    var firstname = request.body.firstname;
    var lastname = request.body.lastname;
    var gender = request.body.gender;
    var birthdayM = request.body.birthdayM;
    var birthdayD = request.body.birthdayD;
    var birthdayY = request.body.birthdayY;
    var country = request.body.country;
    var phonenum = request.body.phonenum;
    var setupemail = request.body.setupemail;
    var setuppsw = request.body.setuppsw;
    var setuppswA = request.body.setuppswA;

    // 查看後端是否接收到資料
    // console.log("成功收到註冊請求，email為:", setupemail);

    // 回傳結果給前端
    response.status(200).json({
        status: "success",
        message: "後端已經收到資料"
    });
});

// 2. 登入 API (/login)
app.post("/login", function (req, res) {
    const email = req.body.memberEmail;
    const psw = req.body.memberPsw;

    // 後端印數據，確認是否成功送達
    console.log("OK", email);
    console.log("OK", psw);

    // 回傳結果給前端
    res.json({
        status: "success",
        message: "後端成功收到資料"
    });
});

// 啟動伺服器並監聽 Port 3000
app.listen(port, function () {
    console.log(`Server is working on port ${port}...`);
});