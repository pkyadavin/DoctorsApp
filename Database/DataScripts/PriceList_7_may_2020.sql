USE [ReverseLogix_Arcteryx]
GO

INSERT INTO [dbo].[Module]
           ([Module]
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
           ,[ParentModuleID])
     VALUES
           ('PriceList'
           ,7
           ,'/back-office/PriceList'
           ,''
           ,'Organization Mgmt / Price List'
           ,1
           ,''
           ,''
           ,'FC00014'
           ,getdate()
           ,102
           ,102
           ,getdate()
           ,27)
GO


INSERT INTO [dbo].[ModuleFunction]
           ([FunctionCode]
           ,[ModuleID]
           ,[FunctionName]
           ,[FunctionType]
           ,[CreatedBy]
           ,[CreatedDate]
           ,[ModifiedBy]
           ,[ModifiedDate]
           ,[isActive])
     VALUES
           (4001
           ,2382
           ,'Delete'
           ,'Delete'
           ,null
           ,getdate()
           ,null
          ,getdate()
           ,1)