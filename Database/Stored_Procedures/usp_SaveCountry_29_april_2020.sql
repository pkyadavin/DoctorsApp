/****** Object:  StoredProcedure [dbo].[usp_SaveCountry]    Script Date: 30-04-2020 09:15:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[usp_SaveCountry]
(@userID INT,
@JsonData NVARCHAR(MAX),
@result  NVARCHAR(MAX) OUTPUT)
AS
BEGIN
    UPDATE Country SET
        CountryCode = JSON_VALUE(@JsonData, '$.CountryCode'),
        CountryName = JSON_VALUE(@JsonData, '$.CountryName'),
        ReturnWindow = JSON_VALUE(@JsonData, '$.ReturnWindow'),
        HomePage = JSON_VALUE(@JsonData, '$.HomePage'),
        ReturnPolicy = JSON_VALUE(@JsonData, '$.ReturnPolicy'),
        ContactPage = JSON_VALUE(@JsonData, '$.ContactPage'),
        IsActive = JSON_VALUE(@JsonData, '$.IsActive')
    WHERE CountryID = JSON_VALUE(@JsonData, '$.CountryID');

declare @CountryID int ;
set @CountryID=JSON_VALUE(@JsonData, '$.CountryID');
	
  ---- praveen Yadav-------------
  	IF NOT EXISTS(SELECT 1 FROM [dbo].[CountryConfigMap] WHERE CountryID = @CountryID)
		BEGIN
			INSERT INTO [dbo].[CountryConfigMap]
				   (CountryID
				   ,[TypeLookupID]
				   ,[ConfigGroup]
				   ,[Description]
				   ,[CreatedBy]
				   ,[CreatedDate]
				   ,[ModifyBy]
				   ,[ModifyDate])
				SELECT   @CountryID,
				JSON_VALUE(VALUE, '$.TypeLookUpID'),
				JSON_VALUE(VALUE, '$.TypeGroup'), 
				JSON_VALUE(VALUE, '$.AttributeValue') ,
				@UserID, 
				GETUTCDATE(), 
				@UserID, 
				GETUTCDATE()
				FROM OPENJSON(@JsonData, '$.Gateways') 
		END
		ELSE
		BEGIN

			UPDATE [dbo].[CountryConfigMap]
			set  [Description]=JSON_VALUE(VALUE, '$.AttributeValue')
			from  [dbo].[CountryConfigMap] inner join OPENJSON(@JsonData, '$.Gateways') Gateways
			on [dbo].[CountryConfigMap].[TypeLookupID]=JSON_VALUE(VALUE, '$.TypeLookUpID')

		END

		  ---- praveen Yadav-------------

    SET @result = 'Updated'
END
