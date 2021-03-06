/****** Object:  StoredProcedure [dbo].[usp_RoleType_all]    Script Date: 21-05-2020 14:18:26 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/*
modified by : amrendra
modified on : 21-may-2020
description : add search filter in query

declare @TotalCount int ,@StartIndex int=0,@PageSize int=100,@SortColumn nvarchar(50)=null,@SortDirection nvarchar(4)=null,@FilterValue varchar(1000)=null,@PartnerID int=0
exec usp_RoleType_all @StartIndex,@PageSize,@TotalCount out,@SortColumn,@SortDirection,@FilterValue,@PartnerID,137,1
					 
select @TotalCount

modified by : praveen yadav
modified on : 21-may-2020
description : improved search Total Count

 If(@FilterQuery<>'null')      
 BEGIN          
	 SET @TotalCountQuery = @TotalCountQuery+ ' and '+@FilterQuery      
 END 



*/
ALTER proc [dbo].[usp_RoleType_all](    
 @StartIndex as int=1,      
 @PageSize as int=10,      
 @TotalCount as int output,      
 @SortColumn as varchar(50)=NULL,      
 @SortDirection as varchar(4)=NULL,      
 @FilterValue as varchar(1000)=null,    
 @PartnerID INT,    
 @UserID int,    
 @LanguageID int)    
AS    
BEGIN    

 DECLARE @TimeZoneDiffrence nvarchar(500),@TimeFormat nvarchar(500)    
SELECT @TimeZoneDiffrence=TimeZoneDifference,@TimeFormat=TimeFormat from [GetDateFormatByPartnerId](@PartnerID, @UserID)    
    
  Declare @Columns nvarchar(max)=''      
SELECT @Columns=@Columns+(case when FieldType = 'date' THEN ',format(DATEADD(hour,'+@TimeZoneDiffrence+',['+TableName+'].' +DBFieldName+'),'''+@TimeFormat+''') ' + ' ' +ISNULL(ColumnAlias,'')     
when FieldType = 'bit' THEN ',(CASE WHEN ['+TableName+'].' +DBFieldName +' = ''true'' THEN ''Yes'' ELSE ''No'' END)' + ' ' +ISNULL(ColumnAlias,'')     
ELSE ',['+TableName+'].' +DBFieldName + ' ' +ISNULL(ColumnAlias,'') END)  FROM FormField  WHERE formname='Roles' AND DBFieldName <> 'UserRoleType'    
    
 IF (LEFT(@Columns, 1) = ',')    
  set @Columns = RIGHT(@Columns, LEN(@Columns)-1)    
    
 Declare @TotalCountQuery nvarchar(max) = ''    
 SET @TotalCountQuery='select @TotalCount=count(*)     
  FROM RoleType LEFT JOIN Users CreatedBy ON CreatedBy.UserID = RoleType.CreatedBy    
  LEFT JOIN Users ModifiedBy ON ModifiedBy.UserID = RoleType.ModifiedBy    
  LEFT JOIN DashBoardMaster ON  DashBoardMaster.DashBoardMasterID = RoleType.DashBoardMasterID    
  WHERE RoleType.IsActive = 1 '      
    
DECLARE @FilterQuery nvarchar(max) = NULL 
print 'filtervalue : '+@FilterValue
if(@FilterValue <>'null' )
	SELECT @FilterQuery = COALESCE(ISNULL(@FilterQuery+' OR ' , ''),'') + TableName+'.'+DBFieldName +' like ''%'+@FilterValue+'%''' FROM FormField Where formname='Roles'  and ShowinGrid = 1     
print 'filterquery : '+@FilterQuery  

 If(@FilterQuery<>'null')      
 BEGIN          
	 SET @TotalCountQuery = @TotalCountQuery+ ' and '+@FilterQuery      
 END 

exec sp_executesql @TotalCountQuery,N'@TotalCount int OUTPUT',@TotalCount OUTPUT      
 Declare @sql nvarchar(4000)      
      
 Set @sql ='SELECT ' +@Columns+      
 ' ,CASE WHEN [RoleType].UserType =''PTR004'' THEN ''External'' WHEN [RoleType].UserType =''PTR001'' THEN ''Internal'' END AS UserRoleType      
  FROM RoleType LEFT JOIN Users CreatedBy ON CreatedBy.UserID = RoleType.CreatedBy    
  LEFT JOIN Users ModifiedBy ON ModifiedBy.UserID = RoleType.ModifiedBy    
  LEFT JOIN DashBoardMaster ON  DashBoardMaster.DashBoardMasterID = RoleType.DashBoardMasterID    
  WHERE RoleType.IsActive = 1 '    
  print @FilterQuery 
 if(@FilterValue <>'null' )
	set @sql=@sql+ ' and '+@FilterQuery
if(@SortDirection <>'null' )      
  BEGIN      
  Set @sql=@sql +' order by '+@SortColumn+' '+@SortDirection      
  END      
 ELSE      
  BEGIN      
  Set @sql=@sql+' order by RoleID Desc '      
  END      
      
 Set @sql=@sql+' offset ' +cast(@StartIndex as varchar(50))+' rows      
 FETCH NEXT '+ cast(@pagesize as Varchar(50))+' rows only'      
     
 print @sql      
 exec(@sql)      
    
SELECT(SELECT * FROM (    
SELECT     
Isnull(ff.ColumnAlias,ff.DBFieldName) as 'field',      
ffl.[value] as 'headerName',     
ff.GridWidth as 'width',    
ff.FieldType,    
ff.isRequired,    
ff.isVisible,    
ff.isEnabled,    
ff.ShowinGrid AS 'ShowinGrid',    
'true'as suppressFilter,    
ff.SortOrder    
FROM FormField ff INNER JOIN FormFieldLanguageMap ffl ON ffl.FormFieldID = ff.FormFieldID     
WHERE ff.FormName = 'Roles' AND ffl.LanguageID = @LanguageID)t ORDER BY t.SortOrder    
FOR JSON PATH) AS ColumnDefinations    
    
select distinct ModuleFunction.FunctionType from UserRoleMap     
INNER JOIN RoleModuleFunction ON UserRoleMap.RoleTypeID=RoleModuleFunction.RoleTypeId and RoleModuleFunction.IsApplicable=1 and UserRoleMap.IsActive=1    
INNER JOIN ModuleFunction ON ModuleFunction.ModuleFunctionId=RoleModuleFunction.ModuleFunctionId  AND ModuleFunction.isActive = 1    
INNER JOIN Module ON Module.ModuleID=ModuleFunction.ModuleID and Module.ActiveFlag=1    
--INNER JOIN PartnerUserRoleMap ON UserRoleMap.UserRoleMapID=PartnerUserRoleMap.UserRoleMapID and PartnerUserRoleMap.IsActive=1    
where UserID = @UserID --and partnerid = @PartnerID     
and Module.ModuleID = 7    
    
END 