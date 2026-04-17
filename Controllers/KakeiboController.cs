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
}