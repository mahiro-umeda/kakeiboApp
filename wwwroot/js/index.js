
const form = document.getElementById("Add");

if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault(); //リロード防止


        const name = document.getElementById("name").value.trim();
        const moneyValue = document.getElementById("money").value;
        const money = Number(moneyValue);

        

        const data = {
            name: name,
            money: money,
            type: document.getElementById("type").value,
            category: document.getElementById("category").value,
            date: document.getElementById("date").value,
            memo: document.getElementById("memo").value
        };

        try {
            const res = await fetch("/api/kakeibo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            if (!res.ok) {
                throw new Error("通信失敗");
            }

           alert("登録完了");
            
            
        
            } catch (error) {
              console.error(error);
                alert("エラー発生");
            }
           
    });
    
}