
  CREATE TABLE  Kakeibo(
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT,
    Money INTEGER,
    Type TEXT,
    Date INTEGER,
    Memo TEXT
); -- テーブル設定

    INSERT INTO kakeibo (Name,Money,Type,Date,Memo) 
    VALUES (@name,@money,@type,@date,@memo);

    SELECT name,Money,Type,Date,Memo FROM kakeibo; -- kakeiboテーブルに入れる情報をセット

    DELETE FROM kakeibo WHERE Id IN (@id1,@id2,@id3);

    SELECT *FROM kakeibo 
    WHERE strftime('%Y-%m', Date,'unixepoch') = @month; -- 特定の月を表示

    SELECT*FROM kakeibo WHERE Category = @category;
    






            