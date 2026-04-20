using Microsoft.AspNetCore.Mvc;
using System.Data.SQLite;

namespace kakeiboApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class KakeiboController : ControllerBase
    {
        private readonly string connectionString = "Data Source=kakeibo.db;Version=3;";

        // =========================
        // SQL定義（DB側の仕事）
        // =========================
        private readonly string createTableSql = @"
        CREATE TABLE IF NOT EXISTS Kakeibo(
            Id INTEGER PRIMARY KEY AUTOINCREMENT,
            Name TEXT,
            Money INTEGER,
            Type TEXT,
            Date INTEGER,
            Category TEXT,
            Memo TEXT
        )";

        private readonly string insertSql = @"
        INSERT INTO Kakeibo (Name, Money, Type, Date,Category, Memo)
        VALUES (@name, @money, @type, @date, @category,@memo)
        ";

        private readonly string selectSql = @"
        SELECT Name, Money, Type, Date, Category,Memo FROM Kakeibo
        ";

        // =========================
        // 登録（POST）
        // =========================
        [HttpPost]
        public IActionResult Post([FromBody] Kakeibo data)
        {
            using var connection = new SQLiteConnection(connectionString);
            connection.Open();

            CreateTable(connection);

            using var cmd = new SQLiteCommand(insertSql, connection);

            cmd.Parameters.AddWithValue("@name", data.Name);
            cmd.Parameters.AddWithValue("@money", data.Money);
            cmd.Parameters.AddWithValue("@type", data.Type);
            cmd.Parameters.AddWithValue("@date",new DateTimeOffset(data.Date).ToUnixTimeSeconds());
            cmd.Parameters.AddWithValue("@category", data.Category);
            cmd.Parameters.AddWithValue("@memo", data.Memo);

            cmd.ExecuteNonQuery();

            return Ok();
        }

        // =========================
        // 取得（GET）
        // =========================
        [HttpGet]
        public List<Kakeibo> Get()
        {
            var list = new List<Kakeibo>();

            using var connection = new SQLiteConnection(connectionString);
            connection.Open();

            CreateTable(connection);

            using var cmd = new SQLiteCommand(selectSql, connection);
            using var reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                list.Add(new Kakeibo
                {
                    Name = reader["Name"].ToString(),
                    Money = Convert.ToInt32(reader["Money"]),
                    Type = reader["Type"].ToString(),

                    // UNIX時間 → DateTime
                    Date = DateTimeOffset
                        .FromUnixTimeSeconds(Convert.ToInt64(reader["Date"]))
                        .DateTime,
                    Category = reader["Category"].ToString(),
                    Memo = reader["Memo"].ToString()
                });
            }

            return list;
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            using var connection = new SQLiteConnection(connectionString);
            connection.Open();

            string sql = "DELETE FROM Kakeibo WHERE Id = @id";

            using var cmd = new SQLiteCommand(sql, connection);
            cmd.Parameters.AddWithValue("@id", id);

            cmd.ExecuteNonQuery();

            return Ok();
        }

        // =========================
        // DB共通処理
        // =========================
        private void CreateTable(SQLiteConnection connection)
        {
            using var cmd = new SQLiteCommand(createTableSql, connection);
            cmd.ExecuteNonQuery();
        }

        [HttpGet("category/{category}")]
        public List<Kakeibo> GetByCategory(string category)
        {
            var list = new List<Kakeibo>();

            using var connection = new SQLiteConnection(connectionString);
            connection.Open();
            CreateTable(connection);

            string sql = @"
            SELECT Name, Money, Type, Date, Category, Memo
            FROM Kakeibo
            WHERE Category = @category";

            using var cmd = new SQLiteCommand(sql, connection);
            cmd.Parameters.AddWithValue("@category", category);

            using var reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                list.Add(new Kakeibo
                {
                    Name = reader["Name"].ToString(),
                    Money = Convert.ToInt32(reader["Money"]),
                    Type = reader["Type"].ToString(),
                    Date = DateTimeOffset
                          .FromUnixTimeSeconds(Convert.ToInt64(reader["Date"]))
                          .DateTime,
                    Category = reader["Category"].ToString(),
                    Memo = reader["Memo"].ToString()
                });
            }

            return list;
        }

    }
}

