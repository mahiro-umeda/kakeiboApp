// 開閉
function toggleMenu() {
    const menu = document.getElementById("menu");
    if (!menu) return;

    menu.style.display =
        (menu.style.display === "block") ? "none" : "block";
}

// 外クリックで閉じる（追加）
document.addEventListener("click", function (e) {
    const menu = document.getElementById("menu");
    const btn = document.querySelector(".menu-btn");

    if (!menu || !btn) return;

    if (!menu.contains(e.target) && !btn.contains(e.target)) {
        menu.style.display = "none";
    }
});



// ⭐ フォームがあるページだけ動くようにする
const form = document.getElementById("Add");

if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = {
            name: document.getElementById("name").value,
            money: parseInt(document.getElementById("money").value),
            type: document.getElementById("type").value,
            type2: document.getElementById("type2")?.value || "",
            date: document.getElementById("date").value,
            memo: document.getElementById("memo").value
        };

        // POST（保存）
        await fetch("/api/kakeibo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        // 再読み込み（必要なページだけ）
        if (typeof loadData === "function") {
            loadData();
        }
    });
}

async function loadData() {

    const container = document.getElementById("list");
    if (!container) return; // ⭐ 他ページでエラー防止

    const res = await fetch("/api/kakeibo");
    const data = await res.json();

    console.log(data);

    container.innerHTML = "";

    data.forEach(item => {
        const div = document.createElement("div");
        div.textContent = `${item.name} ${item.money}円`;
        container.appendChild(div);
    });
}

// ⭐ listがあるページだけ実行
if (document.getElementById("list")) {
    loadData();
}