
-- - Updated By / Date   - Praveen Yadav /  1 May 2020

 

-- Description - Fields Added for General Configuration
-- Updated - 1st may 2020 - [data added]


USE [ReverseLogix_Arcteryx]
GO

SELECT [FormFieldID]
      ,[FormName]
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
      ,[Remarks]
  FROM [dbo].[FormField]
where 
 -- FormFieldID in (3269,3271,3273,3270)
[DBFieldName]='SSLValue'

update [dbo].[FormField]
set [FormName]='Partners'
where FormFieldID in (3269,3271,3273,3270,3272)

  update [dbo].[FormFieldLanguageMap]
  set [Value]='SMTP '+[Value]
  where 
  FormFieldID in (3269,3271,3273,3270)