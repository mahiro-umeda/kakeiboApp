# Kakeibo App

## ■ アプリ概要
「Kakeibo App」は、日々の収支を素早く記録し、シンプルに管理するためのWebベースの家計簿アプリケーションです。
複雑な初期設定を排除し、金額・カテゴリ・日付を直感的なフォームから即座に登録できるため、家計簿が続かない方でも手軽にデータを蓄積していくことができます。

## ■ 使い方
以下の手順でローカル環境で実行できます。
1. リポジトリをクローン
   ```bash
   git clone https://github.com/mahiro-umeda/kakeiboApp
   
   cd kakeiboApp
2. データベースのマイグレーション
   ```bash
   dotnet ef database update
3. アプリケーションの起動
   ```bash
   dotnet run
4. 起動後、コンソールに表示されるURL（例: http://localhost:5081）にブラウザでアクセスしてください。

## ■ ユーザー層
- 家計簿をつけたいが、多機能すぎるアプリは使いこなせないと感じている方
- 動作が軽く、ブラウザからサッと入力したい方

## ■ アプリ利用のイメージ
1. **外出先や帰宅後の隙間時間に**: ブラウザを開き、使った金額とカテゴリを入力して登録。
2. **月末の振り返りに**: 蓄積されたデータ一覧を確認し、何にお金を使ったかを把握。
3. **データの整理**: 不要になった入力ミスや古いデータを行単位で削除してクリーンに維持。

## ■ 画面イメージ
<img width="1913" height="932" alt="image" src="https://github.com/user-attachments/assets/37f8a22d-3db9-47ca-a75b-d371226de90f" />


## ■ 機能一覧
- **収支登録機能**: 
    - 品目名、金額、収支タイプ（支出/収入）、カテゴリー、日付の入力・保存
    - Fetch APIを用いた非同期なデータ送信
- **一覧表示機能**: 登録された全データのリスト表示
- **データ削除機能**: 蓄積されたデータを1行単位で削除する管理機能
- **レスポンシブデザイン**: PC、スマートフォンの両方のブラウザからの操作に対応(未確認)

## ■ 使用技術
### バックエンド
- **Language**: C#
- **Framework**: .NET 10 / ASP.NET Core
- **ORM**: Entity Framework Core
### フロントエンド
- **Languages**: HTML5, CSS3, JavaScript
### データベース
- **Database**: SQLite3

## ■ システム構成図
アプリケーションは以下のシンプルな3層構造で構成されています。

```mermaid
graph LR
    subgraph Client
        A[Browser / HTML5+JS]
    end
    subgraph Server
        B[ASP.NET Core API]
    end
    subgraph Storage
        C[(SQLite Database)]
    end

    A -- JSON/Fetch API --> B
    B -- Entity Framework Core --> C
