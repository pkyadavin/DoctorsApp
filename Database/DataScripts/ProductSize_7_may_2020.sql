/****** Object:  Table [dbo].[Category]    Script Date: 07-05-2020 18:07:35 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[ProductSize](

	[ProductSizeID] [int] IDENTITY(1,1) NOT NULL,
	[SizeCode] [varchar](10) NOT NULL,
	[ShortDescription] [nvarchar](150) NULL,
	[Description] [nvarchar](150) NULL,
	[IsActive] [bit] NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[ModifiedDate] [datetime] NULL,
 
) ON [PRIMARY]
GO


