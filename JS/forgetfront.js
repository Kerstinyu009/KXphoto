// 抓資料
const forgetForm = document.getElementById('setpswBox');
// 監聽
forgetForm.addEventListener('submit', function(forgetEvent){
    // 防止網頁跳轉
    forgetEvent.preventDefault();
    // 打包資料
    const forgetformData = {
       forgetEmail: document.getElementById('forgetEmail').value
    };
    // 列印資料
    console.log('點擊按鈕，列印成功', forgetformData)
    // 給後端
    fetch('http://localhost:3000/setpsw', {
        method: 'POST',
        headers: {
            'Content-type': 'applicaiton/json'
        },
        body: JSON.stringify(forgetformData)
    })
    // 後端回傳結果
    .then (function(res){
        return res.json();
    })
    // 後端資料入
    .then(function(data){
        console.log('後端回傳結果', data);
        alert('傳送電子郵件成功');
    })
    // 重設/清空
    forgetForm.reset();
});