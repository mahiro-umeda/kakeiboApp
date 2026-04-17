using Microsoft.EntityFrameworkCore;

namespace kakeiboApp;

public class MyDbContext : DbContext
{
    public DbSet<KakeiboItem> KakeiboItems { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder options)
        => options.UseSqlite("Data Source=kakeibo.db");
}