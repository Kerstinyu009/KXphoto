// 抓資料
const form = document.getElementById('contactForm');
const btn = document.getElementById('enterButton');
// 監聽
btn.addEventListener('click', function(event){
    event.preventDefault();
    // 打包資料
    const formData = {
        userName : document.getElementById('userName').value,
        userEmail : document.getElementById('userEmail').value,
        userPhone : document.getElementById('userPhone').value,
        userMessage : document.getElementById('userMessage').value,
    };
    // 列印資料
    console.log('點擊按鈕，列印成功', formData);
    // 送資料給後端
    fetch('http://localhost:3000/send/form', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then (function(res) {
        return res.json();
        })
    .then (function(data){
        console.log('後端傳回結果',data);
        alert('表單傳送成功');
        });
    });
