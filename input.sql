-- [CREATE_TABLE]
IF NOT EXISTS (
    SELECT 1 FROM sys.objects
    WHERE object_id = OBJECT_ID(N'[dbo].[Kakeibo]') AND type = N'U'
)
BEGIN
    CREATE TABLE dbo.Kakeibo(
        Id INT IDENTITY(1,1) PRIMARY KEY,
        [Name] NVARCHAR(200),
        Money INT,
        [Type] NVARCHAR(100),
        Category NVARCHAR(100),
        [Date] DATETIME2,
        Memo NVARCHAR(MAX)
    );
END;

-- [INSERT]
INSERT INTO Kakeibo ([Name], Money, [Type], Category, [Date], Memo)
VALUES (@name, @money, @type, @category, @date, @memo);

-- [SELECT_BASE]
SELECT Id, [Name], Money, [Type], Category, [Date], Memo 
FROM Kakeibo 
WHERE 1=1;

-- [DELETE]
DELETE FROM Kakeibo WHERE Id = @id;