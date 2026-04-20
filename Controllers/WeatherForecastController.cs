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
            Date TEXT,
            Memo TEXT
            )";

            using var createCmd = new SQLiteCommand(createTableSql, connection);
            {
                createCmd.ExecuteNonQuery();
            }

            //INSERT＝データを保存
            string sql = @"
            INSERT INTO Kakeibo (Name, Money, Type, Date, Memo)
            VALUES (@name, @money, @type, @date, @memo)
   　　　　 ";　//家計簿テーブル＞列指定＞VALUESで値（実際のデータ)を指定

            //上で指定した値を紐づけ(@name→"昼ごはん"みたいな)
            using var cmd = new SQLiteCommand(sql, connection);
            cmd.Parameters.AddWithValue("@name", data.Name);
            cmd.Parameters.AddWithValue("@money", data.Money);
            cmd.Parameters.AddWithValue("@type", data.Type);
            cmd.Parameters.AddWithValue("@date", data.Date);
            cmd.Parameters.AddWithValue("@memo", data.Memo);

            //実行、DBに書き込み
            cmd.ExecuteNonQuery();

            return Ok();
        }

//取得
        [HttpGet]
        public List<Kakeibo> Get()
        {
            var list = new List<Kakeibo>();
            string connectionString = "Data Source=kakeibo.db;Version=3;";

            using var connection = new SQLiteConnection(connectionString);
            connection.Open();

            //テーブル定義(もしテーブルなければつくる、あれば何もしない)
            string createTableSql = @"
            CREATE TABLE IF NOT EXISTS Kakeibo (
            Id INTEGER PRIMARY KEY AUTOINCREMENT,
            Name TEXT,
            Money INTEGER,
            Type TEXT,
            Date TEXT,
            Memo TEXT
            )";

            using var createCmd = new SQLiteCommand(createTableSql, connection);
            createCmd.ExecuteNonQuery();

            //SELECT＝データを取得
            string sql = "SELECT Name, Money, Type, Date, Memo FROM Kakeibo"; //欲しい列(serect)とテーブルを指定(from)

            using var cmd = new SQLiteCommand(sql, connection);
            using var reader = cmd.ExecuteReader(); //複数行の結果が返ってくる

            //結果を一行ずつ取り出す
            while (reader.Read())
            {
                //DB→C#の形に戻す
                list.Add(new Kakeibo
                {
                    Name = reader["Name"].ToString(),
                    Money = Convert.ToInt32(reader["Money"]),
                    Type = reader["Type"].ToString(),
                    Date = reader["Date"].ToString(),
                    Memo = reader["Memo"].ToString()
                });
            }

            return list;
        }
    }
}
