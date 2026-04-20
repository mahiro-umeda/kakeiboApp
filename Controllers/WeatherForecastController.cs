using Microsoft.AspNetCore.Mvc;
using System.Data.SQLite;

namespace kakeiboApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class KakeiboController : ControllerBase
    {
//登録
        [HttpPost]
        public IActionResult Post([FromBody] Kakeibo data)
        {
            string connectionString = "Data Source=kakeibo.db;Version=3;";

            using var connection = new SQLiteConnection(connectionString);
            connection.Open();

            //テーブル定義(もしテーブルなければつくる、あれば何もしない)
            string createTableSql = @"
            CREATE TABLE IF NOT EXISTS Kakeibo(
            Id INTEGER PRIMARY KEY AUTOINCREMENT,
            Name TEXT,
            Money INTEGER,
            Type TEXT,
            Category TEXT,
            Date TEXT,
            Memo TEXT
            )";

            using var createCmd = new SQLiteCommand(createTableSql, connection);
            {
                createCmd.ExecuteNonQuery();
            }

            //INSERT＝データを保存
            string sql = @"
            INSERT INTO Kakeibo (Name, Money, Type, Category, Date, Memo)
            VALUES (@name, @money, @type, @category, @date, @memo)
   　　　　 ";　//家計簿テーブル＞列指定＞VALUESで値（実際のデータ)を指定

            //上で指定した値を紐づけ(@name→"昼ごはん"みたいな)
            using var cmd = new SQLiteCommand(sql, connection);
            cmd.Parameters.AddWithValue("@name", data.Name);
            cmd.Parameters.AddWithValue("@money", data.Money);
            cmd.Parameters.AddWithValue("@type", data.Type);
            cmd.Parameters.AddWithValue("@category", data.Category);
            cmd.Parameters.AddWithValue("@date", data.Date);
            cmd.Parameters.AddWithValue("@memo", data.Memo);

            //実行、DBに書き込み
            cmd.ExecuteNonQuery();

            return Ok();
        }

        //取得
        [HttpGet]
        public List<Kakeibo> Get(string type, string startDate, string endDate)
        {
            var list = new List<Kakeibo>();
            string connectionString = "Data Source=kakeibo.db;Version=3;";

            using var connection = new SQLiteConnection(connectionString);
            connection.Open();

            string sql = "SELECT Id, Name, Money, Type, Category, Date, Memo FROM Kakeibo WHERE 1=1";

            if (!string.IsNullOrEmpty(type))
                sql += " AND Type = @type";

            if (!string.IsNullOrEmpty(startDate))
                sql += " AND Date >= @start";

            if (!string.IsNullOrEmpty(endDate))
                sql += " AND Date <= @end";

            using var cmd = new SQLiteCommand(sql, connection);

            if (!string.IsNullOrEmpty(type))
                cmd.Parameters.AddWithValue("@type", type);

            if (!string.IsNullOrEmpty(startDate))
                cmd.Parameters.AddWithValue("@start", startDate);

            if (!string.IsNullOrEmpty(endDate))
                cmd.Parameters.AddWithValue("@end", endDate);

            using var reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                list.Add(new Kakeibo
                {
                    Id = Convert.ToInt32(reader["Id"]),
                    Name = reader["Name"].ToString(),
                    Money = Convert.ToInt32(reader["Money"]),
                    Type = reader["Type"].ToString(),
                    Category = reader["Category"].ToString(),
                    Date = reader["Date"].ToString(),
                    Memo = reader["Memo"].ToString()
                });
            }

            return list;
        }

        //削除
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            string connectionString = "Data Source=kakeibo.db;Version=3;";

            using var connection = new SQLiteConnection(connectionString);
            connection.Open();

            string sql = "DELETE FROM Kakeibo WHERE Id = @id";

            using var cmd = new SQLiteCommand(sql, connection);
            cmd.Parameters.AddWithValue("@id", id);
            cmd.ExecuteNonQuery();

            return Ok();
        }
    }
}
