//JavaScript code
    async function loadList() {

            const category = document.getElementById('searchCategory').value;
    const start = document.getElementById('startDate').value;
    const end = document.getElementById('endDate').value;

    let params = [];

    if (category) params.push(`category=${category}`);  //入力があるものだけ追加
    if (start) params.push(`start=${start}`);
    if (end) params.push(`end=${end}`);

    let url = '/api/kakeibo/list';

            if (params.length > 0) {
        url += '?' + params.join('&');
            }

    const response = await fetch(url);  // サーバーからデータ取得
    const data = await response.json();

    const tbody = document.getElementById('list-body');
    tbody.innerHTML = '';

            data.forEach(item => {      //1件ずつループ
                const row = `<tr>
        <td>${item.date.substring(0, 10)}</td>
        <td>${item.name}</td>
        <td>${item.money}</td>
        <td>${item.type}</td>
        <td>${item.category}</td>
        <td>${item.memo}</td>
    </tr>`;                     // 日付を「YYYY-MM-DD」で処理
    tbody.innerHTML += row;
            });
        }


    // ページを開いたときに実行

    window.onload = loadList;

        // フォーム送信
        document.getElementById('Add').addEventListener('submit', async (e) => {
        e.preventDefault(); //ページ更新しない

    const item = {   //入力値をまとめる
        name: document.getElementById('name').value,
    money: parseInt(document.getElementById('money').value),
    type: document.getElementById('type').value,
    category: document.getElementById('category').value,
    date: document.getElementById('date').value,
    memo: document.getElementById('memo').value || null
            };
            try {


                const response = await fetch('/api/kakeibo/add', {
                    method: 'POST', // サーバーに登録
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(item)
                });

                if (response.ok) {
                    alert("登録しました！");
                    document.getElementById('Add').reset();
                    loadList(); // ★登録成功後にリストを更新！
                } else {

                    const err = await response.text();
                    console.log(err);
                    alert("登録に失敗しました。: \n" + err);
                }

            }
            catch (error){
                console.error(error);
                alert("通信エラー発生");
            }
        });