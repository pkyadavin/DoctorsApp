/****** Object:  StoredProcedure [dbo].[usp_Region_Post]    Script Date: 29-04-2020 13:04:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
   
   /*
   exec usp_Region_Post '{"RegionID":0,"RegionCode":"AUTO","RegionName":"APAC","Description":"test","CreatedBy":0,"ModifyBy":0,"IsActive":true,"ReturnWindow":334,"ReturnArchive":23,"PendingReturnArchive":23,"countryIds":"307,203,208","Gateways":[{"RegionConfigMapID":0,"TypeLookUpID":1838,"TypeCode":"TCM000017","TypeName":"Brands","TypeGroup":"CG001","Description":"Brands","AttributeValue":[]},{"RegionConfigMapID":0,"TypeLookUpID":448,"TypeCode":"TCM00001","TypeName":"User","TypeGroup":"CG001","Description":"User Name"},{"RegionConfigMapID":0,"TypeLookUpID":449,"TypeCode":"TCM00002","TypeName":"Password","TypeGroup":"CG001","Description":"Password"},{"RegionConfigMapID":0,"TypeLookUpID":1763,"TypeCode":"TCM00003","TypeName":"ServiceEndpoints","TypeGroup":"CG001","Description":"Service Endpoint"},{"RegionConfigMapID":0,"TypeLookUpID":1764,"TypeCode":"TCM00004","TypeName":"ShipperNumber","TypeGroup":"CG001","Description":"Access License Number"},{"RegionConfigMapID":0,"TypeLookUpID":1765,"TypeCode":"TCM00005","TypeName":"AccessKey","TypeGroup":"CG001","Description":"Account Number"},{"RegionConfigMapID":0,"TypeLookUpID":1767,"TypeCode":"TCM00007","TypeName":"Activate","TypeGroup":"CG001","Description":"Activate"}]}',102,1,NULL
   */

ALTER PROC [dbo].[usp_Region_Post](@Region NVARCHAR(MAX), @UserID INT,@LanguageID INT,@ReturnRegionID AS INT OUTPUT)  
AS  
--INSERT INTO ErrorLog (Error_Msg,Error_Details,Request) VALUES(@Region,@UserID,@LanguageID)  
BEGIN TRY  
 BEGIN TRANSACTION  
 DECLARE @RegionID INT,  
  @RegionName NVARCHAR(200),  
  @RegionCode NVARCHAR(100),  
  @Description NVARCHAR(500),  
  @ReturnArchive INT,  
  @PendingReturnArchive INT,  
  @ReturnWindow INT,
  @IsActive BIT,  
  @CurrencyID INT,   
  @DateTimeFormat nvarchar(200),   
  @CountryIds NVARCHAR(MAX)  
   
 SELECT       
  @RegionID = JSON_VALUE(@Region, '$.RegionID'),  
  @RegionName = JSON_VALUE(@Region, '$.RegionName'),  
  @CountryIds = JSON_VALUE(@Region, '$.countryIds'),  
  @RegionCode = JSON_VALUE(@Region, '$.RegionCode'),  
  @Description = JSON_VALUE(@Region, '$.Description'),  
  @ReturnArchive = JSON_VALUE(@Region, '$.ReturnArchive'),  
  @ReturnWindow = JSON_VALUE(@Region, '$.ReturnWindow'),  
  @PendingReturnArchive = JSON_VALUE(@Region, '$.PendingReturnArchive'),  
  @IsActive = JSON_VALUE(@Region, '$.IsActive'),    
  @DateTimeFormat = CASE WHEN JSON_VALUE(@Region, '$.DateTimeFormat') = 'undefined' THEN null ELSE JSON_VALUE(@Region, '$.DateTimeFormat') END  
     
 WHERE ISJSON(@Region) > 0     
  
 IF(@RegionID = 0)  
 BEGIN  
  IF EXISTS(SELECT 1 FROM Region WHERE RegionName = @RegionName)  
   THROW 50000, 'You have already added teritory with this name.',1;    
 END  
 ELSE  
 BEGIN  
  IF EXISTS(SELECT 1 FROM Region WHERE RegionName = @RegionName AND RegionID <> @RegionID)  
   THROW 50000, 'You have already added teritory with this name.',1;  
 END  
  
 IF(@RegionID = 0)  
 BEGIN  
       
  EXEC [usp_GenerateModuleAutoNumber]   N'TER0001', N'Region', N'RegionCode', null, @RegionCode OUTPUT  
    
	INSERT INTO Region (
	  RegionCode, RegionName, [Description], 
	  DateTimeFormat, ReturnArchive, PendingReturnArchive, 
	  IsActive, CreatedBy, CreatedDate, 
	  ModifyBy, ModifyDate, ReturnWindow
	) 
	VALUES 
	  (
		@RegionCode, 
		@RegionName, 
		@Description, 
		@DateTimeFormat, 
		@ReturnArchive, 
		@PendingReturnArchive, 
		@IsActive, 
		@UserID, 
		GETUTCDATE(), 
		@UserID, 
		GETUTCDATE(), 
		@ReturnWindow
	  )

  SET @RegionID = SCOPE_IDENTITY()  
   
    UPDATE Country SET RegionID = NULL WHERE RegionID = @RegionID  
    UPDATE Country SET RegionID= @RegionID WHERE CountryID IN(SELECT items FROM [dbo].Split(@CountryIds, ','))  
  SET @ReturnRegionID=@RegionID;  
 END  
 ELSE  
 BEGIN  
	UPDATE 
	  Region 
	SET 
	  RegionCode = @RegionCode, 
	  RegionName = @RegionName, 
	  [Description] = @Description, 
	  ReturnArchive = @ReturnArchive, 
	  PendingReturnArchive = @PendingReturnArchive, 
	  DateTimeFormat = @DateTimeFormat, 
	  IsActive = @IsActive, 
	  ModifyBy = @UserID, 
	  ModifyDate = GETUTCDATE(), 
	  ReturnWindow = @ReturnWindow 
	WHERE 
	  RegionID = @RegionID
  
	UPDATE 
	  Country 
	SET 
	  RegionID = NULL 
	WHERE 
	  RegionID = @RegionID 
	  
	  UPDATE 
		  Country 
		SET 
		  RegionID = @RegionID 
		WHERE 
		  CountryID IN(
			SELECT 
			  items 
			FROM 
			  [dbo].Split(@CountryIds, ',')
		  )

  
  SET @ReturnRegionID=@RegionID;  
 END   
  ---- praveen Yadav-------------
  	IF NOT EXISTS(SELECT 1 FROM [dbo].[RegionConfigMap] WHERE RegionID = @RegionID)
		BEGIN
			INSERT INTO [dbo].[RegionConfigMap]
				   (RegionID
				   ,[TypeLookupID]
				   ,[ConfigGroup]
				   ,[Description]
				   ,[CreatedBy]
				   ,[CreatedDate]
				   ,[ModifyBy]
				   ,[ModifyDate])
				SELECT  @RegionID,
				JSON_VALUE(VALUE, '$.TypeLookUpID'),
				JSON_VALUE(VALUE, '$.TypeGroup'), 
				JSON_VALUE(VALUE, '$.AttributeValue') ,
				@UserID, 
				GETUTCDATE(), 
				@UserID, 
				GETUTCDATE()
				FROM OPENJSON(@Region, '$.Gateways') 
		END
		ELSE
		BEGIN

			UPDATE [dbo].[RegionConfigMap]
			set  [Description]=JSON_VALUE(VALUE, '$.AttributeValue')
			from  [dbo].[RegionConfigMap] inner join OPENJSON(@Region, '$.Gateways') Gateways
			on [dbo].[RegionConfigMap].[TypeLookupID]=JSON_VALUE(VALUE, '$.TypeLookUpID')

		END

		  ---- praveen Yadav-------------

-- EXEC [dbo].[usp_AccountRegion_Post] @Region, @RegionID ,@UserID  

  
 COMMIT;  
END TRY  
BEGIN CATCH  
--INSERT INTO ErrorLog (Error_Msg,Error_Details,Request) VALUES(@@ERROR,@UserID,@LanguageID) 
ROLLBACK;  
THROW;  
END CATCH  