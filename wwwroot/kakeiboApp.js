// JavaScript source code
document.getElementById('Add').addEventListener('submit', async (e) => {
    e.preventDefault(); // 画面リロードを防ぐ

    // 入力値を取得してオブジェクトにまとめる
    const data = {
        name: document.getElementById('name').value,
        money: parseInt(document.getElementById('money').value),
        type: document.getElementById('type').value,
        category: document.getElementById('type2').value,
        date: document.getElementById('date').value,
        memo: document.getElementById('memo').value
    };

    // C#のサーバーへ送信
    const response = await fetch('/api/kakeibo/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (response.ok) alert("登録しました！");
});