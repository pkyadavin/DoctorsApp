USE [ReverseLogix_Arcteryx]
GO

SELECT [ModuleID]
      ,[Module]
      ,[Order]
      ,[NavigateURL]
      ,[LabelCode]
      ,[Description]
      ,[ActiveFlag]
      ,[Instructions]
      ,[Scope]
      ,[FeatureCodes]
      ,[CreatedDate]
      ,[CreatedBy]
      ,[UpdatedBy]
      ,[UpdatedDate]
      ,[ParentModuleID]
      ,[ChildCount]
  FROM [dbo].[Module]
where [NavigateURL] like '%part%'


update [dbo].[Module]
set module='Configuration',
description ='Configuration'
where ModuleID=29