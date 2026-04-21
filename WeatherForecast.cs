using Microsoft.AspNetCore.Mvc;
using System.Data.SQLite;
using System;
using System.Collections.Generic;
using System.IO;

namespace kakeiboApp.Controllers
{
    // データモデル
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
        private readonly string connectionString = "Data Source=kakeibo.db;Version=3;";

        // SQLを外部ファイルから読み込むヘルパー（クラス内に配置）
        private string GetSql(string tagName)
        {
            string path = "input.sql";
            if (!System.IO.File.Exists(path)) return string.Empty;

            string fullText = System.IO.File.ReadAllText(path);
            string startTag = $"-- [{tagName}]";
            int startIndex = fullText.IndexOf(startTag);

            if (startIndex == -1) return string.Empty;

            int nextTagIndex = fullText.IndexOf("-- [", startIndex + startTag.Length);
            string command = (nextTagIndex == -1)
                ? fullText.Substring(startIndex + startTag.Length)
                : fullText.Substring(startIndex + startTag.Length, nextTagIndex - (startIndex + startTag.Length));

            return command.Trim();
        }

        private void CreateTable(SQLiteConnection connection)
        {
            string sql = GetSql("CREATE_TABLE");
            using var cmd = new SQLiteCommand(sql, connection);
            cmd.ExecuteNonQuery();
        }

        [HttpPost]
        public IActionResult Post([FromBody] Kakeibo data)
        {
            try
            {
                using var connection = new SQLiteConnection(connectionString);
                connection.Open();
                CreateTable(connection);

                string sql = GetSql("INSERT_ITEM");
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
            catch (Exception e) { return BadRequest(e.Message); }
        }

        [HttpGet]
        public IActionResult Get(string? startDate, string? endDate, string? category)
        {
            try
            {
                using var connection = new SQLiteConnection(connectionString);
                connection.Open();
                CreateTable(connection);

                string sql = GetSql("SEARCH_TOTALS");
                using var cmd = new SQLiteCommand(sql, connection);

                // SQL内の変数名と一致させる
                cmd.Parameters.AddWithValue("@startDate", (object)startDate ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@endDate", (object)endDate ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@category", (object)category ?? DBNull.Value);

                using var reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    // SQLの AS ... で指定した名前で取得する
                    return Ok(new
                    {
                        IncomeTotal = reader["IncomeTotal"] != DBNull.Value ? reader["IncomeTotal"] : 0,
                        ExpenseTotal = reader["ExpenseTotal"] != DBNull.Value ? reader["ExpenseTotal"] : 0,
                        BalanceTotal = reader["BalanceTotal"] != DBNull.Value ? reader["BalanceTotal"] : 0
                    });
                }
                return NotFound();
            }
            catch (Exception e) { return BadRequest(e.Message); }
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                using var connection = new SQLiteConnection(connectionString);
                connection.Open();

                string sql = GetSql("DELETE_ITEM");
                using var cmd = new SQLiteCommand(sql, connection);

                // SQLファイル内で @id1 と書いている場合はここも @id1 にする
                cmd.Parameters.AddWithValue("@id", id);

                cmd.ExecuteNonQuery();
                return Ok();
            }
            catch (Exception e) { return BadRequest(e.Message); }
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
