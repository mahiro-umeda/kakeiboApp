// JavaScript source code

async function loadData() {

    const params = new URLSearchParams();

    const type = document.getElementById("searchType").value;
    const cat = document.getElementById("searchCategory").value;
    const s = document.getElementById("startDate").value;
    const e = document.getElementById("endDate").value;

    if (type) params.append("type", type);
    if (cat) params.append("category", cat);
    if (s) params.append("startDate", s);
    if (e) params.append("endDate", e);

    const res = await fetch("/api/Kakeibo?" + params.toString());
    const data = await res.json();

    const list = document.getElementById("list");
    list.innerHTML = "";

    let totalIncome = 0;
    let totalExpense = 0;

    data.forEach(x => {

        const money = Number(x.money);

        if (x.type === "収入") {
            totalIncome += money;
        } else {
            totalExpense += money;
        }

        list.innerHTML += `
<tr>
<td>${x.date}</td>
<td>${x.name}</td>
<td>${x.type}</td>
<td>${x.category}</td>
<td>${x.money}</td>
<td>${x.memo}</td>
<td><button class="btn btn-danger" onclick="del(${x.id})">削除</button></td>
</tr>`;
    });

    document.getElementById("totalIncome").innerText = totalIncome;
    document.getElementById("totalExpense").innerText = totalExpense;
    document.getElementById("balance").innerText = totalIncome - totalExpense;
}

async function del(id) {
    if (!confirm("削除する？")) return;

    await fetch("/api/Kakeibo/" + id, { method: "DELETE" });
    loadData();
}

// 初期表示
loadData();