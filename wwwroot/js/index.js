document.getElementById("kakeiboForm").addEventListener("submit", async function (e) {
    // フォームのデフォルトの挙動（ページ遷移）を防止
    e.preventDefault();

    const data = {
        name: document.getElementById("name").value,
        money: Number(document.getElementById("money").value),
        type: document.getElementById("type").value,
        category: document.getElementById("category").value,
        date: document.getElementById("date").value,
        memo: document.getElementById("memo").value
    };

    try {
        const response = await fetch("/api/Kakeibo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            showMessage("登録完了","success");
            this.reset(); // フォームをクリア
        }
    } catch (error) {
        console.error("エラーが発生しました:", error);
    }


});

const btn = document.querySelector("button[type='submit']");

btn.addEventListener("click", function (e) {

    
    const rect = btn.getBoundingClientRect();
    btn.style.setProperty('--x', `${rect.width / 2}px`);
    btn.style.setProperty('--y', `${rect.height / 2}px`);

    btn.classList.add("ripple");

    setTimeout(() => {
        btn.classList.remove("ripple");
    }, 500);
});

function showMessage(text, type) {
    const msg = document.getElementById("message");
    msg.textContent = text;

    if (type === "success") {
        msg.className = "alert alert-success";
    } else {
        msg.className = "alert alert-danger";
    }

    msg.classList.remove("show");

    msg.style.display = "block";

    //一旦強制再描画
    msg.offsetHeight;

    // ふわっと表示
    msg.classList.add("show");
   

    // 3秒後に消える
    setTimeout(() => {
        msg.classList.remove("show");

        setTimeout(() => {
            msg.style.display = "none";
        }, 300);
    }, 3000);
}