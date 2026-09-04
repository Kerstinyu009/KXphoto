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
    password: "P@ssw0rd",   
    server: "localhost",       
    database: "KXphotoDB",    
    options: {
        encrypt: false,         
        trustServerCertificate: true 
    }
};

// 資料庫連線池
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
app.post("/setup", async function (request, response) {
    const firstname = request.body.firstname;
    const gender = request.body.gender;
    const birthdayM = request.body.birthdayM;
    const birthdayD = request.body.birthdayD;
    const birthdayY = request.body.birthdayY;
    const phonenum = request.body.phonenum;
    const setupemail = request.body.setupemail;
    const setuppsw = request.body.setuppsw;

    // 必填檢查
    if (!setupemail || !setuppsw) {
        return response.status(400).json({
            status: "error",
            message: "請填寫信箱與密碼！"
        });
    }

    // 組合生日格式 (YYYY-MM-DD)，使用 String 防範數字類型轉置錯誤
    let birthday = null;
    if (birthdayY && birthdayM && birthdayD) {
        birthday = `${birthdayY}-${String(birthdayM).padStart(2, '0')}-${String(birthdayD).padStart(2, '0')}`;
    }

    try {
        const pool = await poolPromise;

        // 檢查信箱是否重複註冊
        const checkEmail = await pool.request()
            .input("SetupEmail", sql.NVarChar(100), setupemail)
            .query("SELECT Id FROM Members WHERE SetupEmail = @SetupEmail");

        if (checkEmail.recordset.length > 0) {
            return response.status(400).json({
                status: "error",
                message: "此電子信箱已被註冊！"
            });
        }

        // 寫入 Members 資料表
        await pool.request()
            .input("Firstname", sql.NVarChar(50), firstname || null)
            .input("Gender", sql.NVarChar(10), gender || null)
            .input("Birthday", sql.Date, birthday)
            .input("PhoneNum", sql.NVarChar(20), phonenum || null)
            .input("SetupEmail", sql.NVarChar(100), setupemail)
            .input("SetupPsw", sql.NVarChar(100), setuppsw)
            .query(`
                INSERT INTO Members (Firstname, Gender, Birthday, PhoneNum, SetupEmail, SetupPsw)
                VALUES (@Firstname, @Gender, @Birthday, @PhoneNum, @SetupEmail, @SetupPsw)
            `);

        console.log("會員註冊成功，已寫入資料庫:", setupemail);

        return response.status(200).json({
            status: "success",
            message: "註冊成功！資料已順利寫入資料庫。"
        });

    } catch (error) {
        console.error("註冊失敗:", error);
        return response.status(500).json({
            status: "error",
            message: "伺服器內部錯誤，無法寫入資料。"
        });
    }
});

// 2. 登入 API (/login)
app.post("/login", async function (req, res) {
    const email = req.body.memberEmail;
    const psw = req.body.memberPsw;

    console.log("收到登入請求:", email);

    try {
        const pool = await poolPromise;

        // 向 Members 資料表查詢 SetupEmail 欄位
        const result = await pool.request()
            .input("email", sql.VarChar(100), email)
            .query("SELECT * FROM Members WHERE SetupEmail = @email");

        // 查無此帳號
        if (result.recordset.length === 0) {
            return res.status(400).json({
                status: "error",
                message: "電子信箱或密碼錯誤！"
            });
        }

        const user = result.recordset[0];

        // 比對資料庫欄位 SetupPsw
        if (user.SetupPsw !== psw) {
            return res.status(400).json({
                status: "error",
                message: "電子信箱或密碼錯誤！"
            });
        }

        console.log("登入成功:", email);

        // 回傳成功結果與用戶資料給前端
        return res.json({
            status: "success",
            message: "登入成功！",
            user: {
                id: user.Id,
                email: user.SetupEmail,
                firstName: user.Firstname
            }
        });

    } catch (error) {
        console.error("登入查詢時發生錯誤:", error);
        return res.status(500).json({
            status: "error",
            message: "內部錯誤，請稍後再試。"
        });
    }
});

// 啟動伺服器並監聽 Port 3000
app.listen(port, function () {
    console.log(`Server is working on port ${port}...`);
});