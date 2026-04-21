// JavaScript source code

//メニュー
function toggleMenu() {
    const menu = document.getElementById("menu");
    menu.style.display = (menu.style.display === "block") ? "none" : "block";
}

//api
document.getElementById("Add").addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
        name: document.getElementById("name").value,
        money: parseInt(document.getElementById("money").value),
        type: document.getElementById("type").value,
        type2: document.getElementById("type2").value,
        date: document.getElementById("date").value,
        memo: document.getElementById("memo").value
    };

    // POST（保存）
    await fetch("/api/kakeibo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    // 更新表示
    loadData();
});


// GET（一覧取得）
async function loadData() {
    const res = await fetch("/api/kakeibo");
    const data = await res.json();

    console.log(data); //配列出れば正解

    const container = document.getElementById("list");
    container.innerHTML = "";

    data.forEach(item => {
        const div = document.createElement("div");
        div.textContent = `${item.name} ${item.money}円`;
        container.appendChild(div);
    });
}


// 初期表示
loadData();

