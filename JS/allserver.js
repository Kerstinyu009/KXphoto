// 引入工具
const express = require("express");
const cors = require("cors");
const sql = require("mssql");
const app = express();
const bcrypt = require("bcrypt");
const port = process.env.PORT || 3000;
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

// 資料庫連線
const poolPromise = new sql.ConnectionPool(dbConfig)
    .connect()
    .then(pool => {
        console.log("SQL Server 資料庫連線成功！");
        return pool;
    })
    .catch(err => {
        console.error("SQL Server 資料庫連線失敗:", err);
    });

// 註冊 API (/setup)
app.post("/setup", async function (request, response) {
    const firstname = request.body.firstname;
    const gender = request.body.gender;
    const birthdayM = request.body.birthdayM;
    const birthdayD = request.body.birthdayD;
    const birthdayY = request.body.birthdayY;
    const phoneCountry = request.body.phoneCountry;
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

    // 生日組合 (YYYY-MM-DD)，若不齊全則給 null
    let birthday = null;
    if (birthdayY && birthdayM && birthdayD) {
        const formattedDate = `${birthdayY}-${String(birthdayM).padStart(2, '0')}-${String(birthdayD).padStart(2, '0')}`;
        if (formattedDate.length === 10) {
            birthday = formattedDate;
        }
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

        // 寫入 Members 資料表 (對照資料表結構與型態)
        await pool.request()
            // 不允許 Null 的欄位 (Firstname, PhoneCountry, PhoneNum)，若沒填給予預設字串，避免 SQL 500 報錯
            .input("Firstname", sql.NVarChar(50), firstname || "")                    
            .input("Gender", sql.NVarChar(10), gender || null)                         // 允許 Null
            .input("Birthday", sql.Date, birthday)                                     // 允許 Null
            .input("PhoneCountry", sql.NVarChar(10), phoneCountry || "+886")           // 不允許 Null (新增)
            .input("PhoneNum", sql.NVarChar(30), phonenum || "")                      // 不允許 Null (修正為 30)
            .input("SetupEmail", sql.NVarChar(100), setupemail)                        // 不允許 Null
            .input("SetupPsw", sql.NVarChar(255), setuppsw)                            // 不允許 Null (修正為 255)
            .query(`
                INSERT INTO Members (Firstname, Gender, Birthday, PhoneCountry, PhoneNum, SetupEmail, SetupPsw)
                VALUES (@Firstname, @Gender, @Birthday, @PhoneCountry, @PhoneNum, @SetupEmail, @SetupPsw)
            `);

        console.log("會員註冊成功，已寫入資料庫:", setupemail);

        return response.status(200).json({
            status: "success",
            message: "註冊成功！資料已順利寫入資料庫。"
        });

    } catch (error) {
        console.error("【註冊失敗詳細錯誤】:", error);
        return response.status(500).json({
            status: "error",
            message: "伺服器內部錯誤，無法寫入資料。"
        });
    }
});

// 登入 API (/login)
app.post("/login", async function (req, res) {
    const email = req.body.memberEmail;
    const psw = req.body.memberPsw;

    console.log("收到登入請求:", email);

    try {
        const pool = await poolPromise;

        const result = await pool.request()
            .input("email", sql.NVarChar(100), email)
            .query("SELECT * FROM Members WHERE SetupEmail = @email");

        if (result.recordset.length === 0) {
            return res.status(400).json({
                status: "error",
                message: "電子信箱或密碼錯誤！"
            });
        }

        const user = result.recordset[0];

        if (user.SetupPsw !== psw) {
            return res.status(400).json({
                status: "error",
                message: "電子信箱或密碼錯誤！"
            });
        }

        console.log("登入成功:", email);

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