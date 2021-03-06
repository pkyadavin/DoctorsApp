/****** Object:  UserDefinedFunction [dbo].[fun_Authorization]    Script Date: 21-05-2020 12:59:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/****** Object:  FUNCTION [dbo].[fun_Authorization]   
- Created By / Date  - 
- Updated By / Date   -  Praveen Yadav /  21 May 2020
 
added line order by mf.FunctionCode

Description - This  is been used for this purpose

to bring Consistency in role permissions options, 
make them in one order for all permissions, 
View, Add, Edit, Delete 

 ******/


ALTER FUNCTION [dbo].[fun_Authorization](
    @Mid INT,
	@Rid INT ,
	 @tab AS tblids READONLY
)
RETURNS NVARCHAR(MAX)
AS
BEGIN
	DECLARE @strReturn NVARCHAR(MAX)
	IF EXISTS(SELECT DISTINCT 1
	FROM Module m LEFT JOIN ModuleFunction mf ON m.ModuleID = mf.ModuleID AND mf.isActive = 1
		LEFT JOIN RoleModuleFunction rmf ON mf.ModuleFunctionId = rmf.ModuleFunctionID  AND rmf.RoleTypeId = @Rid
	WHERE m.ModuleID = @Mid AND rmf.RoleModuleFunctionID IS NOT NULL)
	BEGIN
		SELECT @strReturn = (SELECT DISTINCT
		rmf.RoleModuleFunctionID AS 'ID', mf.ModuleID AS 'ModuleID', 
		mf.FunctionName AS 'Display_Name', mf.FunctionCode AS 'Code', 
		ISNULL(rmf.IsApplicable, 0) AS 'IsApplicable'
		FROM Module m LEFT JOIN ModuleFunction mf ON m.ModuleID = mf.ModuleID AND mf.isActive = 1
			LEFT JOIN RoleModuleFunction rmf ON mf.ModuleFunctionId = rmf.ModuleFunctionID  AND rmf.RoleTypeId = @Rid
		WHERE m.ModuleID = @Mid
			AND m.ModuleID IN ( SELECT id FROM @tab)
		order by mf.FunctionCode
		FOR JSON PATH)
	END
	ELSE
	BEGIN
		SELECT @strReturn = (SELECT '[]')
	END
	RETURN @strReturn
END

