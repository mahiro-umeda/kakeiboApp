using Microsoft.EntityFrameworkCore;
using System.IO; // これを追加

namespace kakeiboApp;

public class MyDbContext : DbContext
{
    public DbSet<KakeiboItem> KakeiboItems { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        // 実行時のカレントディレクトリ（通常はプロジェクトのルート）を取得
        var baseDirectory = Directory.GetCurrentDirectory();
        var dbPath = Path.Combine(baseDirectory, "kakeibo.db");

        Console.WriteLine(dbPath);

        // 誰の環境でも、プロジェクト直下の kakeibo.db を見に行くようになる
        options.UseSqlite($"Data Source={dbPath}");
    }
}