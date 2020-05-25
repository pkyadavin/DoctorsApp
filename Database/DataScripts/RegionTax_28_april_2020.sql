USE [ReverseLogix_Arcteryx]
GO
alter table [dbo].[Region]
add  Tax int


INSERT INTO [dbo].[FormField]
           ([FormName]
           ,[TableName]
           ,[DBFieldName]
           ,[FieldType]
           ,[isRequired]
           ,[isVisible]
           ,[isEnabled]
           ,[ShowinGrid]
           ,[FeatureCodes]
           ,[CreatedBy]
           ,[CreatedDate]
           ,[ModifyBy]
           ,[ModifyDate]
           ,[SortOrder]
           ,[ColumnAlias]
           ,[GridWidth]
           ,[Remarks])
     VALUES
           ('Region'
           ,'Region'
           ,'Tax'
           ,null
           ,1
           ,1
           ,1
           ,1
           ,null
           ,101
           ,getdate()
           ,101
           ,getdate()
           ,10
           ,'Tax'
           ,200
           ,null)
GO


