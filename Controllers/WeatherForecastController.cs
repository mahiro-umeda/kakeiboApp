using Microsoft.AspNetCore.Mvc;
using System.Data.SQLite;
using System.IO;

namespace kakeiboApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class KakeiboController : ControllerBase
    {
        private readonly string connectionString = "Data Source=kakeibo.db;Version=3;";
        private readonly string sqlFilePath = "input.sql";

        // SQLファイルから特定のタグの命令を抽出するヘルパー
        private string GetSql(string tag)
        {
            // File ではなく System.IO.File を使う
            if (!System.IO.File.Exists(sqlFilePath)) return string.Empty;

            var allText = System.IO.File.ReadAllText(sqlFilePath);
            var sections = allText.Split(new[] { "-- [" }, StringSplitOptions.RemoveEmptyEntries);

            foreach (var section in sections)
            {
                if (section.StartsWith(tag + "]"))
                {
                    // IndexOf は「I」が大文字
                    return section.Substring(section.IndexOf("]") + 1).Trim();
                }
            }
            return string.Empty;
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

                string sql = GetSql("INSERT");
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
        public IActionResult Get(string? type, string? category, string? startDate, string? endDate)
        {
            try
            {
                var list = new List<Kakeibo>();
                using var connection = new SQLiteConnection(connectionString);
                connection.Open();
                CreateTable(connection);

                // 基本となるSELECT文を取得
                string sql = GetSql("SELECT_BASE");

                if (!string.IsNullOrEmpty(type)) sql += " AND Type = @type";
                if (!string.IsNullOrEmpty(category)) sql += " AND Category = @category";
                if (!string.IsNullOrEmpty(startDate)) sql += " AND date(Date) >= date(@startDate)";
                if (!string.IsNullOrEmpty(endDate)) sql += " AND date(Date) <= date(@endDate)";

                using var cmd = new SQLiteCommand(sql, connection);
                if (!string.IsNullOrEmpty(type)) cmd.Parameters.AddWithValue("@type", type);
                if (!string.IsNullOrEmpty(category)) cmd.Parameters.AddWithValue("@category", category);
                if (!string.IsNullOrEmpty(startDate)) cmd.Parameters.AddWithValue("@startDate", startDate);
                if (!string.IsNullOrEmpty(endDate)) cmd.Parameters.AddWithValue("@endDate", endDate);

                using var reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    list.Add(new Kakeibo
                    {
                        Id = Convert.ToInt32(reader["Id"]),
                        Name = reader["Name"]?.ToString() ?? "",
                        Money = Convert.ToInt32(reader["Money"]),
                        Type = reader["Type"]?.ToString() ?? "",
                        Category = reader["Category"]?.ToString() ?? "",
                        Date = reader["Date"]?.ToString() ?? "",
                        Memo = reader["Memo"]?.ToString() ?? ""
                    });
                }
                return Ok(list);
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
                CreateTable(connection);

                string sql = GetSql("DELETE");
                using var cmd = new SQLiteCommand(sql, connection);
                cmd.Parameters.AddWithValue("@id", id);
                cmd.ExecuteNonQuery();

                return Ok();
            }
            catch (Exception e) { return BadRequest(e.Message); }
        }
    }

    public class Kakeibo
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public int Money { get; set; }
        public string? Type { get; set; }
        public string? Category { get; set; }
        public string? Date { get; set; }
        public string? Memo { get; set; }
    }
}