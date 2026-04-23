//やらないといけないこと：書いている内容をどのページで行う処理なのかを分けてあげる

// 登録（index.html）
async function add() {
    const data = {
        name: document.getElementById("name").value,
        money: parseInt(document.getElementById("money").value),
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

    alert("登録しました");
}

// 一覧（breakdown.html)
async function loadBreakdownData() {
    const type = document.getElementById("searchType")?.value;
    const start = document.getElementById("startDate")?.value;
    const end = document.getElementById("endDate")?.value;

    let url = "/api/Kakeibo?";

    if (type) url += "type=" + type + "&";
    if (start) url += "startDate=" + start + "&";
    if (end) url += "endDate=" + end;

    const res = await fetch(url);
    const data = await res.json();

    const list = document.getElementById("list");
    if (!list) return;

    list.innerHTML = "";

    data.forEach(item => {
        list.innerHTML += `
        <tr>
            <td>${item.date}</td>
            <td>${item.name}</td>
            <td>${item.type}</td>
            <td>${item.category}</td>
            <td>${item.money}</td>
            <td>${item.memo}</td>
        </tr>`;
    });

}

// breakdown.htmlだけで実行
if (document.getElementById("list")) {
    loadBreakdownData();
}
