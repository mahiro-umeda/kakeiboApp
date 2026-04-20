/*設定を準備（builder）
機能を登録（Services）
アプリを作る（Build）
リクエストの通り道を決める（Middleware）
実行（Run）*/

//webアプリの設定を作る箱(=builder)
var builder = WebApplication.CreateBuilder(args);

// 機能の登録(Services)
builder.Services.AddControllers(); //APIコントローラを使えるようにする
builder.Services.AddEndpointsApiExplorer(); //APIの情報を集める
builder.Services.AddSwaggerGen(); //Swagger画面をつくる
builder.Services.AddOpenApi(); //OpenAPI仕様対応

var app = builder.Build();　//今まで登録した設定をまとめて実行可能なwebアプリにする

//開発環境用の設定
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(); // これで /swagger が開けるようになります
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

//ミドルウェア
app.UseDefaultFiles();   // index.htmlを自動で返す
app.UseStaticFiles();　//wwwroot(HTML,CSS,JS)を配信
app.UseAuthorization();
app.MapControllers(); //URLが来たらControllerへ（GET/api/kakeibo → Controllerの[HttpGet]）

//サーバー起動(ブラウザアクセス可能、API呼び出し可能)
app.Run();

public class Kakeibo
{
    public string Name { get; set; }
    public int Money { get; set; }
    public string Type { get; set; }
    public  DateTime Date { get; set; }
    public string Category { get; set; }
    public string Memo { get; set; }
}