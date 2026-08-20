document.addEventListener("DOMContentLoaded", () => {
    // 尋找網頁中有沒有放置導覽列的容器
    const placeholder = document.getElementById('nav-placeholder');
    
    if (placeholder) {
        // 從網站根目錄一律抓取 /navBar.html
        fetch('navBar.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('導覽列檔案載入失敗，請檢查路徑');
                }
                return response.text();
            })
            .then(data => {
                // 把導覽列的 HTML 放進容器中
                placeholder.innerHTML = data;
            })
            .catch(error => console.error('發生錯誤:', error));
    }
});
