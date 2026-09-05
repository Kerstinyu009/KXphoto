-- 若資料庫不存在則自動建立
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'KXphotoDB')
BEGIN
    CREATE DATABASE [KXphotoDB];
END
GO

-- 切換到 KXphotoDB 資料庫
USE [KXphotoDB];
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- 如果 Members 資料表已經存在，先刪除舊表以防重複執行時報錯
IF OBJECT_ID('[dbo].[Members]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Members];
GO

CREATE TABLE [dbo].[Members](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Firstname] [nvarchar](50) NOT NULL,
	[Gender] [nvarchar](10) NULL,
	[Birthday] [date] NULL,
	[PhoneCountry] [nvarchar](10) NOT NULL,
	[PhoneNum] [nvarchar](30) NOT NULL,
	[SetupEmail] [nvarchar](100) NOT NULL,
	[SetupPsw] [nvarchar](255) NOT NULL
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Members] ADD  CONSTRAINT [PK_Members] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

-- 測試
INSERT INTO [dbo].[Members] ([Firstname], [Gender], [Birthday], [PhoneCountry], [PhoneNum], [SetupEmail], [SetupPsw])
VALUES ('測試員', '男', '1995-01-01', '+886', '0912345678', 'test@example.com', '1234');
GO