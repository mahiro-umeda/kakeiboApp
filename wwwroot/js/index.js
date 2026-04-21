async function add() {
    const data = {
        name: document.getElementById("name").value,
        money: Number(document.getElementById("money").value),
        type: document.getElementById("type").value,
        category: document.getElementById("category").value,
        date: document.getElementById("date").value,
        memo: document.getElementById("memo").value
    };

    await fetch("/api/Kakeibo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    alert("登録完了");
}