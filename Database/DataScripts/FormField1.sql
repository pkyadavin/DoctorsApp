
-- - Updated By / Date   - Praveen Yadav /  2nd May 2020

 

-- Description - This  is been used for Country Configuration for Carrier
-- Updated - 2nd  May 2020 - [data added]

USE [ReverseLogix_Arcteryx]
GO

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
           ('Country'
           ,'Country'
           ,'Tax'
           ,null
           ,1
           ,1
           ,1
           ,1
           ,null
           ,101
           ,null
           ,101
           ,null
           ,5
           ,'Tax'
           ,300
           ,null)
GO


