using Microsoft.AspNetCore.Mvc;
using System.Data.SQLite;
using System;
using System.Collections.Generic;


namespace kakeiboApp.Controllers
{
    public class Kakeibo
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public int Money { get; set; }
        public string? Type { get; set; }
        public string? Category { get; set; }
        public string? Date { get; set; }
        public string? Memo { get; set; }

        public string? StartDate { get; set; }

        public string? EndDate { get; set; }
    }

[ApiController]
    [Route("api/[controller]")]
    public class KakeiboController : ControllerBase
    {
        string connectionString = "Data Source=kakeibo.db;Version=3;";

        // テーブル作成
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
            try
            {
                using var connection = new SQLiteConnection(connectionString);
                connection.Open();

                CreateTable(connection);

                string sql = @"
                INSERT INTO Kakeibo (Name, Money, Type, Category, Date, Memo)
                VALUES (@name, @money, @type, @category, @date, @memo)
                ";

                using var cmd = new SQLiteCommand(sql, connection);

                cmd.Parameters.AddWithValue("@name", data.Name ?? "");
                cmd.Parameters.AddWithValue("@money", data.Money);
                cmd.Parameters.AddWithValue("@type", data.Type ?? "");
                cmd.Parameters.AddWithValue("@category", data.Category ?? "");
                cmd.Parameters.AddWithValue("@date", data.Date ?? "");
                cmd.Parameters.AddWithValue("@memo", data.Memo ?? "");
                

                cmd.ExecuteNonQuery();

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        // 検索
        [HttpGet]
        public IActionResult Get(string? type, string? category, string? startDate, string? endDate)
        {
            try
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
                    sql += " AND Date >= @startDate";

                if (!string.IsNullOrEmpty(endDate))
                    sql += " AND Date <= @endDate";

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
                        Name = reader["Name"]?.ToString() ?? "",
                        Money = reader["Money"] != DBNull.Value ? Convert.ToInt32(reader["Money"]) : 0,
                        Type = reader["Type"]?.ToString() ?? "",
                        Category = reader["Category"]?.ToString() ?? "",
                        Date = reader["Date"]?.ToString() ?? "",
                        Memo = reader["Memo"]?.ToString() ?? ""
                    });
                }

                return Ok(list);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        // 削除
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            try
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
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }


        [HttpGet("summary")]
        public IActionResult GetSummary(string? category, string? startDate, string? endDate)
        {
            try
            {
                using var connection = new SQLiteConnection(connectionString);
                connection.Open();

                CreateTable(connection);

                string sql = @"
        SELECT 
          SUM(CASE WHEN Type = '収入' THEN Money ELSE 0 END),
          SUM(CASE WHEN Type = '支出' THEN Money ELSE 0 END),
          SUM(CASE WHEN Type = '収入' THEN Money ELSE -Money END)
        FROM Kakeibo
        WHERE
        (@category IS NULL OR Category = @category)
        AND (@startDate IS NULL OR Date >= @startDate)
        AND (@endDate IS NULL OR Date <= @endDate)
        ";

                using var cmd = new SQLiteCommand(sql, connection);

                // 🔥 NULL制御（ここ重要）
                cmd.Parameters.AddWithValue("@category",
                    string.IsNullOrEmpty(category) ? (object)DBNull.Value : category);

                cmd.Parameters.AddWithValue("@startDate",
                    string.IsNullOrEmpty(startDate) ? (object)DBNull.Value : startDate);

                cmd.Parameters.AddWithValue("@endDate",
                    string.IsNullOrEmpty(endDate) ? (object)DBNull.Value : endDate);

                using var reader = cmd.ExecuteReader();
                reader.Read();

                return Ok(new
                {
                    income = reader.IsDBNull(0) ? 0 : Convert.ToInt32(reader[0]),
                    expense = reader.IsDBNull(1) ? 0 : Convert.ToInt32(reader[1]),
                    balance = reader.IsDBNull(2) ? 0 : Convert.ToInt32(reader[2])
                });
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

    }

}