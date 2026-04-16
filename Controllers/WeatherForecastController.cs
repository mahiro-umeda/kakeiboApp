using Microsoft.AspNetCore.Mvc;
using System.Data.SQLite;

namespace kakeiboApp.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries =
        [
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        ];

        [HttpGet(Name = "GetWeatherForecast")]
        public List<string> Get() // 戻り値を WeatherForecast から string のリストに変更
        {
            var results = new List<string>();
            string connectionString = "Data Source=Test.db;Version=3;";

            using (var connection = new SQLiteConnection(connectionString))
            {
                connection.Open();
                // 接続を開いた直後にこれを実行するように書き換え
               string createTableSql = @"
               CREATE TABLE IF NOT EXISTS Kakeibo (
                   Id INTEGER PRIMARY KEY AUTOINCREMENT,
                   Date TEXT,
                   Item TEXT,
                   Amount INTEGER
               )";  
                       using (var command = new SQLiteCommand(createTableSql, connection))
                       {
                           command.ExecuteNonQuery();
                       } 

                // 1. まずテーブルがあるか確認（念のため）
                var createCmd = new SQLiteCommand("CREATE TABLE IF NOT EXISTS Test (Id INTEGER PRIMARY KEY, Msg TEXT)", connection);
                createCmd.ExecuteNonQuery();

                // 2. データを1件追加（実行するたびに増えます）
                var insertCmd = new SQLiteCommand("INSERT INTO Test (Msg) VALUES ('保存されたデータです')", connection);
                insertCmd.ExecuteNonQuery();

                // 3. データを読み取る
                using (var command = new SQLiteCommand("SELECT Msg FROM Test", connection))
                {
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            results.Add(reader["Msg"].ToString());
                        }
                    }
                }
            }

            return results; // 保存されているすべてのメッセージをブラウザに返す
        }

        //登録用メソッド
        [HttpPost(Name = "PostMessage")]
        public string Post(string message)
        {
            string connectionString = "Data Source=Test.db;Version=3;";

            using (var connection = new SQLiteConnection(connectionString))
            {
                connection.Open();

                // SQLインジェクション対策（@msg を使う）をしてデータを挿入
                string insertSql = "INSERT INTO Test (Msg) VALUES (@msg)";
                using (var command = new SQLiteCommand(insertSql, connection))
                {
                    command.Parameters.AddWithValue("@msg", message);
                    command.ExecuteNonQuery();
                }
            }

            return $"「{message}」をDBに登録しました！";
        }
    }
}
