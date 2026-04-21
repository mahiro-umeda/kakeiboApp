
  CREATE TABLE  Kakeibo(
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT,
    Money INTEGER,
    Type TEXT,
    Category TEXT,
    Date TEXT,
    Memo TEXT
); -- テーブル設定


    -- 追加
    INSERT INTO Kakeibo (Name,Money,Type,Category,Date,Memo) 
    VALUES (@name,@money,@type,@category,@date,@memo);

    -- 全件取得
    SELECT 
          SUM(CASE WHEN Type = '収入' THEN Money ELSE 0 END) AS IncomeTotal,
          SUM(CASE WHEN Type = '支出' THEN Money ELSE 0 END) AS ExpenseTotal,
          SUM(CASE WHEN Type = '収入' THEN Money ELSE -Money END) AS BalanceTotal    
    FROM Kakeibo; -- kakeiboテーブルに入れる情報をセット

    --削除
    DELETE FROM Kakeibo WHERE Id = @id1;

    --範囲検索　(期間、カテゴリ)
   SELECT 
          SUM(CASE WHEN Type = '収入' THEN Money ELSE 0 END) AS IncomeTotal,
          SUM(CASE WHEN Type = '支出' THEN Money ELSE 0 END) AS ExpenseTotal,
          SUM(CASE WHEN Type = '収入' THEN Money ELSE -Money END) AS BalanceTotal
   FROM Kakeibo 
   WHERE
   (@startDate IS NULL OR Date >= @startDate)
   AND (@endDate IS NULL OR Date <= @endDate)
   AND (@category IS NULL OR Category =@category);    
  

    






            