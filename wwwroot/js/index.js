<<<<<<< HEAD
﻿async function add() {
    const data = {
        name: document.getElementById("name").value,
        money: Number(document.getElementById("money").value),
=======
// JavaScript source code
//登録
async function add() {
    const data = {
        name: document.getElementById("name").value,
        money: parseInt(document.getElementById("money").value),
>>>>>>> main
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

<<<<<<< HEAD
    alert("登録完了");
=======
    alert("登録完了！");
>>>>>>> main
}