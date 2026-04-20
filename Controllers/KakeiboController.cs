using Microsoft.AspNetCore.Mvc;
using kakeiboApp; // あなたのプロジェクトの名前空間

[Route("api/[controller]")]
[ApiController]
public class KakeiboController : ControllerBase
{
    private readonly MyDbContext _context = new MyDbContext();

    [HttpPost("add")]
    public IActionResult AddItem([FromBody] KakeiboItem item)
    {
        try
        {
            // データベースに保存
            _context.KakeiboItems.Add(item);
            _context.SaveChanges();
            return Ok(new { message = "保存に成功しました！" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("list")]
    public IActionResult GetItems(string category, DateTime? start, DateTime? end)
    {
        _context.Database.EnsureCreated();
        // ① まず全部取得
        var items = _context.KakeiboItems.ToList();

        // ② カテゴリで絞る（選ばれてたら）
        if (!string.IsNullOrEmpty(category))
        {
            items = items.Where(x => x.Category == category).ToList();
        }

        // ③ 開始日で絞る
        if (start != null)
        {
            items = items.Where(x => x.Date >= start).ToList();
        }

        // ④ 終了日で絞る
        if (end != null)
        {
            items = items.Where(x => x.Date <= end).ToList();
        }

        // ⑤ 日付の新しい順に並べる
        items = items.OrderByDescending(x => x.Date).ToList();

        return Ok(items);
    }

    [HttpGet("test")]
    public IActionResult Test()
    {
        var baseDirectory = Directory.GetCurrentDirectory();
        var dbPath = Path.Combine(baseDirectory, "kakeibo.db");

        return Ok(dbPath);
    }
}