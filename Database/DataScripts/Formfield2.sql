
-- - Upadted By / Date   - Praveen Yadav /  4 May 2020

 

-- Description - This  is been used for Product Catalog
-- Updated -  4 May 2020 - [table added]



alter table [dbo].[ItemMaster]
add   ProductNo int

alter table [dbo].[ItemMaster]
add   ProductDescr varchar(120)

alter table [dbo].[ItemMaster]
add   CatCd varchar(10)

alter table [dbo].[ItemMaster]
add   GradeCd varchar(10)

alter table [dbo].[ItemMaster]
add   SubCatCd varchar(10)

alter table [dbo].[ItemMaster]
add   SexCd varchar(10)

alter table [dbo].[ItemMaster]
add   SexCd varchar(20)

alter table [dbo].[ItemMaster]
add   SKU int

alter table [dbo].[ItemMaster]
add   Weight decimal (16,4)

alter table [dbo].[ItemMaster]
add   SizeCd varchar(10)


alter table [dbo].[ItemMaster]
add   SizeDescr varchar(80)

alter table [dbo].[ItemMaster]
add   ColorDescr varchar(80)

alter table [dbo].[ItemMaster]
add   BaseColor varchar(30)

alter table [dbo].[ItemMaster]
add   HexValue varchar(10)


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
           ('Product'
           ,'ItemMaster'
           ,'HexValue'
           ,''
           ,1
           ,1
           ,1
           ,1
           ,11
           ,102
           ,getdate()
            ,102
          ,getdate()
           ,1
           ,'HexValue'
           ,200
           ,null)

           INSERT INTO [dbo].[FormFieldLanguageMap]
           ([FormFieldID]
           ,[LanguageID]
           ,[Value])
     VALUES
           (3473
           ,1
           ,'ProductNo')