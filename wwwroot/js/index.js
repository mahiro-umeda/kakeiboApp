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
            alert("登録完了");
            this.reset(); // フォームをクリア
        }
    } catch (error) {
        console.error("エラーが発生しました:", error);
    }
});