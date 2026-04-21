// JavaScript source code
//検索
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

    data.forEach(x => {
        list.innerHTML += `
<tr>
<td>${x.date}</td>
<td>${x.name}</td>
<td>${x.type}</td>
<td>${x.category}</td>
<td>${x.money}</td>
<td>${x.memo}</td>
<td><button class="btn btn-danger btn-sm" onclick="del(${x.id})">削除</button></td>
</tr>`;
    });
}

//削除
async function del(id) {
    if (!confirm("削除する？")) return;
    await fetch("/api/Kakeibo/" + id, { method: "DELETE" });
    loadData();
}

loadData();