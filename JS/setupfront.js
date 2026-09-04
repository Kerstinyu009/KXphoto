const bcrypt = require("bcrypt"); 

// 註冊 
app.post("/setup", async function (request, response) {
    const firstname = request.body.firstname;
    const gender = request.body.gender;
    const birthdayM = request.body.birthdayM;
    const birthdayD = request.body.birthdayD;
    const birthdayY = request.body.birthdayY;
    const phonenum = request.body.phonenum;
    const setupemail = request.body.setupemail;
    const setuppsw = request.body.setuppsw;

    // 基本必填欄位驗證
    if (!setupemail || !setuppsw) {
        return response.status(400).json({
            status: "error",
            message: "請填寫必要的帳號與密碼欄位！"
        });
    }

    // 生日
    let birthday = null;
    if (birthdayY && birthdayM && birthdayD) {
        birthday = `${birthdayY}-${String(birthdayM).padStart(2, '0')}-${String(birthdayD).padStart(2, '0')}`;
    }

    try {
        const pool = await poolPromise;

        //檢查帳號是否重複
        const checkUser = await pool.request()
            .input("SetupEmail", sql.NVarChar(100), setupemail)
            .query("SELECT Id FROM Members WHERE SetupEmail = @SetupEmail");

        if (checkUser.recordset.length > 0) {
            return response.status(400).json({
                status: "error",
                message: "該電子信箱已被註冊！"
            });
        }

        // 密碼加密 
        const hashedPassword = await bcrypt.hash(setuppsw, 10);

        // Members 資料表
        await pool.request()
            .input("Firstname", sql.NVarChar(50), firstname || null)
            .input("Gender", sql.NVarChar(10), gender || null)
            .input("Birthday", sql.Date, birthday)
            .input("PhoneNum", sql.NVarChar(20), phonenum || null)
            .input("SetupEmail", sql.NVarChar(100), setupemail)
            .input("SetupPsw", sql.NVarChar(100), hashedPassword)
            .query(`
                INSERT INTO Members (Firstname, Gender, Birthday, PhoneNum, SetupEmail, SetupPsw)
                VALUES (@Firstname, @Gender, @Birthday, @PhoneNum, @SetupEmail, @SetupPsw)
            `);

        console.log("會員註冊成功並已寫入資料庫:", setupemail);

        return response.status(200).json({
            status: "success",
            message: "註冊成功！資料已寫入資料庫"
        });

    } catch (error) {
        console.error("註冊失敗:", error);

        return response.status(500).json({
            status: "error",
            message: "註冊失敗，內部伺服器錯誤。"
        });
    }
});