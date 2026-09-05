document.getElementById("setupForm").addEventListener("submit", async function (e) {
    e.preventDefault(); // 阻擋表單預設轉頁

    // 抓取被勾選 (checked) 的 radio 按鈕
    const genderInput = document.querySelector('input[name="gender"]:checked');
    // 如果有勾選就拿 value，沒勾選就給 null
    const gender = genderInput ? genderInput.value : null;

    // 取得前端 input 的值
    const formData = {
        firstname: document.getElementById("setupFirstname").value,
        gender: gender,
        birthdayM: document.getElementById("birthdayM").value,
        birthdayD: document.getElementById("birthdayD").value,
        birthdayY: document.getElementById("birthdayY").value,
        phonenum: document.getElementById("phoneNum").value,
        phoneCountry: document.getElementById("phoneCountry").value,
        setupemail: document.getElementById("setupEmail").value,
        setuppsw: document.getElementById("setuppsw").value
        };

    try {
        // 將資料發送到 Node.js 後端 API
        const response = await fetch("http://localhost:3000/setup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
            alert("註冊成功！");
            // console.log(formData);
        } else {
            alert("註冊失敗：" + result.message);
        }
    } catch (error) {
        // console.error("發送請求失敗:", error);
        alert("無法連線到伺服器！");
    }
});