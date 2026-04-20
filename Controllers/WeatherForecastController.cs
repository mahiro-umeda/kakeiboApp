using Microsoft.AspNetCore.Mvc;
using System.Data.SQLite;

namespace kakeiboApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class KakeiboController : ControllerBase
    {
        string connectionString = "Data Source=kakeibo.db;Version=3;";

        private void CreateTable(SQLiteConnection connection)
        {
            string sql = @"
            CREATE TABLE IF NOT EXISTS Kakeibo(
            Id INTEGER PRIMARY KEY AUTOINCREMENT,
            Name TEXT,
            Money INTEGER,
            Type TEXT,
            Category TEXT,
            Date TEXT,
            Memo TEXT
            )";

            using var cmd = new SQLiteCommand(sql, connection);
            cmd.ExecuteNonQuery();
        }

        // 登録
        [HttpPost]
        public IActionResult Post([FromBody] Kakeibo data)
        {
            using var connection = new SQLiteConnection(connectionString);
            connection.Open();

            CreateTable(connection);

            string sql = @"
            INSERT INTO Kakeibo (Name, Money, Type, Category, Date, Memo)
            VALUES (@name, @money, @type, @category, @date, @memo)
            ";

            using var cmd = new SQLiteCommand(sql, connection);
            cmd.Parameters.AddWithValue("@name", data.Name);
            cmd.Parameters.AddWithValue("@money", data.Money);
            cmd.Parameters.AddWithValue("@type", data.Type);
            cmd.Parameters.AddWithValue("@category", data.Category);
            cmd.Parameters.AddWithValue("@date", data.Date);
            cmd.Parameters.AddWithValue("@memo", data.Memo);

            cmd.ExecuteNonQuery();

            return Ok();
        }

        // 検索（カテゴリ対応）
        [HttpGet]
        public List<Kakeibo> Get(string? type, string? category, string? startDate, string? endDate)
        {
            var list = new List<Kakeibo>();

            using var connection = new SQLiteConnection(connectionString);
            connection.Open();

            CreateTable(connection);

            string sql = @"
            SELECT Id, Name, Money, Type, Category, Date, Memo 
            FROM Kakeibo 
            WHERE 1=1
            ";

            if (!string.IsNullOrEmpty(type))
                sql += " AND Type = @type";

            if (!string.IsNullOrEmpty(category))
                sql += " AND Category = @category";

            if (!string.IsNullOrEmpty(startDate))
                sql += " AND date(Date) >= date(@startDate)";

            if (!string.IsNullOrEmpty(endDate))
                sql += " AND date(Date) <= date(@endDate)";

            using var cmd = new SQLiteCommand(sql, connection);

            if (!string.IsNullOrEmpty(type))
                cmd.Parameters.AddWithValue("@type", type);

            if (!string.IsNullOrEmpty(category))
                cmd.Parameters.AddWithValue("@category", category);

            if (!string.IsNullOrEmpty(startDate))
                cmd.Parameters.AddWithValue("@startDate", startDate);

            if (!string.IsNullOrEmpty(endDate))
                cmd.Parameters.AddWithValue("@endDate", endDate);

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

        // 削除
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            using var connection = new SQLiteConnection(connectionString);
            connection.Open();

            CreateTable(connection);

            string sql = "DELETE FROM Kakeibo WHERE Id = @id";

            using var cmd = new SQLiteCommand(sql, connection);
            cmd.Parameters.AddWithValue("@id", id);

            cmd.ExecuteNonQuery();

            return Ok();
        }
    }
}