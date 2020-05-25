/****** Object:  Table [dbo].[CountryConfigMap]    Script Date: 29-04-2020 22:51:16 ******/

-- - Created By / Date   - Praveen Yadav /  28 April 2020

 

-- Description - This  is been used for Country Configuration for Carrier
-- Updated - 28 April 2020 - [table added]


SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[CountryConfigMap](
	[CountryConfigMapID] [int] IDENTITY(1,1) NOT NULL,
	[CountryID] [int] NULL,
	[TypeLookupID] [int] NULL,
	[ConfigGroup] [nvarchar](100) NULL,
	[Description] [nvarchar](max) NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifyBy] [int] NULL,
	[ModifyDate] [datetime] NULL,
 CONSTRAINT [PK_CountryConfigMap_CountryConfigMapID] PRIMARY KEY CLUSTERED 
(
	[CountryConfigMapID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[CountryConfigMap]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_CountryConfigMap_Country_CountryID] FOREIGN KEY([CountryID])
REFERENCES [dbo].[Country] ([CountryID])
ON DELETE CASCADE
GO

ALTER TABLE [dbo].[CountryConfigMap] CHECK CONSTRAINT [FK_ameruat_CountryConfigMap_Country_CountryID]
GO

ALTER TABLE [dbo].[CountryConfigMap]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_CountryConfigMap_TypeLookUp_TypeLookupID] FOREIGN KEY([TypeLookupID])
REFERENCES [dbo].[TypeLookUp] ([TypeLookUpID])
GO

ALTER TABLE [dbo].[CountryConfigMap] CHECK CONSTRAINT [FK_ameruat_CountryConfigMap_TypeLookUp_TypeLookupID]
GO

ALTER TABLE [dbo].[CountryConfigMap]  WITH NOCHECK ADD  CONSTRAINT [FK_CountryConfigMap_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([UserID])
GO

ALTER TABLE [dbo].[CountryConfigMap] CHECK CONSTRAINT [FK_CountryConfigMap_Users_CreatedBy]
GO

ALTER TABLE [dbo].[CountryConfigMap]  WITH NOCHECK ADD  CONSTRAINT [FK_CountryConfigMap_Users_ModifyBy] FOREIGN KEY([ModifyBy])
REFERENCES [dbo].[Users] ([UserID])
GO

ALTER TABLE [dbo].[CountryConfigMap] CHECK CONSTRAINT [FK_CountryConfigMap_Users_ModifyBy]
