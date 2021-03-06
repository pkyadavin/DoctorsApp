/****** Object:  UserDefinedFunction [dbo].[ConvertCurrencyByPartnerID]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 CREATE FUNCTION [dbo].[ConvertCurrencyByPartnerID] (
    @PartnerId Bigint ,
	@Price float

) RETURNS float

AS 
BEGIN
select @Price=@Price* isnull(DollarExchangeRate,1) from Partners
INNER JOIN
Region
ON
Partners.RegionID=Region.RegionID
INNER JOIN
Currency
ON
Currency.CurrencyID=Region.CurrencyID
And Partners.PartnerID=@PartnerId
return @price
END

GO
/****** Object:  UserDefinedFunction [dbo].[Currency_ToWords]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 CREATE FUNCTION [dbo].[Currency_ToWords] (
    @Input Numeric (38) -- Input number with as many as 18 digits

) RETURNS VARCHAR(8000) 

AS BEGIN
Declare @Number Numeric(38,0)
set @Number = ROUND(@Input,0)
Declare @Cents as int
set @Cents = 100*Convert(money,(@Input - convert(Numeric(38,3),@Number)))
DECLARE @inputNumber VARCHAR(38)
DECLARE @NumbersTable TABLE (number CHAR(2), word VARCHAR(10))
DECLARE @outputString VARCHAR(8000)
DECLARE @length INT
DECLARE @counter INT
DECLARE @loops INT
DECLARE @position INT
DECLARE @chunk CHAR(3) -- for chunks of 3 numbers
DECLARE @tensones CHAR(2)
DECLARE @hundreds CHAR(1)
DECLARE @tens CHAR(1)
DECLARE @ones CHAR(1)

IF @Number = 0 Return 'Zero'

-- initialize the variables
SELECT @inputNumber = CONVERT(varchar(38), @Number)
     , @outputString = ''
     , @counter = 1
SELECT @length   = LEN(@inputNumber)
     , @position = LEN(@inputNumber) - 2
     , @loops    = LEN(@inputNumber)/3

-- make sure there is an extra loop added for the remaining numbers
IF LEN(@inputNumber) % 3 <> 0 SET @loops = @loops + 1

-- insert data for the numbers and words
INSERT INTO @NumbersTable   SELECT '00', ''
    UNION ALL SELECT '01', 'one'      UNION ALL SELECT '02', 'two'
    UNION ALL SELECT '03', 'three'    UNION ALL SELECT '04', 'four'
    UNION ALL SELECT '05', 'five'     UNION ALL SELECT '06', 'six'
    UNION ALL SELECT '07', 'seven'    UNION ALL SELECT '08', 'eight'
    UNION ALL SELECT '09', 'nine'     UNION ALL SELECT '10', 'ten'
    UNION ALL SELECT '11', 'eleven'   UNION ALL SELECT '12', 'twelve'
    UNION ALL SELECT '13', 'thirteen' UNION ALL SELECT '14', 'fourteen'
    UNION ALL SELECT '15', 'fifteen'  UNION ALL SELECT '16', 'sixteen'
    UNION ALL SELECT '17', 'seventeen' UNION ALL SELECT '18', 'eighteen'
    UNION ALL SELECT '19', 'nineteen' UNION ALL SELECT '20', 'twenty'
    UNION ALL SELECT '30', 'thirty'   UNION ALL SELECT '40', 'forty'
    UNION ALL SELECT '50', 'fifty'    UNION ALL SELECT '60', 'sixty'
    UNION ALL SELECT '70', 'seventy'  UNION ALL SELECT '80', 'eighty'
    UNION ALL SELECT '90', 'ninety'   

WHILE @counter <= @loops BEGIN

    -- get chunks of 3 numbers at a time, padded with leading zeros
    SET @chunk = RIGHT('000' + SUBSTRING(@inputNumber, @position, 3), 3)

    IF @chunk <> '000' BEGIN
        SELECT @tensones = SUBSTRING(@chunk, 2, 2)
             , @hundreds = SUBSTRING(@chunk, 1, 1)
             , @tens = SUBSTRING(@chunk, 2, 1)
             , @ones = SUBSTRING(@chunk, 3, 1)

        -- If twenty or less, use the word directly from @NumbersTable
        IF CONVERT(INT, @tensones) <= 20 OR @Ones='0' BEGIN
            SET @outputString = (SELECT word 
                                      FROM @NumbersTable 
                                      WHERE @tensones = number)
                   + CASE @counter WHEN 1 THEN '' -- No name
                       WHEN 2 THEN ' thousand ' WHEN 3 THEN ' million '
                       WHEN 4 THEN ' billion '  WHEN 5 THEN ' trillion '
                       WHEN 6 THEN ' quadrillion ' WHEN 7 THEN ' quintillion '
                       WHEN 8 THEN ' sextillion '  WHEN 9 THEN ' septillion '
                       WHEN 10 THEN ' octillion '  WHEN 11 THEN ' nonillion '
                       WHEN 12 THEN ' decillion '  WHEN 13 THEN ' undecillion '
                       ELSE '' END
                               + @outputString
            END
         ELSE BEGIN -- break down the ones and the tens separately

             SET @outputString = ' ' 
                            + (SELECT word 
                                    FROM @NumbersTable 
                                    WHERE @tens + '0' = number)
                             + '-'
                             + (SELECT word 
                                    FROM @NumbersTable 
                                    WHERE '0'+ @ones = number)
                   + CASE @counter WHEN 1 THEN '' -- No name
                       WHEN 2 THEN ' thousand ' WHEN 3 THEN ' million '
                       WHEN 4 THEN ' billion '  WHEN 5 THEN ' trillion '
                       WHEN 6 THEN ' quadrillion ' WHEN 7 THEN ' quintillion '
                       WHEN 8 THEN ' sextillion '  WHEN 9 THEN ' septillion '
                       WHEN 10 THEN ' octillion '  WHEN 11 THEN ' nonillion '
                       WHEN 12 THEN ' decillion '   WHEN 13 THEN ' undecillion '
                       ELSE '' END
                            + @outputString
        END

        -- now get the hundreds
        IF @hundreds <> '0' BEGIN
            SET @outputString  = (SELECT word 
                                      FROM @NumbersTable 
                                      WHERE '0' + @hundreds = number)
                                + ' hundred ' 
                                + @outputString
        END
    END

    SELECT @counter = @counter + 1
         , @position = @position - 3

END

-- Remove any double spaces
SET @outputString = LTRIM(RTRIM(REPLACE(@outputString, '  ', ' ')))
SET @outputstring = UPPER(LEFT(@outputstring, 1)) + SUBSTRING(@outputstring, 2, 8000)

RETURN UPPER(@outputString)   -- return the result
END

--select [dbo].Currency_ToWords(453.4)

GO
/****** Object:  UserDefinedFunction [dbo].[EvaluateExpression]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 CREATE FUNCTION [dbo].[EvaluateExpression](@list nvarchar(MAX))

RETURNS Decimal(10,2)
AS

BEGIN
Declare @Result Decimal(10,2)
set @Result=1
 DECLARE @pos        int,
       @nextpos    int,
       @valuelen   int

SELECT @pos = 0, @nextpos = 1


WHILE @nextpos > 0
  BEGIN
     SELECT @nextpos = charindex('*', @list, @pos + 1)
     SELECT @valuelen = CASE WHEN @nextpos > 0
                             THEN @nextpos
                             ELSE len(@list) + 1
                        END - @pos - 1

                        Set @Result=@Result*convert(decimal(10,2),substring(@list, @pos + 1, @valuelen))


     SELECT @pos = @nextpos
  END

RETURN @Result
END

GO
/****** Object:  UserDefinedFunction [dbo].[fn_brand_carrier_active]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE FUNCTION [dbo].[fn_brand_carrier_active](@brandJson NVARCHAR(max), @brandID INT) 
RETURNS nvarchar(MAX)
AS
BEGIN 	
	DECLARE @correctJSON NVARCHAR(max)
	IF EXISTS( (SELECT PartnerID FROM OPENJSON(@brandJson,'$')  WITH (PartnerID INT '$.PartnerID')
	WHERE PartnerID = @brandID))
	BEGIN
		SET @correctJSON = @brandJson;
	END
    ELSE
	BEGIN
		 SET @correctJSON ='';
	END

RETURN  @correctJSON

End

GO
/****** Object:  UserDefinedFunction [dbo].[fn_brandExists]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [dbo].[fn_brandExists](@Brands NVARCHAR(max), @brand_code NVARCHAR(200))
RETURNS BIT
AS
BEGIN 
	DECLARE  @retValue BIT ,@PartnerID int
	SELECT @PartnerID = PartnerID FROM Partners WHERE PartnerCode = @brand_code
	--IF(ISJSON(@Brands)=0)
	--BEGIN
		IF EXISTS(SELECT 1 FROM OPENJSON(@Brands) WHERE JSON_VALUE(VALUE, '$.PartnerID') = @PartnerID)
		BEGIN
			SET @retValue = 1
		END
		ELSE
		BEGIN
			SET @retValue = 0
		END
	--END
	--ELSE
	--	BEGIN
	--		SET @retValue = 0
	--	END
	RETURN @retValue
END 

GO
/****** Object:  UserDefinedFunction [dbo].[fn_CheckCPReturnProcessFromAPIOrRL]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 CREATE Function [dbo].[fn_CheckCPReturnProcessFromAPIOrRL]()   
  
returns int
  
as   
  
Begin  
declare @ReturnData as int
  

  

set @ReturnData=(Select      
CTV.ModuleControlTypeValueID
  from Module M       
  Inner Join  ModuleConfig MC       
  on M.ModuleID = MC.ModuleID      
inner join ModuleControlType CT on      
MC.ModuleControlTypeID=CT.ModuleControlTypeID       
Left join ModuleControlTypeValue CTV on CT.ModuleControlTypeID=CTV.ModuleControlTypeID       
Left join (Select * from ModuleActionConfigValue where ModuleActionConfigValueID in (Select Max(ModuleActionConfigValueID) from ModuleActionConfigValue group by ModuleConfigID)) MCV   
on MCV.ModuleConfigID=MC.ModuleConfigID and MCV.ModuleControlTypeValueID = CTV.ModuleControlTypeValueID  
Left join (Select * from ModuleActionConfigValue where ModuleActionConfigValueID in (Select Max(ModuleActionConfigValueID) from ModuleActionConfigValue group by ModuleConfigID)) MCV1   
on MCV1.ModuleConfigID=MC.ModuleConfigID   
Where M.ModuleID = 1283  and Mc.Code='SROCP002' and MCV.ModuleControlTypeValue='true'
--and CTV.Value like '%API%'
and ParentModuleConfigID is  null and MC.IsActive = 1  )
  
return @ReturnData 
  
End

GO
/****** Object:  UserDefinedFunction [dbo].[fn_CheckCPReturnProcessIsApprovalRequired]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 CREATE FUNCTION [dbo].[fn_CheckCPReturnProcessIsApprovalRequired](@SalesReturnOrderDetailID int)   
  
returns int
  
as   
  
Begin  
declare @ReturnData as int 
declare @ApprovalCount as int  

--set @ReturnData=(SELECT count(SalesReturnOrderDetail.SalesReturnOrderDetailID )
--FROM SalesReturnOrderHeader INNER JOIN SalesReturnOrderDetail ON SalesReturnOrderDetail.SalesReturnOrderHeaderID = SalesReturnOrderHeader.SalesReturnOrderHeaderID
--INNER JOIN ModuleWorkflow ON ModuleWorkflow.ModuleWorkflowID = SalesReturnOrderDetail.ModuleWorkflowID
--INNER JOIN ModuleWorkFlowDetail ON ModuleWorkFlowDetail.ModuleWorkFlowID = ModuleWorkFlow.ModuleWorkFlowID
--INNER JOIN ModuleStatusMap ON ModuleStatusMap.ModuleStatusMapID = ModuleWorkFlowDetail.NextModuleStatusMapID
--INNER JOIN Statuses ON Statuses.StatusID = ModuleStatusMap.StatusID AND Statuses.StatusCode = 'SOR62'
--WHERE SalesReturnOrderDetailID = @SalesReturnOrderDetailID)

SET @ApprovalCount = (Select count(SalesReturnOrderDetailID) From SalesReturnAction Where SalesReturnOrderDetailID = @SalesReturnOrderDetailID)
IF @ApprovalCount = 0
BEGIN
	SET @ReturnData = 1
END
ELSE
BEGIN
	SET @ReturnData = 0
END
  
return @ReturnData 
  
End

GO
/****** Object:  UserDefinedFunction [dbo].[fn_CheckIsItemReturned]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 CREATE Function [dbo].[fn_CheckIsItemReturned]( @ItemNumber nvarchar(100))   
  
returns varchar(10) 
  
as   
  
Begin  
declare @ReturnDate as varchar(max)    
  

  

set @ReturnDate=(select (case when (select count(ItemInfoID) from SalesReturnOrderDetail
SROD inner join SalesReturnOrderHeader SROH on SROD.SalesReturnOrderHeaderID=SROH.SalesReturnOrderHeaderID where
SROH.RMASource='Customer' and ItemInfoID in 
  (select II.ItemInfoID from ItemMaster IM inner join ItemInfo II on IM.ItemMasterID=II.ItemMasterID
  where IM.ItemNumber=@ItemNumber))>0 then '1' else '0' end))
  
return @ReturnDate 
  
End

GO
/****** Object:  UserDefinedFunction [dbo].[fn_CheckIsItemTrackable]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 CREATE Function [dbo].[fn_CheckIsItemTrackable]( @ItemNumber nvarchar(100))   
  
returns varchar(10) 
  
as   
  
Begin  
declare @ReturnDate as varchar(max)    
  

  

set @ReturnDate=(select (case when (select count(SROD.SalesReturnOrderDetailID) from 
SalesReturnOrderDetail SROD inner join
SalesReturnOrderHeader SROH on SROD.SalesReturnOrderHeaderID=SROH.SalesReturnOrderHeaderID  where  SROH.RMASource='Customer'
and ItemInfoID in 
  (select II.ItemInfoID from ItemMaster IM inner join ItemInfo II on IM.ItemMasterID=II.ItemMasterID
  where IM.ItemNumber=@ItemNumber) and ShippingNumber is not null)>0 then '1' else '0' end))
  
return @ReturnDate 
  
End

GO
/****** Object:  UserDefinedFunction [dbo].[fn_CheckItemStatusForCP]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 CREATE Function [dbo].[fn_CheckItemStatusForCP]( @ItemNumber nvarchar(100) , @SONumber nvarchar(400))   
  
returns varchar(100) 
  
as   
  
Begin  
declare @ReturnDate as varchar(100) 
  

set @ReturnDate=(select top 1 ss.StatusName from salesreturnorderdetail s 
				inner join modulestatusmap mm on s.modulestatusmapid=mm.modulestatusmapid
				inner join statuses ss on mm.StatusID=ss.StatusID
				where s.salesreturnorderdetailid in( 
					select SROD.SalesReturnOrderDetailID from SalesReturnOrderDetail SROD 
					inner join SalesReturnOrderHeader SROH on SROD.SalesReturnOrderHeaderID=SROH.SalesReturnOrderHeaderID 
					where SROH.RMASource='Customer' AND SROD.SOHeaderID = (SELECT SOHeaderID FROM SOHeader WHERE SONumber= 'INV-1511004-1')
					and ItemInfoID in 
					(select II.ItemInfoID from ItemMaster IM inner join ItemInfo II on IM.ItemMasterID=II.ItemMasterID
					where IM.ItemNumber=@ItemNumber) ))
  
return @ReturnDate 
  
End

GO
/****** Object:  UserDefinedFunction [dbo].[fn_CheckRMAAttachedDocument]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 CREATE FUNCTION [dbo].[fn_CheckRMAAttachedDocument](@PartnerID INT, @RMAActionCodeID INT, @ItemModelID INT, @ReturnReasonType NVARCHAR(50))
RETURNS INT
AS 

BEGIN 
DECLARE @Count INT
IF @ReturnReasonType ='Account'
BEGIN
	SELECT @Count = COUNT(*) FROM PartnerReturnReasonRuleMap 
	WHERE IsActive=1 AND UserInput=1 AND PartnerReturnReasonMapID = (SELECT PartnerReturnReasonMapID FROM PartnerReturnReasonMap 
																	WHERE PartnerID=(SELECT PartnerParentID FROM Partners WHERE PartnerID=@PartnerID) 
																	AND RMAActionCodeID = @RMAActionCodeID)
END
ELSE
BEGIN
	SELECT @Count = COUNT(*) FROM ItemModelReturnReasonRuleMap WHERE IsActive=1 AND UserInput=1 
																AND ItemModelReturnReasonMapID = (SELECT ItemModelReturnReasonMapID FROM ItemModelReturnReasonMap 
																WHERE ItemModelID=@ItemModelID AND RMAActionCodeID = @RMAActionCodeID)
END

RETURN @Count 
END

GO
/****** Object:  UserDefinedFunction [dbo].[fn_diagramobjects]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

	CREATE FUNCTION [dbo].[fn_diagramobjects]() 
	RETURNS int
	WITH EXECUTE AS N'dbo'
	AS
	BEGIN
		declare @id_upgraddiagrams		int
		declare @id_sysdiagrams			int
		declare @id_helpdiagrams		int
		declare @id_helpdiagramdefinition	int
		declare @id_creatediagram	int
		declare @id_renamediagram	int
		declare @id_alterdiagram 	int 
		declare @id_dropdiagram		int
		declare @InstalledObjects	int

		select @InstalledObjects = 0

		select 	@id_upgraddiagrams = object_id(N'dbo.sp_upgraddiagrams'),
			@id_sysdiagrams = object_id(N'dbo.sysdiagrams'),
			@id_helpdiagrams = object_id(N'dbo.sp_helpdiagrams'),
			@id_helpdiagramdefinition = object_id(N'dbo.sp_helpdiagramdefinition'),
			@id_creatediagram = object_id(N'dbo.sp_creatediagram'),
			@id_renamediagram = object_id(N'dbo.sp_renamediagram'),
			@id_alterdiagram = object_id(N'dbo.sp_alterdiagram'), 
			@id_dropdiagram = object_id(N'dbo.sp_dropdiagram')

		if @id_upgraddiagrams is not null
			select @InstalledObjects = @InstalledObjects + 1
		if @id_sysdiagrams is not null
			select @InstalledObjects = @InstalledObjects + 2
		if @id_helpdiagrams is not null
			select @InstalledObjects = @InstalledObjects + 4
		if @id_helpdiagramdefinition is not null
			select @InstalledObjects = @InstalledObjects + 8
		if @id_creatediagram is not null
			select @InstalledObjects = @InstalledObjects + 16
		if @id_renamediagram is not null
			select @InstalledObjects = @InstalledObjects + 32
		if @id_alterdiagram  is not null
			select @InstalledObjects = @InstalledObjects + 64
		if @id_dropdiagram is not null
			select @InstalledObjects = @InstalledObjects + 128
		
		return @InstalledObjects 
	END
	

GO
/****** Object:  UserDefinedFunction [dbo].[fn_eanExists]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [dbo].[fn_eanExists](@order_number NVARCHAR(200), @ean NVARCHAR(200))
RETURNS BIT
AS
BEGIN 
	DECLARE @items NVARCHAR(MAX), @retValue BIT = 0
	SELECT @items = JSON_QUERY(items) FROM inbound_log WHERE order_number = @order_number
	IF EXISTS(SELECT 1 FROM OPENJSON(@items) WHERE JSON_VALUE(VALUE, '$.ean') = @ean OR JSON_VALUE(VALUE, '$.EAN') = @ean)
	BEGIN
		SET @retValue = 1
	END
	ELSE
	BEGIN
		SET @retValue = 0
	END
	RETURN @retValue
END 

GO
/****** Object:  UserDefinedFunction [dbo].[fn_GetAccessory]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 CREATE Function [dbo].[fn_GetAccessory](@value NVARCHAR(500)) 
RETURNS NVARCHAR(1000)
AS  
BEGIN  
DECLARE @AccessoryList NVARCHAR(1000) = ''
--SELECT @AccessoryList = COALESCE(@AccessoryList + ', ', '') + ModelName FROM ItemModel Where ItemModelID IN(SELECT AccessoryID FROM ItemModelAccessoryMap 
--																				WHERE ItemModelAccessoryMapid IN (SELECT items FROM dbo.Split(@value,',')))

SELECT @AccessoryList = COALESCE(@AccessoryList + ', ', '') + ModelName FROM ItemModel Where ItemModelID IN(SELECT items FROM dbo.Split(@value,','))
  
  
RETURN @AccessoryList 
  
END

GO
/****** Object:  UserDefinedFunction [dbo].[fn_GetApprovalRole]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 CREATE FUNCTION [dbo].[fn_GetApprovalRole](@ReturnReasonID INT, @PartnerID INT, @ReturnReasonType NVARCHAR(50), @ItemInfoID INT)
RETURNS @Role TABLE (
   RuleValue NVARCHAR(400)
) 
AS
BEGIN
	IF @ReturnReasonType = 'Account'
	BEGIN
		INSERT INTO @Role
		SELECT PRRM.RuleValue 
		FROM PartnerReturnReasonMap PRR LEFT OUTER JOIN PartnerReturnReasonRuleMap PRRM
		ON PRR.PartnerReturnReasonMapID = PRRM.PartnerReturnReasonMapID
		LEFT OUTER JOIN ReturnReasonRuleMap RRRM ON PRRM.ReturnReasonRuleMapID = RRRM.ReturnReasonRuleMapID
		LEFT OUTER JOIN TypeLookUp T ON RRRM.RuleControlTypeID = T.TypeLookUpID
		WHERE PRR.RMAActionCodeID= @ReturnReasonID AND PartnerID = @PartnerID AND TypeCode='RCT006'
		ORDER BY PartnerReturnReasonRuleMapID
	END
	ELSE
	BEGIN
		DECLARE @ItemModelID AS INT = (SELECT IM.ItemModelID FROM ItemInfo II LEFT OUTER JOIN ItemMaster IM
										ON II.ItemMasterID = IM.ItemMasterID
										WHERE ItemInfoID= @ItemInfoID)
		INSERT INTO @Role
		SELECT PRRM.RuleValue 
		FROM ItemModelReturnReasonMap PRR LEFT OUTER JOIN ItemModelReturnReasonRuleMap PRRM
		ON PRR.ItemModelReturnReasonMapID = PRRM.ItemModelReturnReasonMapID
		LEFT OUTER JOIN ReturnReasonRuleMap RRRM ON PRRM.ReturnReasonRuleMapID = RRRM.ReturnReasonRuleMapID
		LEFT OUTER JOIN TypeLookUp T ON RRRM.RuleControlTypeID = T.TypeLookUpID
		WHERE PRR.RMAActionCodeID= @ReturnReasonID AND ItemModelID = @ItemModelID AND TypeCode='RCT006'
		ORDER BY ItemModelReturnReasonRuleMapID
	END
  
   RETURN;
END;

GO
/****** Object:  UserDefinedFunction [dbo].[fn_GetCloseRMA]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 CREATE FUNCTION [dbo].[fn_GetCloseRMA](@SalesReturnOrderNumber VARCHAR(100), @FromAccountID INT, @ToPartnerID INT)
RETURNS @RMANumber TABLE (
   SalesReturnOrderNumber VARCHAR(100)   
) 
AS
BEGIN
   INSERT INTO @RMANumber
   SELECT DISTINCT SalesReturnOrderHeader.SalesReturnOrderNumber
	FROM SalesReturnOrderHeader 
	INNER JOIN SalesReturnOrderDetail
	ON SalesReturnOrderDetail.SalesReturnOrderHeaderID = SalesReturnOrderHeader.SalesReturnOrderHeaderID
	--INNER JOIN SOHeader
	--ON SOHeader.SOHeaderID = SalesReturnOrderDetail.SOHeaderID	
	INNER JOIN ModuleStatusMap ON ModuleStatusMap.ModuleStatusMapID=SalesReturnOrderDetail.ModuleStatusMapID
	INNER JOIN Statuses ON ModuleStatusMap.StatusID=Statuses.StatusID
	WHERE (SalesReturnOrderHeader.FromAccountID = @FromAccountID or SalesReturnOrderHeader.ToPartnerID = @ToPartnerID )
	AND StatusName = 'Close'
  
   RETURN;
END;

GO
/****** Object:  UserDefinedFunction [dbo].[fn_GetContainerHeader]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 CREATE FUNCTION [dbo].[fn_GetContainerHeader]
(
	@Container NVARCHAR(100)     
)
RETURNS NVARCHAR(MAX)
AS
BEGIN
RETURN
(
	SELECT M.RefrenceNumber, IBCH.PartnerID, IBCH.ModuleWorkFlowDetailID
	FROM InBoundItemContextHistory IBCH INNER JOIN MRNHeader M
	ON IBCH.MRNHeaderID = M.MRNHeaderID
	WHERE Container= @Container
	FOR JSON PATH 	
);
END

GO
/****** Object:  UserDefinedFunction [dbo].[fn_GetContainerItems]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 CREATE FUNCTION [dbo].[fn_GetContainerItems]
(	
    @Container NVARCHAR(100) 
)
RETURNS NVARCHAR(MAX)
AS
BEGIN
RETURN
(
	SELECT InBoundItemContextHistoryID AS Id,
	CASE WHEN im.ItemReceiveTypeID = 76 THEN iinfo.SerialNumber ELSE '' END AS SerialNumber,
	CASE WHEN im.ItemReceiveTypeID = 75 THEN im.ItemNumber ELSE '' END AS ItemNumber,  
	lines.ItemMasterID,im.ItemName as 'ItemDescription',
	MRNHeader.RefrenceNumber AS 'ReferenceNumber',
	lines.Quantity as 'Quantity',loc.LocationName AS 'Location',lines.NodeID, node.Node AS 'SubInventory',Container AS 'ContainerNumber' ,
	CASE WHEN ISNULL(lines.ItemDamagedType,'') = '' THEN tl.TypeName ELSE lines.ItemDamagedType END AS 'ItemConditions', 
	dtl.TypeName as 'Discrepancy', lines.Discrepancy AS 'DiscrepancyID',
	lines.DiscrepancyQuantity AS 'DiscrepancyQuantity',
	CASE WHEN lines.Discrepancy IS NOT NULL THEN lines.DiscrepancyRemark ELSE NULL END DiscrepancyRemark,
	RefHeaderID,s.StatusName AS StatusName,s.StatusCode AS StatusCode,ModuleWorkFlowDetailID,lines.ItemStatusID,
	CASE WHEN [dbo].[fn_GetSerialisedRL](IM.ItemNumber) =1 THEN iinfo.SerialNumber ELSE CAST(srod.Quantity AS NVARCHAR(100))
	END AS SerialQuantity,
	Shipments.AWBNumber AS ShippingNumber,
	imo.ModelName, imo.ItemModelID, 
	RR.RMAActionName AS ReturnReason,srod.ReturnReasonID,
	sroh.ReturnReasonType as ReturnReasonType,
	sroh.FromAccountID, srod.SalesReturnOrderDetailID, lines.Remarks,lines.Accessories AS AccessoriesID,
	[dbo].[fn_GetAccessory](lines.Accessories) AS 'AccessoriesName',
	lines.PackageNumber, lines.PartnerLocationID AS 'LocationID', 
	CASE WHEN lines.InBoundItemContextHistoryID in (SELECT MAX(InBoundItemContextHistoryID) FROM InBoundItemContextHistory WHERE Container= @Container GROUP BY LineID,RefDetailID) THEN 1 ELSE 0 END AS 'LastReceive',
	CASE WHEN Shipments.CarrierID = 0 THEN Shipments.OtherCarrier ELSE Carrier.TypeName END AS CarrierName,
	[dbo].[fn_CheckRMAAttachedDocument](sroh.FromAccountID,srod.ReturnReasonID,imo.ItemModelID,sroh.ReturnReasonType) AS AttachedDocument,
	lines.LineID, lines.ItemDamagedType,
	MRNHeader.MRNHeaderID, MRNHeader.ModuleWorkFlowID, MRNHeader.MRNNumber,MRNHeader.MRNTypeID,
	sroh.SalesReturnOrderNumber, 
	CASE WHEN lines.IsContainerClosed =1 THEN 'Closed' ELSE 'Open' END AS ContainerStatus,
	MRNHeader.ToPartnerID, lines.ItemInfoID
	FROM InBoundItemContextHistory lines
	INNER JOIN MRNHeader ON MRNHeader.MRNHeaderID = lines.MRNHeaderID
	INNER JOIN iteminfo iinfo ON iinfo.ItemInfoID=lines.ItemInfoID
	INNER JOIN ItemMaster im ON im.ItemMasterID=iinfo.ItemMasterID
	INNER JOIN ItemModel imo ON im.ItemModelID = imo.ItemModelID
	LEFT JOIN PartnerLocation loc ON loc.PartnerLocationID=lines.PartnerLocationID
	LEFT JOIN Node ON node.NodeID=lines.NodeID
	LEFT JOIN TypeLookUp tl ON tl.TypeLookUpID=lines.ItemStatusID
	LEFT JOIN TypeLookUp dtl ON dtl.TypeLookUpID=lines.Discrepancy
	LEFT JOIN ModuleStatusMap smap ON smap.ModuleStatusMapID=lines.ModuleStatusMapID
	LEFT JOIN Statuses s ON s.StatusID=smap.StatusID
	LEFT OUTER JOIN SalesReturnOrderHeader sroh ON lines.RefHeaderID = sroh.SalesReturnOrderHeaderID
	LEFT OUTER JOIN SalesReturnOrderDetail srod ON lines.RefDetailID = srod.SalesReturnOrderDetailID
	LEFT OUTER JOIN RMAActionCode RR ON srod.ReturnReasonID = RR.RMAActionCodeID
	LEFT OUTER JOIN Shipments ON Shipments.AWBNumber = MRNHeader.RefrenceNumber
	LEFT OUTER JOIN TypeLookUp Carrier ON Carrier.TypeLookUpID = Shipments.CarrierID
	WHERE lines.InBoundItemContextHistoryID in (SELECT MAX(InBoundItemContextHistoryID) FROM InBoundItemContextHistory WHERE Container= @Container GROUP BY LineID,RefDetailID)
	AND lines.IsContainerClosed =1 
	AND s.StatusCode <> 'ST023' 
	AND lines.Container = @Container
	AND lines.Discrepancy IS NULL
	FOR JSON PATH 
);
END

GO
/****** Object:  UserDefinedFunction [dbo].[fn_GetContainerWorkflow]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 CREATE FUNCTION [dbo].[fn_GetContainerWorkflow]
(
	@WorkflowID INT     
)
RETURNS NVARCHAR(MAX)
AS
BEGIN
RETURN
(
	select wfd.ModuleWorkFlowDetailID,ac.ActionName,ac.ActionCode,cst.StatusName CurrentStatusName,
cst.StatusCode CurrentStatusCode,cmsm.ModuleStatusMapID CurrentStatusID,
nst.StatusName NextStatusName,nst.StatusCode NextStatusCode,nmsm.ModuleStatusMapID  NextStatusID
from ModuleWorkFlowDetail wfd
inner join ModuleActionMap mam on wfd.ModuleActionMapID=mam.ModuleActionMapID
inner join [Actions] ac on mam.ActionID=ac.ActionID
inner join ModuleStatusMap cmsm on wfd.CurrentModuleStatusMapID=cmsm.ModuleStatusMapID
inner join [Statuses] cst on cmsm.StatusID=cst.StatusID
inner join ModuleStatusMap nmsm on wfd.NextModuleStatusMapID=nmsm.ModuleStatusMapID
inner join [Statuses] nst on nmsm.StatusID=nst.StatusID
where ModuleWorkFlowID=@WorkflowID AND ac.ActionCode = 'TSK008' FOR JSON PATH 
	
);
END

GO
/****** Object:  UserDefinedFunction [dbo].[fn_GetCreatedByStatus]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 CREATE Function [dbo].[fn_GetCreatedByStatus](@MRNHeaderID INT, @RefDetailID INT, @StatusCode NVARCHAR(20)) 
RETURNS NVARCHAR(300)
AS   
BEGIN
	DECLARE @CreatedBy NVARCHAR(300)
	SELECT @CreatedBy = U.UserName FROM 
	InBoundItemContextHistory IBCH
	LEFT JOIN ModuleStatusMap smap ON smap.ModuleStatusMapID=IBCH.ModuleStatusMapID
	LEFT JOIN Statuses s ON s.StatusID=smap.StatusID
	LEFT JOIN Users u ON IBCH.CreatedBy = u.UserID
	WHERE IBCH.MRNHeaderID = @MRNHeaderID AND RefDetailID = @RefDetailID AND s.StatusCode = @StatusCode
	
	RETURN ISNULL(@CreatedBy,'')
END

GO
/****** Object:  UserDefinedFunction [dbo].[fn_GetCustomerEmail]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 CREATE Function [dbo].[fn_GetCustomerEmail](@SalesReturnOrderHeaderID INT, @FullName VARCHAR(250)) 
RETURNS NVARCHAR(MAX)
AS   
  
BEGIN  
DECLARE @CustomerLo NVARCHAR(500) = (SELECT ImagePath FROM ConfigSetup WHERE ConfigGroup='OtherSetup' AND Code='B2CPortalIcon')

DECLARE @EmailBody NVARCHAR(MAX) = '<html><head><style>td {font-family: Arial, Helvetica, sans-serif; font-size:14px;}  div {margin-bottom:7px; font-size:12px; font-family: Arial, Helvetica, sans-serif; } </style></head>'
SET @EmailBody += '<body><table style="width:100%"><tr><td><img src="'+@CustomerLo+'" /></td></tr>'
SET @EmailBody += '<tr><td style="height:20px;"></td></tr><tr><td>Dear '+ @FullName +',</td></tr><tr><td style="height:10px;"></td></tr>'
SET @EmailBody += '<tr><td>Your return request has been created successfully with the following items:</td></tr><tr><td style="height:20px;"></td></tr>'
SET @EmailBody += '<tr><td><table>'

DECLARE @lines TABLE
(
	ID INT PRIMARY KEY IDENTITY(1,1),
	SODID INT,
	ItemName NVARCHAR(100),	 
	ModelName NVARCHAR(400),	
	Quantity NVARCHAR(100),
	SONumber NVARCHAR(100),
	ReturnReason NVARCHAR(500),	 
	Status NVARCHAR(100),
	Serialised NVARCHAR(10),
	SerialNumber NVARCHAR(100)
)

INSERT INTO @lines
SELECT SalesReturnOrderDetail.SalesReturnOrderDetailID	
, ItemMaster.ItemName
, ItemModel.ModelName
, SalesReturnOrderDetail.Quantity
, SOHeader.SONumber	
, RMAActionCode.RMAActionName AS ReturnReason
, Statuses.StatusName
, [dbo].[fn_GetSerialisedRL](ItemMaster.ItemNumber) AS Serialised
, iteminfo.SerialNumber
			
FROM SalesReturnOrderHeader INNER JOIN SalesReturnOrderDetail
ON SalesReturnOrderDetail.SalesReturnOrderHeaderID = SalesReturnOrderHeader.SalesReturnOrderHeaderID
INNER JOIN SOHeader	ON SOHeader.SOHeaderID = SalesReturnOrderDetail.SOHeaderID
INNER JOIN iteminfo ON [iteminfo].ItemInfoID = SalesReturnOrderDetail.ItemInfoID
INNER JOIN ItemMaster ON ItemMaster.ItemMasterID = [iteminfo].ItemMasterID
INNER JOIN ModuleStatusMap ON ModuleStatusMap.ModuleStatusMapID=SalesReturnOrderDetail.ModuleStatusMapID
INNER JOIN Statuses ON ModuleStatusMap.StatusID=Statuses.StatusID
LEFT OUTER JOIN ItemModel  ON ItemMaster.ItemModelID = ItemModel.ItemModelID
LEFT JOIN RMAActionCode ON RMAActionCode.RMAActionCodeID = SalesReturnOrderDetail.ReturnReasonID			
WHERE SalesReturnOrderHeader.RMASource='Customer' and SOHeader.SOTypeID = 555 
AND SalesReturnOrderHeader.SalesReturnOrderHeaderID =@SalesReturnOrderHeaderID

DECLARE @Item NVARCHAR(MAX) = '<table>'
DECLARE @TotalItems NVARCHAR(MAX)

DECLARE @Id INT
DECLARE Lines_cursor CURSOR FOR  
SELECT Id from @lines

OPEN Lines_cursor   
FETCH NEXT FROM Lines_cursor INTO @Id  

WHILE @@FETCH_STATUS = 0   
BEGIN
	DECLARE @ItemName NVARCHAR(100), @ModelName NVARCHAR(400), @Quantity NVARCHAR(100), @SONumber NVARCHAR(100), @ReturnReason NVARCHAR(500), @Status NVARCHAR(100)
		
	SELECT @ItemName = ItemName, @ModelName = ModelName, 
	@Quantity = CASE WHEN Serialised = '0' THEN  Quantity
	ELSE SerialNumber END, @SONumber = SONumber, @ReturnReason = ReturnReason, @Status = Status
	FROM @Lines line where Id=@Id
	
	SET @EmailBody += '<tr>
	                   <td>
                            <div>
                                <b>'+ @ItemName + '</b>
                            </div>
                            <div>
                                <b>Model:</b>&nbsp;&nbsp;' + @ModelName +'
                            </div>
                            <div>
                                <b>Serial#/Quantity:</b>&nbsp;&nbsp;' + @Quantity +'
                            </div>
                            <div>
                                <b>Return Reason:</b>&nbsp;&nbsp;' + @ReturnReason +'
                            </div>
                            <div>
                                <b>Status:</b>&nbsp;&nbsp;' +@Status +'
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="height:10px;"></td>
                    </tr>'

	FETCH NEXT FROM Lines_cursor INTO @Id  
END

CLOSE Lines_cursor   
DEALLOCATE Lines_cursor

SET @EmailBody += '</table></td></tr>'
SET @EmailBody += '<tr><td><span style="padding-bottom:10px;"><b>Regards,</b></span><br/>ReverseLogix Administrator<BR /><BR />(Please do not reply to this email. It is an unattended mailbox.)</td>'
SET @EmailBody += '</tr></table></body></html>'
  
RETURN @EmailBody 
  
End

GO
/****** Object:  UserDefinedFunction [dbo].[fn_GetCustomerInvoiceSODetailID]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 CREATE FUNCTION [dbo].[fn_GetCustomerInvoiceSODetailID](@SONumber VARCHAR(400) , @ItemNumber VARCHAR(100))
RETURNS INT
AS
BEGIN  
DECLARE @SODetailID AS INT   

SET @SODetailID = (SELECT TOP 1 SODetailID FROM SODetail WHERE SOHeaderID= (SELECT TOP 1 SOHeaderID FROM SOHeader WHERE SONumber= @SONumber) 
					AND ItemMasterID = (SELECT TOP 1 ItemMasterID FROM ItemMaster WHERE ItemNumber = @ItemNumber))

RETURN ISNULL(@SODetailID, 0)

End

GO
/****** Object:  UserDefinedFunction [dbo].[fn_GetDiscrepantRMA]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 CREATE FUNCTION [dbo].[fn_GetDiscrepantRMA](@SalesReturnOrderNumber VARCHAR(100), @FromAccountID INT, @ToPartnerID INT)
RETURNS @RMANumber TABLE (
   SalesReturnOrderNumber VARCHAR(100)   
) 
AS
BEGIN
   INSERT INTO @RMANumber
   SELECT DISTINCT SalesReturnOrderHeader.SalesReturnOrderNumber
	FROM SalesReturnOrderHeader 
	INNER JOIN SalesReturnOrderDetail
	ON SalesReturnOrderDetail.SalesReturnOrderHeaderID = SalesReturnOrderHeader.SalesReturnOrderHeaderID
	--INNER JOIN SOHeader
	--ON SOHeader.SOHeaderID = SalesReturnOrderDetail.SOHeaderID	
	INNER JOIN ModuleStatusMap ON ModuleStatusMap.ModuleStatusMapID=SalesReturnOrderDetail.ModuleStatusMapID
	INNER JOIN Statuses ON ModuleStatusMap.StatusID=Statuses.StatusID
	WHERE (SalesReturnOrderHeader.FromAccountID = @FromAccountID or SalesReturnOrderHeader.ToPartnerID = @ToPartnerID )
	AND StatusName = 'Discrepant'
  
   RETURN;
END;

GO
/****** Object:  UserDefinedFunction [dbo].[fn_GetItemImage]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 CREATE FUNCTION [dbo].[fn_GetItemImage](@ItemNumber VARCHAR(100))
RETURNS VARCHAR(500)
AS 
 
BEGIN 
DECLARE @ItemImage VARCHAR(500)

IF (SELECT [dbo].[fn_CheckCPReturnProcessFromAPIOrRL]())=45
BEGIN
	SET @ItemImage = (SELECT TOP 1 ItemImage FROM DummySOItems WHERE ItemNumber = @ItemNumber)
END
ELSE
BEGIN
	SET @ItemImage = (SELECT ArtifactURL 
						FROM Artifact A 
						LEFT OUTER JOIN ItemArtifactMap M ON A.ArtifactID = M.ArtifactID
						LEFT OUTER JOIN ItemMaster IM ON M.ItemMasterID = IM.ItemMasterID
						WHERE ItemNumber= @ItemNumber and M.IsDefault=1)
END 

RETURN ISNULL(@ItemImage,'//cdn.shopify.com/s/files/1/0095/4332/t/30/assets/no-image.svg?16400096591660091541')
END

GO
/****** Object:  UserDefinedFunction [dbo].[fn_GetItemModelID]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 CREATE FUNCTION [dbo].[fn_GetItemModelID](@ModelName VARCHAR(400))
RETURNS INT
AS
BEGIN  
DECLARE @ItemModelID AS INT   

SET @ItemModelID = (SELECT ItemModelID FROM ItemModel WHERE ModelName = @ModelName)

RETURN @ItemModelID 

End

GO
/****** Object:  UserDefinedFunction [dbo].[fn_GetItemQuantity]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 CREATE FUNCTION [dbo].[fn_GetItemQuantity](@SalesReturnOrderDetailID INT , @ItemNumber VARCHAR(100))
RETURNS INT
AS
BEGIN  
DECLARE @Quantity AS INT   

IF @SalesReturnOrderDetailID <> 0
BEGIN
	SET @Quantity = (SELECT Quantity FROM SalesReturnOrderDetail WHERE SalesReturnOrderDetailID = @SalesReturnOrderDetailID)
END
ELSE
BEGIN
	SET @Quantity = (SELECT Quantity FROM DummySoItems WHERE ItemNumber = @ItemNumber)
END

RETURN @Quantity 

End

GO
/****** Object:  UserDefinedFunction [dbo].[fn_GetItemQuantityRL]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 CREATE FUNCTION [dbo].[fn_GetItemQuantityRL](@SalesReturnOrderDetailID INT , @SODetailID INT)
RETURNS INT
AS
BEGIN  
DECLARE @Quantity AS INT   

IF @SalesReturnOrderDetailID <> 0
BEGIN
	SET @Quantity = (SELECT Quantity FROM SalesReturnOrderDetail WHERE SalesReturnOrderDetailID = @SalesReturnOrderDetailID)
END
ELSE
BEGIN
	SET @Quantity = (SELECT Quantity FROM sodetail WHERE SODetailID = @SODetailID)
END

RETURN @Quantity 

End

GO
/****** Object:  UserDefinedFunction [dbo].[fn_GetItemReturnReasonList]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 CREATE FUNCTION [dbo].[fn_GetItemReturnReasonList](@SOToID INT, @ItemModelID INT) 
RETURNS @RMAAction TABLE (
   RMAActionCodeID INT,
   RMAActionName   NVARCHAR(400)
) 
AS
BEGIN 	
	DECLARE @RMAPartnerID INT = (SELECT COALESCE(PartnerParentID, PartnerID) FROM Partners WHERE Partnerid=@SOToID)
	DECLARE @ReturnReasonType NVARCHAR(40) = (SELECT TypeCode FROM TypeLookUp WHERE TypeLookUpID = (SELECT ReturnReasonType FROM Partners WHERE PartnerID = @RMAPartnerID))

	IF @ReturnReasonType = 'RET0001'
	BEGIN
		
		INSERT INTO @RMAAction(RMAActionCodeID,RMAActionName)
		SELECT DISTINCT rmac.RMAActionCodeID, rmac.RMAActionName FROM  partners P 
		INNER JOIN PartnerReturnReasonMap prrm ON P.PartnerID=prrm.PartnerID 
		INNER JOIN RMAActionCode rmac
		ON prrm.RMAActionCodeID=rmac.RMAActionCodeID
		WHERE prrm.PartnerID = @RMAPartnerID
		AND RMAActionType in (1829,1831) 
	END
	ELSE
	BEGIN
		INSERT INTO @RMAAction(RMAActionCodeID,RMAActionName)
		SELECT DISTINCT RMAActionCodeID, RMAActionName 
		FROM RMAActionCode WHERE RMAActionCodeID IN (SELECT RMAActionCodeID FROM ItemModelReturnReasonMap WHERE ItemModelID= @ItemModelID)
		AND RMAActionType in (1829,1831)
	END	
RETURN  

End

GO
/****** Object:  UserDefinedFunction [dbo].[fn_GetItemString]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 CREATE Function [dbo].[fn_GetItemString](@SalesReturnOrderHeaderID INT) 
RETURNS NVARCHAR(MAX)
AS   
  
BEGIN  
DECLARE @Items NVARCHAR(MAX) = ''

DECLARE @lines TABLE
(
	ID INT PRIMARY KEY IDENTITY(1,1),
	SODID INT,
	ItemName NVARCHAR(100),	 
	ModelName NVARCHAR(400),	
	Quantity NVARCHAR(100),
	--SONumber NVARCHAR(100),
	ReturnReason NVARCHAR(500),	 
	Status NVARCHAR(100),
	Serialised NVARCHAR(10),
	SerialNumber NVARCHAR(100)
)

INSERT INTO @lines
SELECT SalesReturnOrderDetail.SalesReturnOrderDetailID	
, ItemMaster.ItemName
, ItemModel.ModelName
, SalesReturnOrderDetail.Quantity
--, SOHeader.SONumber	
, RMAActionCode.RMAActionName AS ReturnReason
, Statuses.StatusName
, [dbo].[fn_GetSerialisedRL](ItemMaster.ItemNumber) AS Serialised
, iteminfo.SerialNumber
			
FROM SalesReturnOrderHeader INNER JOIN SalesReturnOrderDetail
ON SalesReturnOrderDetail.SalesReturnOrderHeaderID = SalesReturnOrderHeader.SalesReturnOrderHeaderID
--INNER JOIN SOHeader	ON SOHeader.SOHeaderID = SalesReturnOrderDetail.SOHeaderID
INNER JOIN iteminfo ON [iteminfo].ItemInfoID = SalesReturnOrderDetail.ItemInfoID
INNER JOIN ItemMaster ON ItemMaster.ItemMasterID = [iteminfo].ItemMasterID
INNER JOIN ModuleStatusMap ON ModuleStatusMap.ModuleStatusMapID=SalesReturnOrderDetail.ModuleStatusMapID
INNER JOIN Statuses ON ModuleStatusMap.StatusID=Statuses.StatusID
LEFT OUTER JOIN ItemModel  ON ItemMaster.ItemModelID = ItemModel.ItemModelID
LEFT JOIN RMAActionCode ON RMAActionCode.RMAActionCodeID = SalesReturnOrderDetail.ReturnReasonID			
WHERE SalesReturnOrderHeader.RMASource='Customer' --and SOHeader.SOTypeID = 555 
AND SalesReturnOrderHeader.SalesReturnOrderHeaderID =@SalesReturnOrderHeaderID

DECLARE @Item NVARCHAR(MAX) = ''
DECLARE @TotalItems NVARCHAR(MAX)

DECLARE @Id INT
DECLARE Lines_cursor CURSOR FOR  
SELECT Id from @lines

OPEN Lines_cursor   
FETCH NEXT FROM Lines_cursor INTO @Id  

WHILE @@FETCH_STATUS = 0   
BEGIN
	DECLARE @ItemName NVARCHAR(100), @ModelName NVARCHAR(400), @Quantity NVARCHAR(100), @SONumber NVARCHAR(100), @ReturnReason NVARCHAR(500), @Status NVARCHAR(100)
		
	SELECT @ItemName = ItemName, @ModelName = ModelName, 
	@Quantity = CASE WHEN Serialised = '0' THEN  Quantity
	ELSE SerialNumber END, @ReturnReason = ReturnReason, @Status = Status --,@SONumber = SONumber
	FROM @Lines line where Id=@Id

	SET @Item +=  '<tr> 
				<td style="padding:5px;">'+@ItemName+'</td>
				<td style="padding:5px;">'+@ModelName+'</td>
				<td style="padding:5px;">'+CAST(@Quantity AS VARCHAR(50))+'</td>
				<td style="padding:5px;">'+@SONumber+'</td>
				<td style="padding:5px;">'+@ReturnReason+'</td>
				<td style="padding:5px;">'+@Status+'</td>
			  </tr>' 

	FETCH NEXT FROM Lines_cursor INTO @Id  
END

CLOSE Lines_cursor   
DEALLOCATE Lines_cursor
  
RETURN @Item 
  
End

GO
/****** Object:  UserDefinedFunction [dbo].[fn_GetItemStringForEmail]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 CREATE Function [dbo].[fn_GetItemStringForEmail](@SalesReturnOrderHeaderID INT) 
RETURNS NVARCHAR(MAX)
AS   
  
BEGIN  
DECLARE @Items NVARCHAR(MAX) = ''

DECLARE @lines TABLE
(
	ID INT PRIMARY KEY IDENTITY(1,1),
	SODID INT,
	ItemName NVARCHAR(100),	 
	ModelName NVARCHAR(400),	
	Quantity NVARCHAR(100),
	SONumber NVARCHAR(100),
	ReturnReason NVARCHAR(500),	 
	Status NVARCHAR(100),
	Serialised NVARCHAR(10),
	SerialNumber NVARCHAR(100)
)

INSERT INTO @lines
SELECT SalesReturnOrderDetail.SalesReturnOrderDetailID	
, ItemMaster.ItemName
, ItemModel.ModelName
, SalesReturnOrderDetail.Quantity
, SOHeader.SONumber	
, RMAActionCode.RMAActionName AS ReturnReason
, Statuses.StatusName
, [dbo].[fn_GetSerialisedRL](ItemMaster.ItemNumber) AS Serialised
, iteminfo.SerialNumber
			
FROM SalesReturnOrderHeader INNER JOIN SalesReturnOrderDetail
ON SalesReturnOrderDetail.SalesReturnOrderHeaderID = SalesReturnOrderHeader.SalesReturnOrderHeaderID
INNER JOIN SOHeader	ON SOHeader.SOHeaderID = SalesReturnOrderDetail.SOHeaderID
INNER JOIN iteminfo ON [iteminfo].ItemInfoID = SalesReturnOrderDetail.ItemInfoID
INNER JOIN ItemMaster ON ItemMaster.ItemMasterID = [iteminfo].ItemMasterID
INNER JOIN ModuleStatusMap ON ModuleStatusMap.ModuleStatusMapID=SalesReturnOrderDetail.ModuleStatusMapID
INNER JOIN Statuses ON ModuleStatusMap.StatusID=Statuses.StatusID
LEFT OUTER JOIN ItemModel  ON ItemMaster.ItemModelID = ItemModel.ItemModelID
LEFT JOIN RMAActionCode ON RMAActionCode.RMAActionCodeID = SalesReturnOrderDetail.ReturnReasonID			
WHERE SalesReturnOrderHeader.RMASource='Customer' and SOHeader.SOTypeID = 555 
AND SalesReturnOrderHeader.SalesReturnOrderHeaderID =@SalesReturnOrderHeaderID

DECLARE @Item NVARCHAR(MAX) = '<table>'
DECLARE @TotalItems NVARCHAR(MAX)

DECLARE @Id INT
DECLARE Lines_cursor CURSOR FOR  
SELECT Id from @lines

OPEN Lines_cursor   
FETCH NEXT FROM Lines_cursor INTO @Id  

WHILE @@FETCH_STATUS = 0   
BEGIN
	DECLARE @ItemName NVARCHAR(100), @ModelName NVARCHAR(400), @Quantity NVARCHAR(100), @SONumber NVARCHAR(100), @ReturnReason NVARCHAR(500), @Status NVARCHAR(100)
		
	SELECT @ItemName = ItemName, @ModelName = ModelName, 
	@Quantity = CASE WHEN Serialised = '0' THEN  Quantity
	ELSE SerialNumber END, @SONumber = SONumber, @ReturnReason = ReturnReason, @Status = Status
	FROM @Lines line where Id=@Id

	--SET @Item +=  '<tr> 
	--			<td style="padding:5px;"><b>'+@ItemName+'</b> <br/><b>Model:</b>'+@ModelName+'<br/><b>Serial#/Quantity:</b>'+@Quantity+'<br/><b>Return Reason: </b>'+@ReturnReason+' <br/><b>Status:</b>'+@Status +'</td>
				
	--		  </tr>' 

	SET @Item += '<tr>
	                   <td>
                            <div>
                                <b>'+ @ItemName + '</b>
                            </div>
                            <div>
                                <b>Model:</b>&nbsp;&nbsp;' + @ModelName +'
                            </div>
                            <div>
                                <b>Serial#/Quantity:</b>&nbsp;&nbsp;' + @Quantity +'
                            </div>
                            <div>
                                <b>Return Reason:</b>&nbsp;&nbsp;' + @ReturnReason +'
                            </div>
                            <div>
                                <b>Status:</b>&nbsp;&nbsp;' +@Status +'
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="height:10px;"></td>
                    </tr>'

	FETCH NEXT FROM Lines_cursor INTO @Id  
END

CLOSE Lines_cursor   
DEALLOCATE Lines_cursor

SET @Item += '</table>'
  
RETURN @Item 
  
End

GO
/****** Object:  UserDefinedFunction [dbo].[fn_GetModuleActionConfigValuebyCode]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
/***********************************
Project Name: ReverseLogix 2.1
Purpose of SP: Add/Update Order Settings
Created By: Satyendra Mandlavdiya
CreatedDate: 31-May-2017
Parameter Details:
*******************************/
CREATE Function [dbo].[fn_GetModuleActionConfigValuebyCode]( @moduleID int, @code nvarchar(20))   
  
returns varchar(500)   
  
as   
  
Begin  
 Return 
	(Select top 1 CTV.Value 
	 from Module M       
	  Inner Join  ModuleConfig MC       
	  on M.ModuleID = MC.ModuleID      
	inner join ModuleControlType CT on      
	MC.ModuleControlTypeID=CT.ModuleControlTypeID       
	Left join ModuleControlTypeValue CTV on CT.ModuleControlTypeID=CTV.ModuleControlTypeID       
	inner join (Select * from ModuleActionConfigValue where ModuleActionConfigValueID in (Select Max(ModuleActionConfigValueID) from ModuleActionConfigValue group by ModuleConfigID)) MCV   
	on MCV.ModuleConfigID=MC.ModuleConfigID and MCV.ModuleControlTypeValueID = CTV.ModuleControlTypeValueID  
	Where M.ModuleID = @moduleID  and  Code = @code
	and ParentModuleConfigID is  null and MC.IsActive = 1  ) 
	  
End

GO
/****** Object:  UserDefinedFunction [dbo].[fn_GetMyChilds]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE Function [dbo].[fn_GetMyChilds](@ID INT) 
RETURNS NVARCHAR(MAX)
AS   
BEGIN
	DECLARE @Data NVARCHAR(MAX)
	SELECT @Data =(SELECT PartnerLocationID, ParentPartnerLocationID, LocationCode, LocationName, FrameID, ColorCode, RowIndex, TenantLocationCode, [dbo].[fn_GetMyChilds](PartnerLocationID) Childs
	FROM PartnerLocation 
	WHERE ParentPartnerLocationID = @ID FOR JSON PATH)
RETURN ISNULL(JSON_QUERY(@Data, '$'), JSON_QUERY('[]', '$'))
END

GO
/****** Object:  UserDefinedFunction [dbo].[fn_GetommaSepSONumber]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE FUNCTION [dbo].[fn_GetommaSepSONumber](@SalesReturnOrderHeaderID INT)
RETURNS NVARCHAR(1000)
AS
BEGIN
	DECLARE @SONumbers NVARCHAR(1000) = ''
   Set @SONumbers = (SELECT SONumber + ',' 
           FROM 
		   (SELECT DISTINCT SONumber FROM SOHeader 
		   INNER JOIN SalesReturnOrderDetail ON SalesReturnOrderDetail.SOHeaderID = SOHeader.SOHeaderID 
		   
		   inner join SalesReturnOrderHeader on SalesReturnOrderHeader.SalesReturnOrderHeaderID = SalesReturnOrderDetail.SalesReturnOrderHeaderID
         WHERE SalesReturnOrderHeader.SalesReturnOrderHeaderID = @SalesReturnOrderHeaderID) s
          ORDER BY SONumber
            FOR XML PATH(''))
  
	RETURN @SONumbers 
END;

GO
/****** Object:  UserDefinedFunction [dbo].[fn_GetOpenRMA]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE FUNCTION [dbo].[fn_GetOpenRMA](@SalesReturnOrderNumber VARCHAR(100), @FromAccountID INT, @ToPartnerID INT)
RETURNS @RMANumber TABLE (
   SalesReturnOrderNumber VARCHAR(100)   
) 
AS
BEGIN
   INSERT INTO @RMANumber
   SELECT DISTINCT SalesReturnOrderHeader.SalesReturnOrderNumber
	FROM SalesReturnOrderHeader 
	INNER JOIN SalesReturnOrderDetail
	ON SalesReturnOrderDetail.SalesReturnOrderHeaderID = SalesReturnOrderHeader.SalesReturnOrderHeaderID
	--INNER JOIN SOHeader
	--ON SOHeader.SOHeaderID = SalesReturnOrderDetail.SOHeaderID	
	INNER JOIN ModuleStatusMap ON ModuleStatusMap.ModuleStatusMapID=SalesReturnOrderDetail.ModuleStatusMapID
	INNER JOIN Statuses ON ModuleStatusMap.StatusID=Statuses.StatusID
	WHERE (SalesReturnOrderHeader.FromAccountID = @FromAccountID or SalesReturnOrderHeader.ToPartnerID = @ToPartnerID )
	AND StatusName NOT IN ('Close','Discrepant')
  
   RETURN;
END;

GO
/****** Object:  UserDefinedFunction [dbo].[fn_GetPartnerFacility]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 


CREATE Function [dbo].[fn_GetPartnerFacility](@ID INT) 
RETURNS NVARCHAR(MAX)
AS   
BEGIN
	DECLARE @Data NVARCHAR(MAX)
	SELECT TOP 1 @Data = Partners.PartnerName FROM Users 
	LEFT JOIN UserRoleMap ON UserRoleMap.UserID=users.UserID
	LEFT JOIN PartnerUserRoleMap ON PartnerUserRoleMap.UserRoleMapID=UserRoleMap.UserRoleMapID 
	LEFT JOIN Partners ON Partners.PartnerID = PartnerUserRoleMap.PartnerID
	WHERE Users.UserID = @ID and PartnerUserRoleMap.isDefault = 1
	
	RETURN @Data
END

GO
/****** Object:  UserDefinedFunction [dbo].[fn_GetPartnerFromAddressID]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE Function [dbo].[fn_GetPartnerFromAddressID]( @RMASource NVARCHAR(20), @RefId INT) 
RETURNS VARCHAR(250)
AS   
  
Begin  
DECLARE @FromAddressId AS VARCHAR(250)
   
IF(@RMASource = 'Customer')
BEGIN
SET @FromAddressId = (select top 1 a.AddressID as FromAddressId
                     from SalesReturnOrderDetail dtl
                    inner join SalesReturnOrderheader sroh on sroh.SalesReturnOrderheaderID=dtl.SalesReturnOrderHeaderID
                    
					left join Customer p on p.CustomerId=sroh.FromAccountID
                    left join CustomerAddressMap map on map.CustomerID=p.CustomerID
					left join address a on a.AddressID=map.AddressID
                    left join state s on a.AddressID=s.StateID
                    left join country c on c.CountryID=s.CountryID
                    where SalesReturnOrderDetailID= @RefId)
END
ELSE
BEGIN
SET @FromAddressId = (select top 1 a.AddressID as FromAddressId
                     from SalesReturnOrderDetail dtl
                    inner join SalesReturnOrderheader sroh on sroh.SalesReturnOrderheaderID=dtl.SalesReturnOrderHeaderID
					left join Partners p on p.PartnerId=sroh.FromAccountID
                    left join PartnerAddressMap map on map.PartnerID=p.PartnerID                    
					left join address a on a.AddressID=map.AddressID
                    left join state s on a.AddressID=s.StateID
                    left join country c on c.CountryID=s.CountryID
                    where SalesReturnOrderDetailID= @RefId)
END
  
RETURN @FromAddressId 
  
End

GO
/****** Object:  UserDefinedFunction [dbo].[fn_GetPartnerFromDetails]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 


CREATE Function [dbo].[fn_GetPartnerFromDetails]( @RMASource NVARCHAR(20), @RefId INT) 
RETURNS VARCHAR(250)
AS   
  
Begin  
DECLARE @PartnerFrom AS VARCHAR(250)
   
IF(@RMASource = 'Customer')
BEGIN
SET @PartnerFrom = (select top 1 p.FullName PartnerName
                     from SalesReturnOrderDetail dtl
                    inner join SalesReturnOrderheader sroh on sroh.SalesReturnOrderheaderID=dtl.SalesReturnOrderHeaderID
                    
					left join Customer p on p.CustomerId=sroh.FromAccountID
                    left join CustomerAddressMap map on map.CustomerID=p.CustomerID
					left join address a on a.AddressID=map.AddressID
                    left join state s on a.AddressID=s.StateID
                    left join country c on c.CountryID=s.CountryID
                    where SalesReturnOrderDetailID= @RefId)
END
ELSE
BEGIN
SET @PartnerFrom = (select top 1 p.PartnerName
                     from SalesReturnOrderDetail dtl
                    inner join SalesReturnOrderheader sroh on sroh.SalesReturnOrderheaderID=dtl.SalesReturnOrderHeaderID
					left join Partners p on p.PartnerId=sroh.FromAccountID
                    left join PartnerAddressMap map on map.PartnerID=p.PartnerID                    
					left join address a on a.AddressID=map.AddressID
                    left join state s on a.AddressID=s.StateID
                    left join country c on c.CountryID=s.CountryID
                    where SalesReturnOrderDetailID= @RefId)
END
  
RETURN @PartnerFrom 
  
End

GO
/****** Object:  UserDefinedFunction [dbo].[fn_GetPartnerToDetails]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE Function [dbo].[fn_GetPartnerToDetails]( @RMASource NVARCHAR(20), @RefId INT) 
RETURNS VARCHAR(250)
AS   
  
Begin  
DECLARE @PartnerTo AS VARCHAR(250)
   
IF(@RMASource = 'Customer')
BEGIN
SET @PartnerTo = (select top 1 p.FullName PartnerName
                     from SalesReturnOrderDetail dtl
                    inner join SalesReturnOrderheader sroh on sroh.SalesReturnOrderheaderID=dtl.SalesReturnOrderHeaderID
                    
					left join Customer p on p.CustomerId=sroh.ToPartnerID
                    left join CustomerAddressMap map on map.CustomerID=p.CustomerID
					left join address a on a.AddressID=map.AddressID
                    left join state s on a.AddressID=s.StateID
                    left join country c on c.CountryID=s.CountryID
                    where SalesReturnOrderDetailID= @RefId)
END
ELSE
BEGIN
SET @PartnerTo = (select top 1 p.PartnerName
                     from SalesReturnOrderDetail dtl
                    inner join SalesReturnOrderheader sroh on sroh.SalesReturnOrderheaderID=dtl.SalesReturnOrderHeaderID
					left join Partners p on p.PartnerId=sroh.ToPartnerID
                    left join PartnerAddressMap map on map.PartnerID=p.PartnerID                    
					left join address a on a.AddressID=map.AddressID
                    left join state s on a.AddressID=s.StateID
                    left join country c on c.CountryID=s.CountryID
                    where SalesReturnOrderDetailID= @RefId)
END
  
RETURN @PartnerTo 
  
End

GO
/****** Object:  UserDefinedFunction [dbo].[fn_GetRemainingQuantity]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE FUNCTION [dbo].[fn_GetRemainingQuantity](@ItemInfoID INT, @PartnerID INT)
RETURNS INT
AS
BEGIN  
DECLARE @ReturnQuantity AS INT
DECLARE @AvailableQuantity AS INT 

SET @ReturnQuantity = (SELECT SUM(Quantity) FROM SalesReturnOrderDetail srod LEFT JOIN SalesReturnOrderHeader sroh
				 ON srod.SalesReturnOrderHeaderID = sroh.SalesReturnOrderHeaderID
				 WHERE ItemInfoID = @ItemInfoID AND FromAccountID = @PartnerID)

SET @AvailableQuantity = (SELECT SUM(Quantity) FROM InBoundItemContextHistory WHERE PartnerID = @PartnerID AND ItemInfoID = @ItemInfoID)
RETURN ISNULL(@AvailableQuantity,0) -  ISNULL(@ReturnQuantity,0)

End

GO
/****** Object:  UserDefinedFunction [dbo].[fn_getReturnCount]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [dbo].[fn_getReturnCount](@return_header_id INT)
RETURNS INT
AS
BEGIN 
   RETURN (SELECT SUM(return_qty) FROM return_detail WHERE return_header_id = @return_header_id)
END
GO
/****** Object:  UserDefinedFunction [dbo].[fn_getReturnCount_stage]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [dbo].[fn_getReturnCount_stage](@return_header_id INT)
RETURNS INT
AS
BEGIN 
   RETURN (SELECT SUM(return_qty) FROM return_detail_stage WHERE return_header_id = @return_header_id)
END
GO
/****** Object:  UserDefinedFunction [dbo].[fn_GetReturnReasonModelWise]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE FUNCTION [dbo].[fn_GetReturnReasonModelWise](@ModelName VARCHAR(400))
RETURNS NVARCHAR(MAX)
AS
BEGIN
	DECLARE @ReturnTypeLIST AS NVARCHAR(MAX) 
	DECLARE @ItemModelID AS INT

	SET @ItemModelID = (SELECT TOP 1 ItemModelID FROM ItemModel WHERE ModelName = @ModelName)

	IF EXISTS(SELECT RMAActionCodeID FROM ItemModelReturnReasonMap WHERE ItemModelID = @ItemModelID)
	BEGIN
			--SET @ReturnTypeLIST = (SELECT (SELECT * FROM
			--						(
			--							SELECT * FROM RMAActionCode
			--							WHERE RMAActionCodeID IN (SELECT RMAActionCodeID FROM ItemModelReturnReasonMap WHERE ItemModelID= (SELECT ItemModelID
			--							FROM ItemInfo II LEFT OUTER JOIN ItemMaster IM
			--							ON II.ItemMasterID = IM.ItemMasterID
			--							WHERE SerialNumber= @SerialNumber))
			--						)t FOR JSON AUTO )AS ReturnTypeList)

			SET @ReturnTypeLIST = (SELECT(SELECT * FROM 
									(
										SELECT * FROM RMAActionCode WHERE RMAActionType in (1830,1831) AND RMAActionCodeID IN
										(SELECT RMAActionCodeID FROM ItemModelReturnReasonMap WHERE ItemModelID= @ItemModelID)
									)t FOR JSON AUTO )AS ReturnTypeList)			

	END
	ELSE
	BEGIN		
		SET @ReturnTypeLIST= '[]'
	END

	RETURN @ReturnTypeLIST
	
END

GO
/****** Object:  UserDefinedFunction [dbo].[fn_getReturnstatuses]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [dbo].[fn_getReturnstatuses](@return_header_id INT)
RETURNS NVARCHAR(MAX)
AS
BEGIN 
   RETURN (
   SELECT * FROM 
   (SELECT  0 AS status_id, '' AS status_code, '' AS 'status'
   UNION ALL
   SELECT TypeLookUpID AS status_id, TypeCode AS status_code, TypeName AS 'status' FROM return_detail
   INNER JOIN TypeLookUp ON TypeLookUp.TypeLookUpID = return_detail.status_id
   WHERE return_header_id = @return_header_id)S FOR JSON PATH)
END
GO
/****** Object:  UserDefinedFunction [dbo].[fn_getReturnstatuses_stage]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [dbo].[fn_getReturnstatuses_stage](@return_header_id INT)
RETURNS NVARCHAR(MAX)
AS
BEGIN 
   RETURN (
   SELECT * FROM 
   (SELECT  0 AS status_id, '' AS status_code, '' AS 'status'
   UNION ALL
   SELECT TypeLookUpID AS status_id, TypeCode AS status_code, TypeName AS 'status' FROM return_detail_stage
   INNER JOIN TypeLookUp ON TypeLookUp.TypeLookUpID = return_detail_stage.status_id
   WHERE return_header_id = @return_header_id)S FOR JSON PATH)
END
GO
/****** Object:  UserDefinedFunction [dbo].[fn_GetReturnType]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE FUNCTION [dbo].[fn_GetReturnType](@ItemNumber nvarchar(100))
RETURNS VARCHAR(10)
AS 
 
BEGIN 
DECLARE @IsReturnType AS VARCHAR(10)
DECLARE @ItemReturnTypeID AS INT   
DECLARE @DummyReturnType AS BIT  

SET @ItemReturnTypeID =(SELECT TOP 1 ItemReturnTypeID FROM ItemMaster WHERE ItemNumber = @ItemNumber)	
IF @ItemReturnTypeID <> 0
BEGIN
	IF @ItemReturnTypeID = 1815
		SET @IsReturnType = 1
	ELSE
		SET @IsReturnType = 0
END
ELSE
BEGIN
	SET @DummyReturnType = (SELECT IsReturnType FROM DummySoItems WHERE ItemNumber = @ItemNumber) 
	IF @DummyReturnType = 1
		SET @IsReturnType = 1
	ELSE
		SET @IsReturnType = 0
END
RETURN @IsReturnType 
END

GO
/****** Object:  UserDefinedFunction [dbo].[fn_GetReturnTypeRL]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE FUNCTION [dbo].[fn_GetReturnTypeRL](@ItemNumber nvarchar(100))
RETURNS VARCHAR(10)
AS 
 
BEGIN 
DECLARE @IsReturnType AS VARCHAR(10)
DECLARE @ItemReturnTypeID AS INT   
DECLARE @DummyReturnType AS BIT = 0 

SET @ItemReturnTypeID =(SELECT TOP 1 ItemReturnTypeID FROM ItemMaster WHERE ItemNumber = @ItemNumber)	
IF @ItemReturnTypeID <> 0
BEGIN
	IF @ItemReturnTypeID = 1815
		SET @IsReturnType = 1
	ELSE
		SET @IsReturnType = 0
END

RETURN @IsReturnType 
END

GO
/****** Object:  UserDefinedFunction [dbo].[fn_GetSerialised]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE FUNCTION [dbo].[fn_GetSerialised](@ItemNumber nvarchar(100))
RETURNS VARCHAR(10)
AS 
 
BEGIN 
DECLARE @IsSerialised AS VARCHAR(10)
DECLARE @ItemReceiveTypeID AS INT   
DECLARE @DummyItemType AS BIT  

SET @ItemReceiveTypeID =(SELECT TOP 1 ItemReceiveTypeID FROM ItemMaster WHERE ItemNumber = @ItemNumber)	
IF @ItemReceiveTypeID <> 0
BEGIN
	IF @ItemReceiveTypeID = 76
		SET @IsSerialised = 1
	ELSE
		SET @IsSerialised = 0
END
ELSE
BEGIN
	SET @DummyItemType = (SELECT IsSerialised FROM DummySoItems WHERE ItemNumber = @ItemNumber) 
	IF @DummyItemType = 1
		SET @IsSerialised = 1
	ELSE
		SET @IsSerialised = 0
END
RETURN @IsSerialised 
END

GO
/****** Object:  UserDefinedFunction [dbo].[fn_GetSerialisedRL]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE FUNCTION [dbo].[fn_GetSerialisedRL](@ItemNumber nvarchar(100))
RETURNS VARCHAR(10)
AS 
 
BEGIN 
DECLARE @IsSerialised AS VARCHAR(10)
DECLARE @ItemReceiveTypeID AS INT   
DECLARE @DummyItemType AS BIT  

SET @ItemReceiveTypeID =(SELECT TOP 1 ItemReceiveTypeID FROM ItemMaster WHERE ItemNumber = @ItemNumber)	
IF @ItemReceiveTypeID <> 0
BEGIN
	IF @ItemReceiveTypeID = 76
		SET @IsSerialised = 1
	ELSE
		SET @IsSerialised = 0
END
ELSE
BEGIN
	SET @IsSerialised = 0
END

RETURN @IsSerialised 

END

GO
/****** Object:  UserDefinedFunction [dbo].[fn_GetSOSerialNumber]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE FUNCTION [dbo].[fn_GetSOSerialNumber](@SerialNumber VARCHAR(500))
RETURNS  @ItemTable TABLE 
(  
    SerialNumber nvarchar(200)
)
AS
BEGIN
DECLARE @SQL VARCHAR(2500)
SET @SQL = 'insert into @ItemTable 
			select SerialNumber from DummySOItems DSOI inner join DummySO DSO on DSOI.SOID=DSO.SOID
			where (DSOI.SerialNumber in('+@SerialNumber+') or DSO.EmailID in('+@SerialNumber+') or DSO.SalesOrderNumber in('+@SerialNumber+') or DSO.BOL in('+@SerialNumber+'))'


return
END

GO
/****** Object:  UserDefinedFunction [dbo].[fn_GetSROItems]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 


CREATE FUNCTION [dbo].[fn_GetSROItems](@ToPartnerID INT, @SROType NVARCHAR(50))
RETURNS @SRO TABLE (
   SalesReturnOrderNumber VARCHAR(100)   
) 
AS
BEGIN
	IF @SROType = 'Received'
	BEGIN
		INSERT INTO @SRO
		SELECT DISTINCT RefDetailID--,s.Statusname,s.statuscode
		FROM InBoundItemContextHistory IBICH INNER JOIN MRNHeader ON IBICH.MRNHeaderID = MRNHeader.MRNHeaderID
		LEFT JOIN ModuleStatusMap smap ON smap.ModuleStatusMapID=IBICH.ModuleStatusMapID
		LEFT JOIN Statuses s ON s.StatusID=smap.StatusID	
		LEFT OUTER JOIN SalesReturnOrderHeader sroh ON sroh.SalesReturnOrderHeaderID = IBICH.RefHeaderID AND RefTypeID =641
		WHERE (MRNHeader.FromPartnerID = @ToPartnerID OR MRNHeader.ToPartnerID = @ToPartnerID)
		AND IBICH.InBoundItemContextHistoryID in (select MAX(InBoundItemContextHistoryID) from InBoundItemContextHistory Where MRNHeaderID= MRNHeader.MRNHeaderID group By LineID)
		AND MRNHeader.MRNTypeID=641 
		AND Statusname IS NOT NULL  AND s.StatusCode in ('ST068','ST023','ST015')
		AND IBICH.Discrepancy IS NULL --AND IsContainerClosed = 0
   END
   ELSE
   BEGIN
		INSERT INTO @SRO
		SELECT DISTINCT RefDetailID
		FROM InBoundItemContextHistory IBICH INNER JOIN MRNHeader ON IBICH.MRNHeaderID = MRNHeader.MRNHeaderID
		LEFT JOIN ModuleStatusMap smap ON smap.ModuleStatusMapID=IBICH.ModuleStatusMapID
		LEFT JOIN Statuses s ON s.StatusID=smap.StatusID	
		LEFT OUTER JOIN SalesReturnOrderHeader sroh ON sroh.SalesReturnOrderHeaderID = IBICH.RefHeaderID AND RefTypeID =641
		WHERE  (MRNHeader.FromPartnerID = @ToPartnerID OR MRNHeader.ToPartnerID = @ToPartnerID)
		AND IBICH.InBoundItemContextHistoryID in (select MAX(InBoundItemContextHistoryID) from InBoundItemContextHistory Where MRNHeaderID= MRNHeader.MRNHeaderID group By LineID)
		AND MRNHeader.MRNTypeID=641 
		AND Statusname IS NOT NULL  AND s.StatusCode in ('ST022') AND Discrepancy is NULL AND IsContainerClosed = 1
   END
   RETURN;
END;

GO
/****** Object:  UserDefinedFunction [dbo].[fn_GetTaskName]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
  
  
CREATE Function [dbo].[fn_GetTaskName]( @ActionID varchar(50))     
returns varchar(200)     
as 
Begin  
DECLARE @TaskName VARCHAR(MAX);      
SELECT @TaskName = COALESCE(@TaskName+'/' , '') +     TypeName from TypeLookUp where TypeLookUpID in (select items from dbo.split(@ActionID,','))      
 return(isnull(@TaskName,''))      
 
 END

GO
/****** Object:  UserDefinedFunction [dbo].[fn_GetTotalCompleted]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE FUNCTION [dbo].[fn_GetTotalCompleted](@MRNHeaderID INT, @Status NVARCHAR(50))
RETURNS INT
AS 
 
BEGIN 
DECLARE @TotalComplete INT

IF @Status ='Receive'
BEGIN
SET @TotalComplete = (SELECT DISTINCT COUNT(InBoundItemContextHistoryID)
						FROM InBoundItemContextHistory IBICH INNER JOIN MRNHeader ON IBICH.MRNHeaderID = MRNHeader.MRNHeaderID	
						LEFT OUTER JOIN ModuleWorkFlowDetail MWFD ON IBICH.ModuleWorkFlowID = MWFD.ModuleWorkFlowID AND IBICH.ModuleStatusMapID = MWFD.CurrentModuleStatusMapID
						LEFT OUTER JOIN ModuleStatusMap MS ON MWFD.NextModuleStatusMapID = MS.ModuleStatusMapID
						LEFT OUTER JOIN Statuses MST ON MS.StatusID = MST.StatusID	
						WHERE IBICH.MRNHeaderID = @MRNHeaderID				
						AND IBICH.InBoundItemContextHistoryID in (select MAX(InBoundItemContextHistoryID) from InBoundItemContextHistory 
						Where MRNHeaderID= MRNHeader.MRNHeaderID group By LineID))
END
ELSE IF @Status ='Inspect'
BEGIN
SET @TotalComplete = (SELECT DISTINCT COUNT(InBoundItemContextHistoryID)
						FROM InBoundItemContextHistory IBICH INNER JOIN MRNHeader ON IBICH.MRNHeaderID = MRNHeader.MRNHeaderID	
						LEFT OUTER JOIN ModuleWorkFlowDetail MWFD ON IBICH.ModuleWorkFlowID = MWFD.ModuleWorkFlowID AND IBICH.ModuleStatusMapID = MWFD.CurrentModuleStatusMapID
						LEFT OUTER JOIN ModuleStatusMap MS ON MWFD.NextModuleStatusMapID = MS.ModuleStatusMapID
						LEFT OUTER JOIN Statuses MST ON MS.StatusID = MST.StatusID	
						WHERE IBICH.MRNHeaderID = @MRNHeaderID				
						AND IBICH.InBoundItemContextHistoryID in (select MAX(InBoundItemContextHistoryID) from InBoundItemContextHistory 
						Where MRNHeaderID= MRNHeader.MRNHeaderID group By LineID) 
						AND (MST.StatusCode = 'ST022' OR MST.StatusCode IS NULL)
						AND IBICH.IsContainerClosed = 1)
END
ELSE IF @Status ='PutAway'
BEGIN
SET @TotalComplete = (SELECT DISTINCT COUNT(InBoundItemContextHistoryID)
						FROM InBoundItemContextHistory IBICH INNER JOIN MRNHeader ON IBICH.MRNHeaderID = MRNHeader.MRNHeaderID	
						LEFT OUTER JOIN ModuleWorkFlowDetail MWFD ON IBICH.ModuleWorkFlowID = MWFD.ModuleWorkFlowID AND IBICH.ModuleStatusMapID = MWFD.CurrentModuleStatusMapID
						LEFT OUTER JOIN ModuleStatusMap MS ON MWFD.NextModuleStatusMapID = MS.ModuleStatusMapID
						LEFT OUTER JOIN Statuses MST ON MS.StatusID = MST.StatusID	
						WHERE IBICH.MRNHeaderID = @MRNHeaderID				
						AND IBICH.InBoundItemContextHistoryID in (select MAX(InBoundItemContextHistoryID) from InBoundItemContextHistory 
						Where MRNHeaderID= MRNHeader.MRNHeaderID group By LineID) 
						AND MST.StatusCode IS NULL
						AND IBICH.IsContainerClosed = 1)
END

RETURN ISNULL(@TotalComplete,0)

END

GO
/****** Object:  UserDefinedFunction [dbo].[fn_GetTotalInspect]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE FUNCTION [dbo].[fn_GetTotalInspect](@MRNHeaderID INT)
RETURNS INT
AS 
 
BEGIN 
	DECLARE @TotalCount INT	

	SET @TotalCount = (SELECT DISTINCT COUNT(InBoundItemContextHistoryID)
				FROM InBoundItemContextHistory IBICH INNER JOIN MRNHeader ON IBICH.MRNHeaderID = MRNHeader.MRNHeaderID	
				LEFT OUTER JOIN ModuleWorkFlowDetail MWFD ON IBICH.ModuleWorkFlowID = MWFD.ModuleWorkFlowID AND IBICH.ModuleStatusMapID = MWFD.CurrentModuleStatusMapID
				LEFT OUTER JOIN ModuleStatusMap MS ON MWFD.NextModuleStatusMapID = MS.ModuleStatusMapID
				LEFT OUTER JOIN Statuses MST ON MS.StatusID = MST.StatusID	
				WHERE IBICH.MRNHeaderID = @MRNHeaderID				
				AND IBICH.InBoundItemContextHistoryID in (select MAX(InBoundItemContextHistoryID) from InBoundItemContextHistory 
				Where MRNHeaderID= MRNHeader.MRNHeaderID group By LineID) 
				AND (MST.StatusCode = 'ST022' OR MST.StatusCode IS NULL)
				AND IBICH.IsContainerClosed = 1 )

	RETURN ISNULL(@TotalCount,0)
END

GO
/****** Object:  UserDefinedFunction [dbo].[fn_GetTotalPending]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE FUNCTION [dbo].[fn_GetTotalPending](@MRNHeaderID INT , @Status NVARCHAR(50))
RETURNS INT
AS 
 
BEGIN 
DECLARE @TotalCount INT, @TotalComplete INT, @TotalPending INT

SET @TotalCount = (SELECT DISTINCT COUNT(InBoundItemContextHistoryID)
				FROM InBoundItemContextHistory IBICH INNER JOIN MRNHeader ON IBICH.MRNHeaderID = MRNHeader.MRNHeaderID	
				LEFT OUTER JOIN ModuleWorkFlowDetail MWFD ON IBICH.ModuleWorkFlowID = MWFD.ModuleWorkFlowID AND IBICH.ModuleStatusMapID = MWFD.CurrentModuleStatusMapID
				LEFT OUTER JOIN ModuleStatusMap MS ON MWFD.NextModuleStatusMapID = MS.ModuleStatusMapID
				LEFT OUTER JOIN Statuses MST ON MS.StatusID = MST.StatusID	
				WHERE IBICH.MRNHeaderID = @MRNHeaderID
				AND IBICH.InBoundItemContextHistoryID in (select MAX(InBoundItemContextHistoryID) from InBoundItemContextHistory Where MRNHeaderID= MRNHeader.MRNHeaderID group By LineID))

IF @Status = 'Inspect'
BEGIN
	SET @TotalComplete = (SELECT DISTINCT COUNT(InBoundItemContextHistoryID)
						FROM InBoundItemContextHistory IBICH INNER JOIN MRNHeader ON IBICH.MRNHeaderID = MRNHeader.MRNHeaderID	
						LEFT OUTER JOIN ModuleWorkFlowDetail MWFD ON IBICH.ModuleWorkFlowID = MWFD.ModuleWorkFlowID AND IBICH.ModuleStatusMapID = MWFD.CurrentModuleStatusMapID
						LEFT OUTER JOIN ModuleStatusMap MS ON MWFD.NextModuleStatusMapID = MS.ModuleStatusMapID
						LEFT OUTER JOIN Statuses MST ON MS.StatusID = MST.StatusID	
						WHERE IBICH.MRNHeaderID = @MRNHeaderID				
						AND IBICH.InBoundItemContextHistoryID in (select MAX(InBoundItemContextHistoryID) from InBoundItemContextHistory 
						Where MRNHeaderID= MRNHeader.MRNHeaderID group By LineID) 
						AND (MST.StatusCode = 'ST022' OR MST.StatusCode IS NULL)
						AND IBICH.IsContainerClosed = 1 )
	
	SET @TotalPending = ISNULL((@TotalCount- @TotalComplete) ,0)
END
ELSE
BEGIN
	SET @TotalPending = (SELECT DISTINCT COUNT(InBoundItemContextHistoryID)
						FROM InBoundItemContextHistory IBICH INNER JOIN MRNHeader ON IBICH.MRNHeaderID = MRNHeader.MRNHeaderID	
						LEFT OUTER JOIN ModuleWorkFlowDetail MWFD ON IBICH.ModuleWorkFlowID = MWFD.ModuleWorkFlowID AND IBICH.ModuleStatusMapID = MWFD.CurrentModuleStatusMapID
						LEFT OUTER JOIN ModuleStatusMap MS ON MWFD.NextModuleStatusMapID = MS.ModuleStatusMapID
						LEFT OUTER JOIN Statuses MST ON MS.StatusID = MST.StatusID	
						WHERE IBICH.MRNHeaderID = @MRNHeaderID				
						AND IBICH.InBoundItemContextHistoryID in (select MAX(InBoundItemContextHistoryID) from InBoundItemContextHistory 
						Where MRNHeaderID= MRNHeader.MRNHeaderID group By LineID) 
						AND MST.StatusCode = 'ST022'
						AND IBICH.Discrepancy IS NULL
						AND IBICH.IsContainerClosed = 1)
	
	--SET @TotalPending = ISNULL((@TotalCount- @TotalComplete) ,0)
END

RETURN ISNULL(@TotalPending,0)

END

GO
/****** Object:  UserDefinedFunction [dbo].[fn_GetTotalReceivingByStatus]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE FUNCTION [dbo].[fn_GetTotalReceivingByStatus](@StatusCode VARCHAR(50), @MRNHeaderID INT)
RETURNS INT
AS 
 
BEGIN 
	DECLARE @TotalCount INT	

	IF @StatusCode = ''
	BEGIN
		SET @TotalCount = (SELECT DISTINCT COUNT(InBoundItemContextHistoryID)
				FROM InBoundItemContextHistory IBICH INNER JOIN MRNHeader ON IBICH.MRNHeaderID = MRNHeader.MRNHeaderID	
				LEFT OUTER JOIN ModuleWorkFlowDetail MWFD ON IBICH.ModuleWorkFlowID = MWFD.ModuleWorkFlowID AND IBICH.ModuleStatusMapID = MWFD.CurrentModuleStatusMapID
				LEFT OUTER JOIN ModuleStatusMap MS ON MWFD.NextModuleStatusMapID = MS.ModuleStatusMapID
				LEFT OUTER JOIN Statuses MST ON MS.StatusID = MST.StatusID	
				WHERE IBICH.MRNHeaderID = @MRNHeaderID
				AND IBICH.InBoundItemContextHistoryID in (select MAX(InBoundItemContextHistoryID) from InBoundItemContextHistory Where MRNHeaderID= MRNHeader.MRNHeaderID group By LineID) )
    END
	ELSE
	BEGIN
		SET @TotalCount = (SELECT DISTINCT COUNT(InBoundItemContextHistoryID)
				FROM InBoundItemContextHistory IBICH INNER JOIN MRNHeader ON IBICH.MRNHeaderID = MRNHeader.MRNHeaderID	
				LEFT OUTER JOIN ModuleWorkFlowDetail MWFD ON IBICH.ModuleWorkFlowID = MWFD.ModuleWorkFlowID AND IBICH.ModuleStatusMapID = MWFD.CurrentModuleStatusMapID
				LEFT OUTER JOIN ModuleStatusMap MS ON MWFD.NextModuleStatusMapID = MS.ModuleStatusMapID
				LEFT OUTER JOIN Statuses MST ON MS.StatusID = MST.StatusID	
				WHERE IBICH.MRNHeaderID = @MRNHeaderID
				AND IBICH.InBoundItemContextHistoryID in (select MAX(InBoundItemContextHistoryID) from InBoundItemContextHistory Where MRNHeaderID= MRNHeader.MRNHeaderID group By LineID) 
				AND MST.StatusCode = @StatusCode)
	END

	RETURN ISNULL(@TotalCount,0)
END

GO
/****** Object:  UserDefinedFunction [dbo].[fn_GetUserRole]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 


CREATE Function [dbo].[fn_GetUserRole](@userid INT) 
RETURNS NVARCHAR(1000)
AS  
BEGIN  
DECLARE @RoleList NVARCHAR(1000) = ''

SELECT @RoleList = (CASE WHEN @RoleList ='' THEN RT.RoleName ELSE COALESCE(@RoleList + ', ', '') + RT.RoleName END)
FROM UserRoleMap URM INNER JOIN RoleType RT
ON URM.RoleTypeID = RT.RoleID
WHERE UserID= @userid
  
RETURN  @RoleList 
  
END

GO
/****** Object:  UserDefinedFunction [dbo].[fn_GetUserRoleList]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE Function [dbo].[fn_GetUserRoleList](@userid INT) 
RETURNS NVARCHAR(1000)
AS  
BEGIN  
DECLARE @RoleList NVARCHAR(1000) = ''

SELECT @RoleList = (CASE WHEN @RoleList ='' THEN RT.RoleName ELSE COALESCE(@RoleList + '<br/> <br/>', '') + RT.RoleName END)
FROM UserRoleMap URM INNER JOIN RoleType RT
ON URM.RoleTypeID = RT.RoleID
WHERE UserID= @userid
  
RETURN '<b>' +  @RoleList + '</b>'
  
END

GO
/****** Object:  UserDefinedFunction [dbo].[fn_ItemModelReturnReasonRuleStatus]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE FUNCTION [dbo].[fn_ItemModelReturnReasonRuleStatus](@RuleCode NVARCHAR(100), @ItemModelID INT, @ReasonID INT) 
RETURNS INT 
  
AS 
BEGIN  
DECLARE @IsActive BIT 

SELECT @IsActive = PRRR.isActive
FROM ItemModelReturnReasonRuleMap PRRR
INNER JOIN ItemModelReturnReasonMap PRR ON PRRR.ItemModelReturnReasonMapID = PRR.ItemModelReturnReasonMapID
INNER JOIN ReturnReasonRuleMap RRR ON RRR.ReturnReasonRuleMapID = PRRR.ReturnReasonRuleMapID
INNER JOIN Rules ON Rules.RuleID = RRR.RuleID
WHERE PRR.ItemModelID = @ItemModelID AND Rules.RuleCode = @RuleCode AND RRR.RMAActionCodeID= @ReasonID

RETURN ISNULL(@IsActive,0) 
  
END

GO
/****** Object:  UserDefinedFunction [dbo].[fn_LocationFullPath]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE Function [dbo].[fn_LocationFullPath]( @LocationId bigint) 
returns varchar(max)     
as   
  
Begin  
declare @ReturnDate as varchar(max)
declare @tmp varchar(max)
SET @tmp = '';
with name_tree as (
   select PartnerLocationId, parentPartnerLocationId, LocationCode
   from PartnerLocation
   where PartnerLocationId = @LocationId -- this is the starting point you want in your recursion
   union all
   select c.PartnerLocationId, c.parentPartnerLocationId, c.LocationCode
   from PartnerLocation c
     join name_tree p on p.parentPartnerLocationId = c.PartnerLocationId  -- this is the recursion
) 
--select *
--from name_tree
--where PartnerLocationId <> 1; 
select @tmp = @tmp + LocationCode + '' from name_tree order by PartnerLocationID


   
  
set @ReturnDate=@tmp--(select SUBSTRING(@tmp, 0, LEN(@tmp)))  
  
return(isnull(@ReturnDate,''))  
  
End

GO
/****** Object:  UserDefinedFunction [dbo].[fn_LocationGraph]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE Function [dbo].[fn_LocationGraph]( @LocationId bigint)   
  
returns varchar(max)   
  
as   
  
Begin  
declare @ReturnDate as varchar(max)
declare @tmp varchar(max)
SET @tmp = '';
with name_tree as (
   select PartnerLocationId, parentPartnerLocationId, LocationCode
   from PartnerLocation
   where PartnerLocationId = @LocationId -- this is the starting point you want in your recursion
   union all
   select c.PartnerLocationId, c.parentPartnerLocationId, c.LocationCode
   from PartnerLocation c
     join name_tree p on p.PartnerLocationId = c.parentPartnerLocationId  -- this is the recursion
) 
--select *
--from name_tree
--where PartnerLocationId <> 1; 
select @tmp = @tmp + cast(PartnerLocationId as varchar(max))  + ',' from name_tree order by PartnerLocationID


   
  
set @ReturnDate=(select SUBSTRING(@tmp, 0, LEN(@tmp)))  
  
return(isnull(@ReturnDate,''))  
  
End

GO
/****** Object:  UserDefinedFunction [dbo].[fn_parse_json2xml]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/*
Declare @data nvarchar(max)='{	"PickListHeaderID": "3","PickListNo": "PK000022","PickListDate": "2015-12-15T00:00:00","AccountID": "14","CreatedBy": "2","CreatedDate": "2016-01-07T06:06:48.570","ModifyBy": "2","ModifyDate": "2016-01-07T06:06:48.570","PickListDetail": [{	"RowNumber": "1","keyColumnID": "4","PickListDetailID": "4","PickListHeaderID": "3","SOHeaderID": "3","ItemMasterTypeMapID": "6","LocationID": "9","NodeID": "9","Quantity": "5.00"}, {"RowNumber": "2","keyColumnID": "3","PickListDetailID": "3","PickListHeaderID": "3","SOHeaderID": "3","ItemMasterTypeMapID": "7","LocationID": "8","NodeID": "8","Quantity": "25.00"}]}'
select dbo.fn_parse_json2xml(@data)
*/
CREATE FUNCTION [dbo].[fn_parse_json2xml](
    @json    varchar(max)
)
RETURNS xml
AS

BEGIN;
    DECLARE @output varchar(max), @key varchar(max), @value varchar(max),
        @recursion_counter int, @offset int, @nested bit, @array bit,
        @tab char(1)=CHAR(9), @cr char(1)=CHAR(13), @lf char(1)=CHAR(10);
		
		Set @json = REPLACE(@json, char(32), '@@X1@@')

    --- Clean up the JSON syntax by removing line breaks and tabs and
    --- trimming the results of leading and trailing spaces:
    SET @json=LTRIM(RTRIM(
        REPLACE(REPLACE(REPLACE(@json, @cr, ''), @lf, ''), @tab, '')));
			
    --- Sanity check: If this is not valid JSON syntax, exit here.
    IF (LEFT(@json, 1)!='{' OR RIGHT(@json, 1)!='}')
        RETURN '';

    --- Because the first and last characters will, by definition, be
    --- curly brackets, we can remove them here, and trim the result.
    SET @json=LTRIM(RTRIM(SUBSTRING(@json, 2, LEN(@json)-2)));

    SELECT @output='';
    WHILE (@json!='') BEGIN;

        --- Look for the first key which should start with a quote.
        IF (LEFT(@json, 1)!='"')
            RETURN 'Expected quote (start of key name). Found "'+
                LEFT(@json, 1)+'"';

        --- .. and end with the next quote (that isn't escaped with
        --- and backslash).
        SET @key=SUBSTRING(@json, 2,
            PATINDEX('%[^\\]"%', SUBSTRING(@json, 2, LEN(@json))+' "'));

        --- Truncate @json with the length of the key.
        SET @json=LTRIM(RTRIM(SUBSTRING(@json, LEN(@key)+3, LEN(@json))));

        --- The next character should be a colon.
        IF (LEFT(@json, 1)!=':')
            RETURN 'Expected ":" after key name, found "'+
                LEFT(@json, 1)+'"!';

        --- Truncate @json to skip past the colon:
        SET @json=LTRIM(RTRIM(SUBSTRING(@json, 2, LEN(@json))));

        --- If the next character is an angle bracket, this is an array.
        IF (LEFT(@json, 1)='[')
            SELECT @array=1, @json=LTRIM(RTRIM(SUBSTRING(@json, 2, LEN(@json))));

        IF (@array IS NULL) SET @array=0;
        WHILE (@array IS NOT NULL) BEGIN;

            SELECT @value=NULL, @nested=0;
            --- The first character of the remainder of @json indicates
            --- what type of value this is.

            --- Set @value, depending on what type of value we're looking at:
            ---
            --- 1. A new JSON object:
            ---    To be sent recursively back into the parser:
            IF (@value IS NULL AND LEFT(@json, 1)='{') BEGIN;
                SELECT @recursion_counter=1, @offset=1;
                WHILE (@recursion_counter!=0 AND @offset<LEN(@json)) BEGIN;
                    SET @offset=@offset+
                        PATINDEX('%[{}]%', SUBSTRING(@json, @offset+1,
                            LEN(@json)));
                    SET @recursion_counter=@recursion_counter+
                        (CASE SUBSTRING(@json, @offset, 1)
                            WHEN '{' THEN 1
                            WHEN '}' THEN -1 END);
                END;

                SET @value=CAST(
                    dbo.fn_parse_json2xml(LEFT(@json, @offset))
                        AS varchar(max));
                SET @json=SUBSTRING(@json, @offset+1, LEN(@json));
                SET @nested=1;
            END

            --- 2a. Blank text (quoted)
            IF (@value IS NULL AND LEFT(@json, 2)='""')
                SELECT @value='', @json=LTRIM(RTRIM(SUBSTRING(@json, 3,
                    LEN(@json))));

            --- 2b. Other text (quoted, but not blank)
            IF (@value IS NULL AND LEFT(@json, 1)='"') BEGIN;
                SET @value=SUBSTRING(@json, 2,
                    PATINDEX('%[^\\]"%',
                        SUBSTRING(@json, 2, LEN(@json))+' "'));
                SET @json=LTRIM(RTRIM(
                    SUBSTRING(@json, LEN(@value)+3, LEN(@json))));
            END;

            --- 3. Blank (not quoted)
            IF (@value IS NULL AND LEFT(@json, 1)=',')
                SET @value='';

            --- 4. Or unescaped numbers or text.
            IF (@value IS NULL) BEGIN;
                SET @value=LEFT(@json,
                    PATINDEX('%[,}]%', REPLACE(@json, ']', '}')+'}')-1);
                SET @json=SUBSTRING(@json, LEN(RTRIM(LTRIM(@value)))+1, LEN(RTRIM(LTRIM(@json))));
            END;

            --Append @key and @value to @output:
            SET @output=@output+@lf+@cr+
                REPLICATE(@tab, @@NESTLEVEL-1)+
                '<'+@key+'>'+
                    ISNULL(REPLACE(
                        REPLACE(@value, '\"', '"'), '\\', '\'), '')+
                    (CASE WHEN @nested=1
                        THEN @lf+@cr+REPLICATE(@tab, @@NESTLEVEL-1)
                        ELSE ''
                    END)+
                '</'+@key+'>';			

            --- And again, error checks:
            ---
            --- 1. If these are multiple values, the next character
            ---    should be a comma:
            IF (@array=0 AND @json!='' AND LEFT(@json, 1)!=',')
                RETURN @output+'Expected "," after value, found "'+
                    LEFT(@json, 1)+'"!';

            --- 2. .. or, if this is an array, the next character
            --- should be a comma or a closing angle bracket:
            IF (@array=1 AND LEFT(@json, 1) NOT IN (',', ']'))
                RETURN @output+'In array, expected "]" or "," after '+
                    'value, found "'+LEFT(@json, 1)+'"!';

            --- If this is where the array is closed (i.e. if it's a
            --- closing angle bracket)..
            IF (@array=1 AND LEFT(@json, 1)=']') BEGIN;
                SET @array=NULL;
                SET @json=LTRIM(RTRIM(SUBSTRING(@json, 2, LEN(@json))));

                --- After a closed array, there should be a comma:
                IF (LEFT(@json, 1) NOT IN ('', ',')) BEGIN
                    RETURN 'Closed array, expected ","!';
                END;
            END;

            SET @json=LTRIM(RTRIM(SUBSTRING(@json, 2, LEN(@json)+1)));
            IF (@array=0) SET @array=NULL;

        END;
    END;

	Set @output = REPLACE(@output,'@@X1@@', char(32))

    --- Return the output:
    RETURN CAST(@output AS xml);
END;

GO
/****** Object:  UserDefinedFunction [dbo].[fn_ParseText2Table]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   function [dbo].[fn_ParseText2Table]   
 (  
 @p_SourceText  varchar(8000)  
 ,@p_Delimeter varchar(100) = ',' --default to comma delimited.  
 )  
RETURNS @retTable TABLE   
 (  
  Position  int identity(1,1)  
 ,Int_Value int   
 ,Num_value Numeric(18,3)  
 ,txt_value varchar(2000)  
 )  
AS  
  
BEGIN  
 DECLARE @w_Continue  int  
  ,@w_StartPos  int  
  ,@w_Length  int  
  ,@w_Delimeter_pos int  
  ,@w_tmp_int  int  
  ,@w_tmp_num  numeric(18,3)  
  ,@w_tmp_txt   varchar(2000)  
  ,@w_Delimeter_Len tinyint  
 if len(@p_SourceText) = 0  
 begin  
  SET  @w_Continue = 0 -- force early exit  
 end   
 else  
 begin  
 -- parse the original @p_SourceText array into a temp table  
  SET  @w_Continue = 1  
  SET @w_StartPos = 1  
  SET @p_SourceText = RTRIM( LTRIM( @p_SourceText))  
  SET @w_Length   = DATALENGTH( RTRIM( LTRIM( @p_SourceText)))  
  SET @w_Delimeter_Len = len(@p_Delimeter)  
 end  
 WHILE @w_Continue = 1  
 BEGIN  
  SET @w_Delimeter_pos = CHARINDEX( @p_Delimeter  
      ,(SUBSTRING( @p_SourceText, @w_StartPos  
      ,((@w_Length - @w_StartPos) + @w_Delimeter_Len)))  
      )  
   
  IF @w_Delimeter_pos > 0  -- delimeter(s) found, get the value  
  BEGIN  
   SET @w_tmp_txt = LTRIM(RTRIM( SUBSTRING( @p_SourceText, @w_StartPos   
        ,(@w_Delimeter_pos - 1)) ))  
   if isnumeric(@w_tmp_txt) = 1  
   begin  
    set @w_tmp_int = cast( cast(@w_tmp_txt as numeric) as int)  
    set @w_tmp_num = cast( @w_tmp_txt as numeric(18,3))  
   end  
   else  
   begin  
    set @w_tmp_int =  null  
    set @w_tmp_num =  null  
   end  
   SET @w_StartPos = @w_Delimeter_pos + @w_StartPos + (@w_Delimeter_Len- 1)  
  END  
  ELSE -- No more delimeters, get last value  
  BEGIN  
   SET @w_tmp_txt = LTRIM(RTRIM( SUBSTRING( @p_SourceText, @w_StartPos   
      ,((@w_Length - @w_StartPos) + @w_Delimeter_Len)) ))  
   if isnumeric(@w_tmp_txt) = 1  
   begin  
    set @w_tmp_int = cast( cast(@w_tmp_txt as numeric) as int)  
    set @w_tmp_num = cast( @w_tmp_txt as numeric(18,3))  
   end  
   else  
   begin  
    set @w_tmp_int =  null  
    set @w_tmp_num =  null  
   end  
   SELECT @w_Continue = 0  
  END  
  INSERT INTO @retTable VALUES( @w_tmp_int, @w_tmp_num, @w_tmp_txt )  
 END  
RETURN  
END
GO
/****** Object:  UserDefinedFunction [dbo].[fn_ReturnReasonRuleStatus]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 


CREATE FUNCTION [dbo].[fn_ReturnReasonRuleStatus](@RuleCode NVARCHAR(100), @PartnerID INT, @ReasonID INT) 
RETURNS INT 
  
AS 
BEGIN  
DECLARE @IsActive BIT 

SELECT @IsActive = PRRR.isActive
FROM PartnerReturnReasonRuleMap PRRR
INNER JOIN PartnerReturnReasonMap PRR ON PRRR.PartnerReturnReasonMapID = PRR.PartnerReturnReasonMapID
INNER JOIN ReturnReasonRuleMap RRR ON RRR.ReturnReasonRuleMapID = PRRR.ReturnReasonRuleMapID
INNER JOIN Rules ON Rules.RuleID = RRR.RuleID
WHERE PRR.PartnerID = @PartnerID AND Rules.RuleCode = @RuleCode AND RRR.RMAActionCodeID= @ReasonID

RETURN ISNULL(@IsActive,0) 
  
END

GO
/****** Object:  UserDefinedFunction [dbo].[fn_RMACarrrier]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE Function [dbo].[fn_RMACarrrier]( @ItemNumber nvarchar(100))   
  
returns varchar(100) 
  
as   
  
Begin  
declare @ReturnDate as varchar(max)    
  

  

set @ReturnDate=(select top 1 TLU.TypeName from SalesReturnOrderDetail SROD inner join
SalesReturnOrderHeader SROH on SROD.SalesReturnOrderHeaderID=SROH.SalesReturnOrderHeaderID
left join TypeLookUp TLU on TLU.TypeLookUpID=SROD.CarrierID  where SROH.RMASource='Customer'
and ItemInfoID in 
  (select II.ItemInfoID from ItemMaster IM inner join ItemInfo II on IM.ItemMasterID=II.ItemMasterID
  where IM.ItemNumber=@ItemNumber) order by  SROD.SalesReturnOrderDetailID desc)
  
return @ReturnDate 
  
End

GO
/****** Object:  UserDefinedFunction [dbo].[fn_RMAContainer]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE FUNCTION [dbo].[fn_RMAContainer]( @RefDetailID INT) 
RETURNS VARCHAR(100) 
AS 
BEGIN  
DECLARE @Container AS VARCHAR(100)      

SET @Container=(SELECT TOP 1 Container 
				FROM InBoundItemContextHistory I LEFT OUTER JOIN MRNHeader M
				ON I.MRNHeaderID = M.MRNHeaderID
				WHERE MRNTypeID =641 AND RefDetailID = @RefDetailID ORDER BY I.CreatedDate DESC)
  
RETURN @Container 
  
End

GO
/****** Object:  UserDefinedFunction [dbo].[fn_RMACreatedDate]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE Function [dbo].[fn_RMACreatedDate]( @ItemNumber nvarchar(100))   
  
returns varchar(100) 
  
as   
  
Begin  
declare @ReturnDate as varchar(max)    
  

  

set @ReturnDate=(select top 1 convert(varchar, SROD.CreatedDate,101) from SalesReturnOrderDetail SROD inner join
SalesReturnOrderHeader SROH on SROD.SalesReturnOrderHeaderID=SROH.SalesReturnOrderHeaderID  where SROH.RMASource='Customer'
and ItemInfoID in 
  (select II.ItemInfoID from ItemMaster IM inner join ItemInfo II on IM.ItemMasterID=II.ItemMasterID
  where IM.ItemNumber=@ItemNumber) order by  SROD.SalesReturnOrderDetailID desc)
  
return @ReturnDate 
  
End

GO
/****** Object:  UserDefinedFunction [dbo].[fn_RMAItemApprover]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 


CREATE FUNCTION [dbo].[fn_RMAItemApprover]()    
RETURNS @RMAApprover TABLE (    
   TypeLookUpID   int,    
   TypeName   VARCHAR(200),    
   ApprovalRoleID int,    
   SalesReturnActionID int,    
   SalesReturnOrderDetailID int    
)     
AS    
BEGIN    
   INSERT INTO @RMAApprover (TypeLookUpID, TypeName, ApprovalRoleID,SalesReturnActionID, SalesReturnOrderDetailID)    
   select distinct * from    
 (SELECT  tl.TypeLookupID AS TypeLookUpID    
  ,tl.TypeName,sra.ApprovalRoleID, SalesReturnActionID, sra.SalesReturnOrderDetailID    
 FROM SalesReturnAction sra    
 LEFT JOIN TypeLookup tl ON tl.TypeLookupID = sra.ApprovalTypeID    
 WHERE isApproved IS NULL and SalesReturnActionID in   
 (Select Min(SalesReturnActionID) from SalesReturnAction WHERE isApproved IS NULL Group By SalesReturnOrderDetailID))X--sra.SalesReturnOrderDetailID = @SalesReturnOrderDetailID AND     
      
   RETURN;    
END

GO
/****** Object:  UserDefinedFunction [dbo].[fn_RMAItemNeedApproval]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE FUNCTION [dbo].[fn_RMAItemNeedApproval](@SRODetailId INT, @UserId INT) 
RETURNS INT 
  
AS 
BEGIN  
DECLARE @ApprovalStatus BIT, @ApprovalRequired BIT, @RejectStatus BIT, @NeedApproval INT = 0 ,
@ParentPartnerID INT, @PartnerID INT, @Source NVARCHAR(50), @ReturnPartnerID INT 

SET @ApprovalStatus = (SELECT [dbo].[UDF_WF_ReturnApprovals](@SRODetailId))
SET @ApprovalRequired =(select [dbo].[UDF_WF_ReturnApprovalRequired](@SRODetailId))
SET @RejectStatus = (select [dbo].[UDF_WF_ReturnRejects](@SRODetailId))

SELECT @PartnerID = SalesReturnOrderHeader.FromAccountID, @ReturnPartnerID = SalesReturnOrderHeader.ToPartnerID, @Source = SalesReturnOrderHeader.RMASource
FROM SalesReturnOrderDetail 
INNER JOIN ItemInfo ON ItemInfo.ItemInfoID = SalesReturnOrderDetail.ItemInfoID
INNER JOIN ItemMaster ON ItemMaster.ItemMasterID = ItemInfo.ItemMasterID
INNER JOIN SalesReturnOrderHeader ON SalesReturnOrderHeader.SalesReturnOrderHeaderID = SalesReturnOrderDetail.SalesReturnOrderHeaderID
WHERE SalesReturnOrderDetailID = @SRODetailId

	IF EXISTS(SELECT 1 FROM Users U 
	Inner Join UserRoleMap URM ON URM.UserID = U.UserID
	INNER JOIN partneruserrolemap pmap ON pmap.UserRoleMapID = URM.UserRoleMapID
	INNER JOIN [dbo].[fn_RMAItemApprover]() A ON A.ApprovalRoleID = URM.RoleTypeID
	WHERE pmap.PartnerID = @ReturnPartnerID AND URM.UserID = @UserId) 
AND EXISTS(Select Distinct RMF.ModuleFunctionId from RoleModuleFunction RMF 
		Inner Join UserRoleMap URM on RMF.RoleTypeId = URM.RoleTypeID 
		Inner Join partneruserrolemap pmap on pmap.UserRoleMapId = URM.UserRoleMapID and pmap.PartnerId=@ReturnPartnerID
		Inner Join ModuleFunction MF on MF.ModuleFunctionID = RMF.ModuleFunctionID  AND MF.isActive = 1
		where UserID = @UserID  and (MF.FunctionType ='Approve RMA' ) and MF.ModuleID in (63,2300) and rmf.IsApplicable=1)
		BEGIN
			SET @NeedApproval = (SELECT CASE WHEN @ApprovalRequired = CAST(1 AS BIT) AND @ApprovalStatus = CAST(0 AS BIT) AND @RejectStatus = CAST(0 AS BIT) THEN 1 ELSE 0 END AS NeedApproval)
		END
RETURN @NeedApproval 
  
END

GO
/****** Object:  UserDefinedFunction [dbo].[fn_RMANumber]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 


CREATE Function [dbo].[fn_RMANumber]( @ItemNumber nvarchar(100))   
  
returns varchar(100) 
  
as   
  
Begin  
declare @ReturnDate as varchar(max)    
  

  

set @ReturnDate=(select top 1 TenantReferenceNumber from SalesReturnOrderDetail SROD inner join
SalesReturnOrderHeader SROH on SROD.SalesReturnOrderHeaderID=SROH.SalesReturnOrderHeaderID  where SROH.RMASource='Customer'
and ItemInfoID in 
  (select II.ItemInfoID from ItemMaster IM inner join ItemInfo II on IM.ItemMasterID=II.ItemMasterID
  where IM.ItemNumber=@ItemNumber) order by  SROD.SalesReturnOrderDetailID desc)
  
return @ReturnDate 
  

End

GO
/****** Object:  UserDefinedFunction [dbo].[fn_SalesReturnOrderDetailID]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 


CREATE FUNCTION [dbo].[fn_SalesReturnOrderDetailID](@ItemNumber nvarchar(100), @SONumber nvarchar(400))
RETURNS VARCHAR(100)
AS 
 
BEGIN 
DECLARE @SalesReturnOrderDetailID AS VARCHAR(MAX)   

SET @SalesReturnOrderDetailID=(SELECT TOP 1 SalesReturnOrderDetailID 
FROM SalesReturnOrderDetail SROD INNER JOIN SalesReturnOrderHeader SROH 
ON SROD.SalesReturnOrderHeaderID=SROH.SalesReturnOrderHeaderID  
WHERE SROH.RMASource='Customer' AND SROD.SOHeaderID = (SELECT SOHeaderID FROM SOHeader WHERE SONumber= @SONumber)
AND ItemInfoID in (SELECT II.ItemInfoID FROM ItemMaster IM INNER JOIN ItemInfo II ON IM.ItemMasterID=II.ItemMasterID
WHERE IM.ItemNumber=@ItemNumber) ORDER BY  SROD.SalesReturnOrderDetailID DESC)
  
RETURN @SalesReturnOrderDetailID 
END

GO
/****** Object:  UserDefinedFunction [dbo].[fn_test]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE FUNCTION [dbo].[fn_test](@UserID int, @PartnerID int)
RETURNS @trackingItems TABLE (
   Id       int      NOT NULL,
   PartnerID       int      NOT NULL,
   Issued   date     NOT NULL   
) 
AS
BEGIN
   INSERT INTO @trackingItems (Id,PartnerID, Issued)
   SELECT @UserID,@PartnerID,getdate()
   
    INSERT INTO @trackingItems (Id,PartnerID, Issued)
    SELECT @UserID,@PartnerID,getdate() 
  
   RETURN;
END;

GO
/****** Object:  UserDefinedFunction [dbo].[fn_TestXML]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 CREATE FUNCTION [dbo].[fn_TestXML](
    @json    varchar(max)
)
RETURNS xml
AS

BEGIN;
    DECLARE @output varchar(max), @key varchar(max), @value varchar(max),
        @recursion_counter int, @offset int, @nested bit, @array bit,
        @tab char(1)=CHAR(9), @cr char(1)=CHAR(13), @lf char(1)=CHAR(10);

    --- Clean up the JSON syntax by removing line breaks and tabs and
    --- trimming the results of leading and trailing spaces:
    SET @json=LTRIM(RTRIM(
        REPLACE(REPLACE(REPLACE(@json, @cr, ''), @lf, ''), @tab, '')));
			
    --- Sanity check: If this is not valid JSON syntax, exit here.
    IF (LEFT(@json, 1)!='{' OR RIGHT(@json, 1)!='}')
        RETURN '';

    --- Because the first and last characters will, by definition, be
    --- curly brackets, we can remove them here, and trim the result.
    SET @json=LTRIM(RTRIM(SUBSTRING(@json, 2, LEN(@json)-2)));

    SELECT @output='';
    WHILE (@json!='') BEGIN;

        --- Look for the first key which should start with a quote.
        IF (LEFT(@json, 1)!='"')
            RETURN 'Expected quote (start of key name). Found "'+
                LEFT(@json, 1)+'"';

        --- .. and end with the next quote (that isn't escaped with
        --- and backslash).
        SET @key=SUBSTRING(@json, 2,
            PATINDEX('%[^\\]"%', SUBSTRING(@json, 2, LEN(@json))+' "'));

        --- Truncate @json with the length of the key.
        SET @json=LTRIM(RTRIM(SUBSTRING(@json, LEN(@key)+3, LEN(@json))));

        --- The next character should be a colon.
        IF (LEFT(@json, 1)!=':')
            RETURN 'Expected ":" after key name, found "'+
                LEFT(@json, 1)+'"!';

        --- Truncate @json to skip past the colon:
        SET @json=LTRIM(RTRIM(SUBSTRING(@json, 2, LEN(@json))));

        --- If the next character is an angle bracket, this is an array.
        IF (LEFT(@json, 1)='[')
            SELECT @array=1, @json=LTRIM(RTRIM(SUBSTRING(@json, 2, LEN(@json))));

        IF (@array IS NULL) SET @array=0;
        WHILE (@array IS NOT NULL) BEGIN;

            SELECT @value=NULL, @nested=0;
            --- The first character of the remainder of @json indicates
            --- what type of value this is.

            --- Set @value, depending on what type of value we're looking at:
            ---
            --- 1. A new JSON object:
            ---    To be sent recursively back into the parser:
            IF (@value IS NULL AND LEFT(@json, 1)='{') BEGIN;
                SELECT @recursion_counter=1, @offset=1;
                WHILE (@recursion_counter!=0 AND @offset<LEN(@json)) BEGIN;
                    SET @offset=@offset+
                        PATINDEX('%[{}]%', SUBSTRING(@json, @offset+1,
                            LEN(@json)));
                    SET @recursion_counter=@recursion_counter+
                        (CASE SUBSTRING(@json, @offset, 1)
                            WHEN '{' THEN 1
                            WHEN '}' THEN -1 END);
                END;

                SET @value=CAST(
                    dbo.fn_parse_json2xml(LEFT(@json, @offset))
                        AS varchar(max));
                SET @json=SUBSTRING(@json, @offset+1, LEN(@json));
                SET @nested=1;
            END

            --- 2a. Blank text (quoted)
            IF (@value IS NULL AND LEFT(@json, 2)='""')
                SELECT @value='', @json=LTRIM(RTRIM(SUBSTRING(@json, 3,
                    LEN(@json))));

            --- 2b. Other text (quoted, but not blank)
            IF (@value IS NULL AND LEFT(@json, 1)='"') BEGIN;
                SET @value=SUBSTRING(@json, 2,
                    PATINDEX('%[^\\]"%',
                        SUBSTRING(@json, 2, LEN(@json))+' "'));
                SET @json=LTRIM(RTRIM(
                    SUBSTRING(@json, LEN(@value)+3, LEN(@json))));
            END;

            --- 3. Blank (not quoted)
            IF (@value IS NULL AND LEFT(@json, 1)=',')
                SET @value='';

            --- 4. Or unescaped numbers or text.
            IF (@value IS NULL) BEGIN;
                SET @value=LEFT(@json,
                    PATINDEX('%[,}]%', REPLACE(@json, ']', '}')+'}')-1);
                SET @json=SUBSTRING(@json, LEN(RTRIM(LTRIM(@value)))+1, LEN(RTRIM(LTRIM(@json))));
            END;

            --Append @key and @value to @output:
            SET @output=@output+@lf+@cr+
                REPLICATE(@tab, @@NESTLEVEL-1)+
                '<'+@key+'>'+
                    ISNULL(REPLACE(
                        REPLACE(RTRIM(LTRIM(@value)), '\"', '"'), '\\', '\'), '')+
                    (CASE WHEN @nested=1
                        THEN @lf+@cr+REPLICATE(@tab, @@NESTLEVEL-1)
                        ELSE ''
                    END)+
                '</'+@key+'>';			

            --- And again, error checks:
            ---
            --- 1. If these are multiple values, the next character
            ---    should be a comma:
            IF (@array=0 AND @json!='' AND LEFT(@json, 1)!=',')
                RETURN @output+'Expected "," after value, found "'+
                    LEFT(@json, 1)+'"!';

            --- 2. .. or, if this is an array, the next character
            --- should be a comma or a closing angle bracket:
            IF (@array=1 AND LEFT(@json, 1) NOT IN (',', ']'))
                RETURN @output+'In array, expected "]" or "," after '+
                    'value, found "'+LEFT(@json, 1)+'"!';

            --- If this is where the array is closed (i.e. if it's a
            --- closing angle bracket)..
            IF (@array=1 AND LEFT(@json, 1)=']') BEGIN;
                SET @array=NULL;
                SET @json=LTRIM(RTRIM(SUBSTRING(@json, 2, LEN(@json))));

                --- After a closed array, there should be a comma:
                IF (LEFT(@json, 1) NOT IN ('', ',')) BEGIN
                    RETURN 'Closed array, expected ","!';
                END;
            END;

            SET @json=LTRIM(RTRIM(SUBSTRING(@json, 2, LEN(@json)+1)));
            IF (@array=0) SET @array=NULL;

        END;
    END;

    --- Return the output:
    RETURN CAST(@output AS xml);
END;

GO
/****** Object:  UserDefinedFunction [dbo].[fn_TrackingNumber]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE Function [dbo].[fn_TrackingNumber]( @ItemNumber nvarchar(100))   
  
returns varchar(100) 
  
as   
  
Begin  
declare @ReturnDate as varchar(max)    
  

  

set @ReturnDate=(select top 1 ShippingNumber from SalesReturnOrderDetail SROD inner join
SalesReturnOrderHeader SROH on SROD.SalesReturnOrderHeaderID=SROH.SalesReturnOrderHeaderID  where
 SROH.RMASource='Customer' and  ItemInfoID in 
  (select II.ItemInfoID from ItemMaster IM inner join ItemInfo II on IM.ItemMasterID=II.ItemMasterID
  where IM.ItemNumber=@ItemNumber) order by  SROD.SalesReturnOrderDetailID desc)
  
return @ReturnDate 
  
End

GO
/****** Object:  UserDefinedFunction [dbo].[fn_TrackingURL]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE Function [dbo].[fn_TrackingURL]( @ItemNumber nvarchar(100))   
  
returns varchar(100) 
  
as   
  
Begin  
declare @ReturnDate as varchar(max)    
  

  

set @ReturnDate=(select top 1 ShippingLabelURL from SalesReturnOrderDetail SROD inner join
SalesReturnOrderHeader SROH on SROD.SalesReturnOrderHeaderID=SROH.SalesReturnOrderHeaderID  where SROH.RMASource='Customer'
and ItemInfoID in 
  (select II.ItemInfoID from ItemMaster IM inner join ItemInfo II on IM.ItemMasterID=II.ItemMasterID
  where IM.ItemNumber=@ItemNumber)order by  SROD.SalesReturnOrderDetailID desc )
  
return @ReturnDate 
  
End

GO
/****** Object:  UserDefinedFunction [dbo].[fun_AddressByID]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [dbo].[fun_AddressByID](@AddressID INT) returns NVARCHAR(1000)
AS
BEGIN
	RETURN (SELECT Address1 + ' ' + isnull(Address2, '') + ' ' + City +' '+ StateName+ '-'+ZipCode
	FROM [Address] a INNER JOIN [State] s ON s.StateID = a.StateID
	WHERE AddressID = @AddressID)
END

GO
/****** Object:  UserDefinedFunction [dbo].[fun_AddressdetailByID]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE FUNCTION [dbo].[fun_AddressdetailByID](@AddressID INT)       
    returns @temptable TABLE (AddressID INT, Address1 nvarchar(200), Address2  nvarchar(200), City  nvarchar(200), StateID INT, StateName  nvarchar(200), ZipCode  nvarchar(200))       
    as       
    begin       
     Insert into @temptable SELECT AddressID, Address1, Address2, City, a.StateID, StateName, ZipCode
		FROM [Address] a INNER JOIN [State] s ON s.StateID = a.StateID
		WHERE AddressID = @AddressID       
    return       
    end

GO
/****** Object:  UserDefinedFunction [dbo].[fun_Authorization]    Script Date: 25-05-2020 09:07:44 ******/
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


CREATE FUNCTION [dbo].[fun_Authorization](
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

GO
/****** Object:  UserDefinedFunction [dbo].[fun_getCustomerOrderWithRemainingItems]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
CREATE FUNCTION [dbo].[fun_getCustomerOrderWithRemainingItems](  
    @logID INT, @access_codes NVARCHAR(MAX),@brand_code nvarchar(max),@return_number nvarchar(max)
)  
RETURNS NVARCHAR(MAX)  
AS  
BEGIN    

	DECLARE @ReturnDays INT,@PartnerId int
	SELECT @ReturnDays=ISNULL(ContactName,0), @PartnerId=PartnerID FROM Partners WHERE IsActive=1 AND PartnerCode=@brand_code

	IF EXISTS( SELECT * FROM SeasonalConfig WHERE IsActive=1 AND PartnerId = @PartnerId AND CONVERT(DATETIME,CONVERT(CHAR(10),GETUTCDATE(),101),101) BETWEEN CONVERT(DATETIME,CONVERT(CHAR(10),fromDate,101),101) AND CONVERT(DATETIME,CONVERT(CHAR(10),toDate,101),101) )
	BEGIN
		SELECT @ReturnDays=ISNULL(sc.ReturnReason,@ReturnDays) 
		FROM SeasonalConfig sc LEFT JOIN Partners ptr ON ptr.PartnerID = sc.PartnerId 
		WHERE sc.IsActive=1 AND sc.PartnerId = @PartnerId 
		AND CONVERT(DATETIME,CONVERT(CHAR(10),GETUTCDATE(),101),101) BETWEEN CONVERT(DATETIME,CONVERT(CHAR(10),fromDate,101),101) AND CONVERT(DATETIME,CONVERT(CHAR(10),toDate,101),101) 
	END 

	DECLARE @payload_final NVARCHAR(MAX), @items NVARCHAR(MAX), @temp_items NVARCHAR(MAX), @extra nvarchar(max)
	SELECT @payload_final=payload, @items = items FROM inbound_log WHERE id = @logID
	SELECT @temp_items=[dbo].[fun_getRemainingItems](@logID,@access_codes,@brand_code,0,@ReturnDays,@return_number)
	
RETURN (
	SELECT JSON_MODIFY(json_query(@payload_final, '$'),'$.items',@temp_items) as payload
	)  
END

GO
/****** Object:  UserDefinedFunction [dbo].[fun_getRemainingItems]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
CREATE FUNCTION [dbo].[fun_getRemainingItems](  
    @logID INT, @access_codes NVARCHAR(MAX),@brand_code nvarchar(max),@is_first_hit bit,@ReturnDays int
)  
RETURNS NVARCHAR(MAX)  
AS  
BEGIN    
	DECLARE @payload_final NVARCHAR(MAX), @items NVARCHAR(MAX), @temp_items NVARCHAR(MAX), @extra nvarchar(max)
	SELECT @payload_final=payload, @items = items FROM inbound_log WHERE id = @logID

	DECLARE @TEMP table 
	(
	id NVARCHAR(200) , 
	EAN NVARCHAR(1000) , 
	[name] NVARCHAR(1000) , 
	[description] NVARCHAR(max), 
	image_url NVARCHAR(max) ,
	default_image NVARCHAR(MAX),
	quantity INT,	
	return_quantity INT,
	shipped_quantity INT,
	unit_price_amount NVARCHAR(1000) , 
	shipment_id NVARCHAR(100),
	reason_category NVARCHAR(MAX),
	extra NVARCHAR(MAX) , 
	specifics NVARCHAR(MAX),
	is_actionable bit,
	return_days INT
	);
	insert into @TEMP 
	SELECT 
	id ,
	EAN ,
	[name] ,
	[description] ,
	image_url ,

	CASE 
	WHEN @brand_code = 'ARC' THEN 'assets/img/brands/ARC.png'
	WHEN @brand_code = 'ARM' THEN 'assets/img/brands/ARM.png'
	WHEN @brand_code = 'ATO' THEN 'assets/img/brands/ATO.png'
	WHEN @brand_code = 'SAL' THEN 'assets/img/brands/SAL.png'
	WHEN @brand_code = 'SUU' THEN 'assets/img/brands/SUU.png'
	WHEN @brand_code = 'WIL' THEN 'assets/img/brands/WIL.png'
	END,

	CASE 
	WHEN EXISTS (SELECT TOP 1 rd.status_id FROM return_detail rd INNER JOIN return_header rh ON rh.return_header_id=rd.return_header_id WHERE product_id=id and rh.order_number=JSON_VALUE(@payload_final,'$.order_number') AND rd.status_id IN (SELECT typelookupId FROM typeLookup WHERE typeCode IN ('Received','Closed',CASE WHEN @is_first_hit=CAST(0 as BIT) THEN 'Scanned' ELSE '' END) ))
	THEN
		CASE
		WHEN ISNULL((SELECT SUM(rd.return_qty) FROM return_detail rd INNER JOIN return_header rh ON rh.return_header_id=rd.return_header_id WHERE product_id=id and rh.order_number=JSON_VALUE(@payload_final,'$.order_number') AND rd.status_id IN(SELECT typelookupId FROM typeLookup WHERE typeCode in ('Received','Closed',CASE WHEN @is_first_hit=CAST(0 as BIT) THEN 'Scanned' ELSE '' END) )),0)<CAST(ISNULL(quantity,0) AS INT)
		THEN
			CAST(ISNULL(quantity,0) AS INT) - ISNULL((SELECT SUM(rd.return_qty) FROM return_detail rd INNER JOIN return_header rh ON rh.return_header_id=rd.return_header_id WHERE product_id=id and rh.order_number=JSON_VALUE(@payload_final,'$.order_number') AND rd.status_id IN (SELECT typelookupId FROM typeLookup WHERE typeCode in ('Received','Closed',CASE WHEN @is_first_hit=CAST(0 as BIT) THEN 'Scanned' ELSE '' END) )),0)
		ELSE
			0
		END 
	ELSE
	CAST(ISNULL(quantity,0) AS INT)
	END
	quantity,
	CASE 
	WHEN EXISTS (SELECT TOP 1 rd.status_id FROM return_detail rd INNER JOIN return_header rh ON rh.return_header_id=rd.return_header_id WHERE product_id=id and rh.order_number=JSON_VALUE(@payload_final,'$.order_number') AND rd.status_id IN (SELECT typelookupId FROM typeLookup WHERE typeCode IN ('Received','Closed',CASE WHEN @is_first_hit=CAST(0 as BIT) THEN 'Scanned' ELSE '' END)))
	THEN
		CASE
		WHEN ISNULL((SELECT SUM(rd.return_qty) FROM return_detail rd INNER JOIN return_header rh ON rh.return_header_id=rd.return_header_id WHERE product_id=id and rh.order_number=JSON_VALUE(@payload_final,'$.order_number') AND rd.status_id IN (SELECT typelookupId FROM typeLookup WHERE typeCode IN ('Received','Closed',CASE WHEN @is_first_hit=CAST(0 as BIT) THEN 'Scanned' ELSE '' END) )),0)<CAST(ISNULL(return_quantity,0) AS INT)
		THEN
			CAST(ISNULL(return_quantity,0) AS INT) - ISNULL((SELECT SUM(rd.return_qty) FROM return_detail rd INNER JOIN return_header rh ON rh.return_header_id=rd.return_header_id WHERE product_id=id and rh.order_number=JSON_VALUE(@payload_final,'$.order_number') AND rd.status_id IN (SELECT typelookupId FROM typeLookup WHERE typeCode IN ('Received','Closed',CASE WHEN @is_first_hit=CAST(0 as BIT) THEN 'Scanned' ELSE '' END) )),0)
		ELSE
			0
		END
	ELSE
	CAST(ISNULL(return_quantity,0) AS INT)
	END
	return_quantity,
	return_quantity as shipped_quantity,
	unit_price_amount,
	shipment_id,
	CASE WHEN @brand_code = 'SAL' THEN [dbo].[udf_returns_category](reason_category) ELSE 'Default' END,
	--CASE WHEN @brand_code = 'SAL' THEN reason_category ELSE 'Default' END,
	extra,
	specifics,
	CASE WHEN 
	(
	(
	(ISNULL(JSON_VALUE(ISNULL(extra,'{}'),'$.returnable'),'Y')='Y' and CAST(ISNULL(TRIM(JSON_VALUE(ISNULL(extra,'{}'),'$.ski_binding')),'false') as BIT)<>CAST('true' as BIT) and CAST(ISNULL(TRIM(JSON_VALUE(ISNULL(extra,'{}'),'$.customized')),'false') as BIT)<>CAST('true' as BIT) and CAST(ISNULL(TRIM(JSON_VALUE(ISNULL(extra,'{}'),'$.stringing')),'false') as BIT)<>CAST('true' as BIT) )
	OR (SELECT 1 FROM OPENJSON(@access_codes) WHERE JSON_VALUE(value,'$.FunctionType') like '%Override Restricted Item%')=1
	)
	--AND ISNULL(quantity,0)>0
	) then 1 
	else 0 
	END,
	CASE WHEN @brand_code='WIL' AND CAST(1 AS BIT) = CAST(ISNULL(TRIM(JSON_VALUE(ISNULL(extra,'{}'),'$.demo_product')),'false') as BIT)
	THEN
		30
	ELSE
		@ReturnDays
	END

	FROM OPENJSON(@items)
	WITH (
	id NVARCHAR(200) '$.id', 
	EAN NVARCHAR(1000) '$.ean',
	[name] NVARCHAR(1000) '$.name', 
	[description] NVARCHAR(1000) '$.description', 
	image_url NVARCHAR(MAX) '$.image_url', 
	quantity NVARCHAR(1000) '$.quantity_shipped', 
	return_quantity NVARCHAR(1000) '$.quantity_shipped', 
	unit_price_amount NVARCHAR(1000) '$.unit_price_amount',  
	shipment_id NVARCHAR(100) '$.shipment_id', 
	reason_category NVARCHAR(MAX) '$.reason_category', 
	extra NVARCHAR(MAX) '$.extra' as JSON, 
	specifics NVARCHAR(MAX) '$.specifics' as JSON
	) returnorder;

	SELECT @temp_items=JSON_QUERY((SELECT * FROM @TEMP FOR JSON PATH), '$')

	--SELECT @temp_items=JSON_QUERY(
	--(
	--SELECT 
	--JSON_VALUE(VALUE, '$.id') AS id,
	--JSON_VALUE(VALUE, '$.ean') AS EAN,
	--JSON_VALUE(VALUE, '$.name') AS name,
	--JSON_VALUE(VALUE, '$.description') AS description,
	--JSON_VALUE(VALUE, '$.image_url') AS image_url,
	--CASE 
	--WHEN ISNULL((SELECT SUM(rd.return_qty) FROM return_detail rd INNER JOIN return_header rh ON rh.return_header_id=rd.return_header_id WHERE product_id=ISNULL(JSON_VALUE(VALUE, '$.id'),'') and rh.order_number=JSON_VALUE(@payload_final,'$.order_number')),0)<ISNULL(JSON_VALUE(VALUE, '$.quantity_shipped'),0)
	--THEN
	--	ISNULL(JSON_VALUE(VALUE, '$.quantity_shipped'),0) - ISNULL((SELECT SUM(rd.return_qty) FROM return_detail rd INNER JOIN return_header rh ON rh.return_header_id=rd.return_header_id WHERE product_id=ISNULL(JSON_VALUE(VALUE, '$.id'),'') and rh.order_number=JSON_VALUE(@payload_final,'$.order_number')),0)
	--ELSE
	--	0
	--END 
	--quantity,
	--CASE 
	--WHEN ISNULL((SELECT SUM(rd.return_qty) FROM return_detail rd INNER JOIN return_header rh ON rh.return_header_id=rd.return_header_id WHERE product_id=ISNULL(JSON_VALUE(VALUE, '$.id'),'') and rh.order_number=JSON_VALUE(@payload_final,'$.order_number')),0)<ISNULL(JSON_VALUE(VALUE, '$.quantity_shipped'),0)
	--THEN
	--	ISNULL(JSON_VALUE(VALUE, '$.quantity_shipped'),0) - ISNULL((SELECT SUM(rd.return_qty) FROM return_detail rd INNER JOIN return_header rh ON rh.return_header_id=rd.return_header_id WHERE product_id=ISNULL(JSON_VALUE(VALUE, '$.id'),'') and rh.order_number=JSON_VALUE(@payload_final,'$.order_number')),0)
	--ELSE
	--	0
	--END
	--return_quantity,
	----JSON_VALUE(VALUE, '$.quantity') AS quantity,
	----JSON_VALUE(VALUE, '$.return_quantity') AS return_quantity,
	--JSON_VALUE(VALUE, '$.unit_price_amount') AS unit_price_amount,
	--JSON_VALUE(VALUE, '$.shipment_id') AS shipment_id,
	--JSON_VALUE(VALUE, '$.reason_category') AS reason_category,
	--JSON_QUERY(VALUE, '$.extra') as extra,
	--JSON_QUERY(VALUE, '$.specifics') as specifics,
	--CASE WHEN 
	--(
	--JSON_VALUE(VALUE,'$.extra.returnable')='Y' 
	--OR (SELECT 1 FROM OPENJSON(@access_codes) WHERE JSON_VALUE(value,'$.FunctionType') like '%Override Restricted Item%')=1
	--) then 1 
	--else 0 end AS is_actionable
	--FROM OPENJSON(@items) FOR JSON PATH), '$')
	
RETURN (
	SELECT @temp_items
	)  
END
GO
/****** Object:  UserDefinedFunction [dbo].[fun_Menu]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
   
  
   
CREATE FUNCTION [dbo].[fun_Menu](    
    @Mid INT,    
    @Rid NVARCHAR(100)  ,  
  @scope NVARCHAR(100)  ,  
  @tab  AS tblids READONLY  
)    
RETURNS NVARCHAR(MAX)    
AS    
BEGIN      
RETURN (SELECT DISTINCT m.ModuleID AS ID, m.Module AS Title, m.NavigateURL, m.LabelCode, m.[Order], m.ParentModuleID AS ParentID,   
JSON_QUERY(ISNULL(CASE WHEN m.childCount >0 THEN [dbo].fun_Menu(m.ModuleID, @Rid,@scope,@tab) ELSE '[]' end, '[]'), '$')  AS Childs, m.Description  
 FROM Module m   
 LEFT JOIN ModuleFunction mf ON mf.ModuleID = m.ModuleID AND mf.isActive = 1  
 LEFT JOIN RoleModuleFunction rmf ON rmf.ModuleFunctionID = mf.ModuleFunctionID --AND mf.FunctionType = 'Access'   
 AND rmf.RoleTypeID IN (SELECT items FROM [dbo].Split(@Rid, ',')) AND rmf.IsApplicable = 1  
 WHERE m.ActiveFlag = 1   
 AND m.ParentModuleID = @Mid    
 AND m.ModuleID IN ( SELECT id FROM @tab)  
 AND (m.childCount > 0 OR (m.childCount = 0 AND mf.FunctionType = 'View' AND rmf.IsApplicable = 1 AND m.NavigateURL IS NOT NULL AND rmf.RoleTypeID IN (SELECT items FROM [dbo].Split(@Rid, ','))))  
 ORDER BY m.[Order] FOR JSON PATH)    
END  
  
GO
/****** Object:  UserDefinedFunction [dbo].[fun_Menu1]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
CREATE FUNCTION [dbo].[fun_Menu1](  
    @Mid INT,  
    @Rid NVARCHAR(100),
	 @tab AS tblids READONLY
)  
RETURNS NVARCHAR(MAX)  
AS  
BEGIN  

  
RETURN (SELECT DISTINCT m.ModuleID AS ID, m.Module AS Title, m.NavigateURL, m.LabelCode, m.[Order], m.ParentModuleID AS ParentID
	,JSON_QUERY(ISNULL(dbo.fun_Menu1(m.ModuleID, @Rid,@tab), '[]'), '$') AS Childs, m.Description
	FROM Module m 
	LEFT JOIN ModuleFunction mf ON mf.ModuleID = m.ModuleID AND mf.isActive = 1
	LEFT JOIN dbo.RoleModuleFunction rmf ON rmf.ModuleFunctionID = mf.ModuleFunctionID --AND mf.FunctionType = 'Access' 
	AND rmf.RoleTypeID IN (SELECT items FROM dbo.Split(@Rid, ',')) AND rmf.IsApplicable = 1
	WHERE m.ActiveFlag = 1 AND m.ParentModuleID = @Mid  
	AND m.ModuleID IN ( SELECT id FROM @tab)
	ORDER BY m.[Order] FOR JSON PATH)  
END

GO
/****** Object:  UserDefinedFunction [dbo].[fun_order_shippments]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE FUNCTION [dbo].[fun_order_shippments](  
    @return_header_id INT,
    @shipping_discount FLOAT,
	@is_shipment_selected bit
)  
RETURNS NVARCHAR(MAX)  
AS  
BEGIN

	DECLARE @brand_code nvarchar(20),@language_code nvarchar(20),@return_number nvarchar(200)
	SELECT TOP 1 
	@brand_code=(SELECT TOP 1 PartnerCode FROM Partners WHERE PartnerID = brand_id),
	@language_code=JSON_VALUE(extra,'$.language'),
	@return_number=return_number
	FROM return_header WHERE return_header_id=@return_header_id

	--DECLARE @track_status_page nvarchar(max)='https://reverselogix.io/portal/res/return/t3/'+@brand_code+'/amer/track/'+@language_code+'/'+@return_number+''

    DECLARE @ret_value nvarchar(max)
    IF EXISTS(SELECT 1 FROM return_header WHERE return_header_id = @return_header_id AND (labels<>'' AND labels<>'[]'))
    BEGIN
    set @ret_value = 
	(SELECT 
	shipment_number as shipment_id,
	shipment_number,
	carrier_code as carrier, 
	--(CAST(avg_cost AS DECIMAL(18,4))+ISNULL(sponsorship_cost,0)) shipping_charge, 
	CASE WHEN is_oversize=1
	THEN
		(CAST(over_cost AS DECIMAL(18,4))+ISNULL(sponsorship_cost,0)+ ISNULL(custom_cost,0)) 
	ELSE
		(CAST(avg_cost AS DECIMAL(18,4))+ISNULL(sponsorship_cost,0)+ ISNULL(custom_cost,0)) 
	END
	shipping_charge, 
	--CAST(shipping_tax AS DECIMAL(18,2)) tax_amount, 
    --CAST(((avg_cost*@shipping_discount)/100) AS DECIMAL(18,2)) sponsorship, 
	ISNULL(sponsorship_cost,0) as sponsorship,

	CASE WHEN is_oversize=1
	THEN
		(CAST(over_cost_vat AS DECIMAL(18,4))+ISNULL(sponsorship_cost_vat,0) + ISNULL(custom_cost_vat,0)) 
	ELSE
		(CAST(avg_cost_vat AS DECIMAL(18,4))+ISNULL(sponsorship_cost_vat,0) + ISNULL(custom_cost_vat,0)) 
	END
	shipping_charge_ttc, 
	ISNULL(sponsorship_cost_vat,0) as sponsorship_ttc,

	--CONVERT(VARCHAR(33), [delivery_date] , 126)+'Z' as receive_date,
	JSON_QUERY(
	(
	SELECT  
	CASE WHEN [delivery_date] IS NULL THEN '' ELSE CONVERT(VARCHAR(33), [delivery_date] , 126)+'Z' END as receive_date,
	--shipment_number as carrier_tracking_number, 
	tracking_no as carrier_tracking_number, 
	tracking_url
	--@track_status_page as status_page_link
	--dimensions, 
	--received
    FROM return_parcel rp
    WHERE rp.return_header_id=rpl.return_header_id and rp.id = rpl.id
    FOR  JSON PATH, WITHOUT_ARRAY_WRAPPER)
	,'$') parcels
    FROM return_parcel rpl
    LEFT JOIN return_header hdr ON rpl.return_header_id=hdr.return_header_id
    WHERE rpl.return_header_id=@return_header_id
    FOR JSON PATH)  
    END
    ELSE --IF NOT EXISTS(SELECT 1 FROM return_detail where return_reason_id in (select RMAActionCodeID from RMAActionCode where RMAActionCode = 'ARR00010'))
    BEGIN
         set @ret_value = (
		 SELECT 
			TOP 1
			shipment_id,
			shipment_number,
			tracking_no as carrier, 
			--(CAST(avg_cost AS DECIMAL(18,4))+ISNULL(sponsorship_cost,0)) shipping_charge, 
			CASE WHEN is_oversize=1
			THEN
				(CAST(over_cost AS DECIMAL(18,4))+ISNULL(sponsorship_cost,0)+ ISNULL(custom_cost,0)) 
			ELSE
				(CAST(avg_cost AS DECIMAL(18,4))+ISNULL(sponsorship_cost,0)+ ISNULL(custom_cost,0)) 
			END
			shipping_charge, 
			--CAST(((avg_cost*@shipping_discount)/100) AS DECIMAL(18,2)) sponsorship, 
			ISNULL(sponsorship_cost,0) as sponsorship,

			CASE WHEN is_oversize=1
			THEN
				(CAST(over_cost_vat AS DECIMAL(18,4))+ISNULL(sponsorship_cost_vat,0) + ISNULL(custom_cost_vat,0)) 
			ELSE
				(CAST(avg_cost_vat AS DECIMAL(18,4))+ISNULL(sponsorship_cost_vat,0) + ISNULL(custom_cost_vat,0)) 
			END
			shipping_charge_ttc, 
			ISNULL(sponsorship_cost_vat,0) as sponsorship_ttc,

			JSON_QUERY(
			(
			SELECT  
			CASE WHEN [delivery_date] IS NULL THEN '' ELSE CONVERT(VARCHAR(33), [delivery_date] , 126)+'Z' END as receive_date,
			shipment_number as carrier_tracking_number, 
			tracking_url
			--@track_status_page as status_page_link
			--dimensions, 
			--received
			FROM return_parcel rp
			WHERE rp.return_header_id=rpl.return_header_id and rp.id = rpl.id
			FOR  JSON PATH, WITHOUT_ARRAY_WRAPPER)
			,'$') parcels
			FROM return_parcel rpl
			LEFT JOIN return_header hdr ON rpl.return_header_id=hdr.return_header_id
			WHERE rpl.return_header_id=@return_header_id
			FOR JSON PATH
		 )
		 
		 --(select TOP 1
			--				rp.shipment_id,
			--				rp.shipment_number,
			--				rp.carrier_code,
			--				'0.0000' as shipping_charge,
			--				'0.0000' as sponsorship,
			--				rp.tracking_no as tracking_number,
			--				rp.tracking_url
			--				FROM amer.return_parcel rp WHERE rp.return_header_id=@return_header_id FOR JSON PATH)  
    END
    -- ELSE
    -- BEGIN
    --     set @ret_value = '[]'
    -- END
    return @ret_value
END

GO
/****** Object:  UserDefinedFunction [dbo].[fun_order_shippments_stage]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE FUNCTION [dbo].[fun_order_shippments_stage](  
    @return_header_id INT,
    @shipping_discount FLOAT,
	@is_shipment_selected bit
)  
RETURNS NVARCHAR(MAX)  
AS  
BEGIN

	DECLARE @brand_code nvarchar(20),@language_code nvarchar(20),@return_number nvarchar(200)
	SELECT TOP 1 
	@brand_code=(SELECT TOP 1 PartnerCode FROM Partners WHERE PartnerID = brand_id),
	@language_code=JSON_VALUE(extra,'$.language'),
	@return_number=return_number
	FROM return_header_stage WHERE return_header_id=@return_header_id

	--DECLARE @track_status_page nvarchar(max)='https://reverselogix.io/portal/res/return/t3/'+@brand_code+'/amer/track/'+@language_code+'/'+@return_number+''

    DECLARE @ret_value nvarchar(max)
    IF EXISTS(SELECT 1 FROM return_header_stage WHERE return_header_id = @return_header_id AND (labels<>'' AND labels<>'[]'))
    BEGIN
    set @ret_value = 
	(SELECT 
	shipment_number as shipment_id,
	shipment_number,
	carrier_code as carrier, 
	--(CAST(avg_cost AS DECIMAL(18,4))+ISNULL(sponsorship_cost,0)) shipping_charge, 
	CASE WHEN is_oversize=1
	THEN
		(CAST(over_cost AS DECIMAL(18,4))+ISNULL(sponsorship_cost,0)+ ISNULL(custom_cost,0)) 
	ELSE
		(CAST(avg_cost AS DECIMAL(18,4))+ISNULL(sponsorship_cost,0)+ ISNULL(custom_cost,0)) 
	END
	shipping_charge, 
	--CAST(shipping_tax AS DECIMAL(18,2)) tax_amount, 
    --CAST(((avg_cost*@shipping_discount)/100) AS DECIMAL(18,2)) sponsorship, 
	ISNULL(sponsorship_cost,0) as sponsorship,

	CASE WHEN is_oversize=1
	THEN
		(CAST(over_cost_vat AS DECIMAL(18,4))+ISNULL(sponsorship_cost_vat,0) + ISNULL(custom_cost_vat,0)) 
	ELSE
		(CAST(avg_cost_vat AS DECIMAL(18,4))+ISNULL(sponsorship_cost_vat,0) + ISNULL(custom_cost_vat,0)) 
	END
	shipping_charge_ttc, 
	ISNULL(sponsorship_cost_vat,0) as sponsorship_ttc,

	--CONVERT(VARCHAR(33), [delivery_date] , 126)+'Z' as receive_date,
	JSON_QUERY(
	(
	SELECT  
	CASE WHEN [delivery_date] IS NULL THEN '' ELSE CONVERT(VARCHAR(33), [delivery_date] , 126)+'Z' END as receive_date,
	--shipment_number as carrier_tracking_number, 
	tracking_no as carrier_tracking_number, 
	tracking_url
	--@track_status_page as status_page_link
	--dimensions, 
	--received
    FROM return_parcel_stage rp
    WHERE rp.return_header_id=rpl.return_header_id and rp.id = rpl.id
    FOR  JSON PATH, WITHOUT_ARRAY_WRAPPER)
	,'$') parcels
    FROM return_parcel_stage rpl
    LEFT JOIN return_header_stage hdr ON rpl.return_header_id=hdr.return_header_id
    WHERE rpl.return_header_id=@return_header_id
    FOR JSON PATH)  
    END
    ELSE --IF NOT EXISTS(SELECT 1 FROM return_detail where return_reason_id in (select RMAActionCodeID from RMAActionCode where RMAActionCode = 'ARR00010'))
    BEGIN
         set @ret_value = (
		 SELECT 
			TOP 1
			shipment_id,
			shipment_number,
			tracking_no as carrier, 
			--(CAST(avg_cost AS DECIMAL(18,4))+ISNULL(sponsorship_cost,0)) shipping_charge, 
			CASE WHEN is_oversize=1
			THEN
				(CAST(over_cost AS DECIMAL(18,4))+ISNULL(sponsorship_cost,0)+ ISNULL(custom_cost,0)) 
			ELSE
				(CAST(avg_cost AS DECIMAL(18,4))+ISNULL(sponsorship_cost,0)+ ISNULL(custom_cost,0)) 
			END
			shipping_charge, 
			--CAST(((avg_cost*@shipping_discount)/100) AS DECIMAL(18,2)) sponsorship, 
			ISNULL(sponsorship_cost,0) as sponsorship,

			CASE WHEN is_oversize=1
			THEN
				(CAST(over_cost_vat AS DECIMAL(18,4))+ISNULL(sponsorship_cost_vat,0) + ISNULL(custom_cost_vat,0)) 
			ELSE
				(CAST(avg_cost_vat AS DECIMAL(18,4))+ISNULL(sponsorship_cost_vat,0) + ISNULL(custom_cost_vat,0)) 
			END
			shipping_charge_ttc, 
			ISNULL(sponsorship_cost_vat,0) as sponsorship_ttc,

			JSON_QUERY(
			(
			SELECT  
			CASE WHEN [delivery_date] IS NULL THEN '' ELSE CONVERT(VARCHAR(33), [delivery_date] , 126)+'Z' END as receive_date,
			shipment_number as carrier_tracking_number, 
			tracking_url
			--@track_status_page as status_page_link
			--dimensions, 
			--received
			FROM return_parcel_stage rp
			WHERE rp.return_header_id=rpl.return_header_id and rp.id = rpl.id
			FOR  JSON PATH, WITHOUT_ARRAY_WRAPPER)
			,'$') parcels
			FROM return_parcel_stage rpl
			LEFT JOIN return_header_stage hdr ON rpl.return_header_id=hdr.return_header_id
			WHERE rpl.return_header_id=@return_header_id
			FOR JSON PATH
		 )
		 
		 --(select TOP 1
			--				rp.shipment_id,
			--				rp.shipment_number,
			--				rp.carrier_code,
			--				'0.0000' as shipping_charge,
			--				'0.0000' as sponsorship,
			--				rp.tracking_no as tracking_number,
			--				rp.tracking_url
			--				FROM amer.return_parcel rp WHERE rp.return_header_id=@return_header_id FOR JSON PATH)  
    END
    -- ELSE
    -- BEGIN
    --     set @ret_value = '[]'
    -- END
    return @ret_value
END
GO
/****** Object:  UserDefinedFunction [dbo].[fun_Partners_CheckExist]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE FUNCTION [dbo].[fun_Partners_CheckExist](
   @PartnerID INT
)
RETURNS INT
AS
BEGIN	 
	declare @countExist INT = 0
	select @countExist=count(1) from PartnerUserRoleMap where PartnerID = @PartnerID
	if (@countExist = 0)
	select @countExist=count(1) from Container where PartnerID = @PartnerID
	if (@countExist = 0)
	select @countExist=count(1) from Customer where PartnerID = @PartnerID
	if (@countExist = 0)
	select @countExist=count(1) from DispatchHeader where ToPartnerID = @PartnerID or FromPartnerID = @PartnerID
	if (@countExist = 0)
	select @countExist=count(1) from ItemMasterPartnerMap where PartnerID = @PartnerID
	if (@countExist = 0)
	select @countExist=count(1) from MRNHeader where  ToPartnerID = @PartnerID or FromPartnerID = @PartnerID
	if (@countExist = 0)
	Select @countExist=count(1) from SOHeader where PartnerID = @PartnerID
	if (@countExist = 0)
	Select @countExist=count(1) from STOHeader where  ToPartnerID = @PartnerID or FromPartnerID = @PartnerID
	if (@countExist = 0)
	select @countExist=count(1) from PartnerAddressMap where PartnerID = @PartnerID
	if (@countExist = 0)
	select @countExist=count(1) from PartnerConfigMap where PartnerID = @PartnerID
	if (@countExist = 0)
	select @countExist=count(1) from PartnerFacilityMap where PartnerID = @PartnerID
	if (@countExist = 0)
	select @countExist=count(1) from PartnerLocation where PartnerID = @PartnerID
	RETURN (
		@countExist
	)
END

GO
/****** Object:  UserDefinedFunction [dbo].[fun_RefundAmount]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE Function [dbo].[fun_RefundAmount](@RMAActionCodeID int, @PartnerID int, @Quantity int, @Amount float, @ismodel bit) Returns FLOAT
AS 
BEGIN  
	DECLARE @GrossAmount FLOAT, @TotalAmount FLOAT, @rrParent INT
	SET @GrossAmount = (@Quantity*@Amount)
	SET @TotalAmount = @GrossAmount
	SELECT @rrParent = ISNULL(PartnerParentID, PartnerID) from Partners WHERE PartnerID = @PartnerID
	if(@ismodel=0)
	begin
	SELECT @TotalAmount = @GrossAmount+ISNULL((CASE PRRR.IsFixedRuleValue 
		WHEN 1 THEN
			(CASE D.TypeCode 
				WHEN 'RRE001' THEN
					(CASE PRRR.RuleValueEffect WHEN 1 THEN @Quantity*CAST(PRRR.RuleValue AS FLOAT) ELSE -(@Quantity*CAST(PRRR.RuleValue AS FLOAT)) END) 
					ELSE
					(CASE PRRR.RuleValueEffect WHEN 1 THEN CAST(PRRR.RuleValue AS FLOAT) ELSE - CAST(PRRR.RuleValue AS FLOAT) END) 
			END)
		ELSE 
			(CASE D.TypeCode 
				WHEN 'RRE001' THEN
					(CASE PRRR.RuleValueEffect WHEN 1 THEN @Quantity*(CAST(PRRR.RuleValue AS FLOAT)*@Amount/100) ELSE -(@Quantity*(CAST(PRRR.RuleValue AS FLOAT)*@Amount/100)) END) 
					ELSE
					(CASE PRRR.RuleValueEffect WHEN 1 THEN (CAST(PRRR.RuleValue AS FLOAT)*@Amount/100) ELSE -(CAST(PRRR.RuleValue AS FLOAT)*@Amount/100) END)
			END)
	END), 0)
	FROM PartnerReturnReasonRuleMap PRRR  
	INNER JOIN PartnerReturnReasonMap PRR ON PRRR.PartnerReturnReasonMapID = PRR.PartnerReturnReasonMapID  
	INNER JOIN ReturnReasonRuleMap RRR ON RRR.ReturnReasonRuleMapID = PRRR.ReturnReasonRuleMapID  
	INNER JOIN TypeLookUp C on C.TypeLookUpId=RRR.RuleControlTypeID  
	INNER JOIN TypeLookUp D on D.TypeLookUpId=PRRR.RuleValueEffectTO
	INNER JOIN Rules RS on RS.RuleID=RRR.RuleID  
	WHERE RRR.RMAActionCodeID=@RMAActionCodeID and PRR.RMAActionCodeID=@RMAActionCodeID AND PRR.PartnerID = @rrParent AND C.TypeCode = 'RCT001' 
	end
	else
	begin
		SELECT @TotalAmount = @GrossAmount+ISNULL((CASE PRRR.IsFixedRuleValue 
		WHEN 1 THEN
			(CASE D.TypeCode 
				WHEN 'RRE001' THEN
					(CASE PRRR.RuleValueEffect WHEN 1 THEN @Quantity*CAST(PRRR.RuleValue AS FLOAT) ELSE -(@Quantity*CAST(PRRR.RuleValue AS FLOAT)) END) 
					ELSE
					(CASE PRRR.RuleValueEffect WHEN 1 THEN CAST(PRRR.RuleValue AS FLOAT) ELSE - CAST(PRRR.RuleValue AS FLOAT) END) 
			END)
		ELSE 
			(CASE D.TypeCode 
				WHEN 'RRE001' THEN
					(CASE PRRR.RuleValueEffect WHEN 1 THEN @Quantity*(CAST(PRRR.RuleValue AS FLOAT)*@Amount/100) ELSE -(@Quantity*(CAST(PRRR.RuleValue AS FLOAT)*@Amount/100)) END) 
					ELSE
					(CASE PRRR.RuleValueEffect WHEN 1 THEN (CAST(PRRR.RuleValue AS FLOAT)*@Amount/100) ELSE -(CAST(PRRR.RuleValue AS FLOAT)*@Amount/100) END)
			END)
	END), 0)
	FROM PartnerReturnReasonRuleMap PRRR  
	INNER JOIN PartnerReturnReasonMap PRR ON PRRR.PartnerReturnReasonMapID = PRR.PartnerReturnReasonMapID  
	INNER JOIN ReturnReasonRuleMap RRR ON RRR.ReturnReasonRuleMapID = PRRR.ReturnReasonRuleMapID  
	INNER JOIN TypeLookUp C on C.TypeLookUpId=RRR.RuleControlTypeID  
	INNER JOIN TypeLookUp D on D.TypeLookUpId=PRRR.RuleValueEffectTO
	INNER JOIN Rules RS on RS.RuleID=RRR.RuleID  
	WHERE RRR.RMAActionCodeID=@RMAActionCodeID and PRR.RMAActionCodeID=@RMAActionCodeID AND PRR.PartnerID = @rrParent AND C.TypeCode = 'RCT001' 
	end
	RETURN @TotalAmount
END

GO
/****** Object:  UserDefinedFunction [dbo].[fun_return_addresses]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE FUNCTION [dbo].[fun_return_addresses](  
    @items NVARCHAR(max),  
    @extra NVARCHAR(max)
)  
RETURNS NVARCHAR(MAX)  
AS  
BEGIN
    DECLARE @tbl_dc TABLE(dc NVARCHAR(50))
    DECLARE @dc_count INT, @ret_value NVARCHAR(MAX)
    INSERT INTO @tbl_dc
    SELECT DISTINCT JSON_VALUE(JSON_QUERY(value, '$.extra'),'$.return_DC') FROM OPENJSON(@items)
    SELECT @dc_count = COUNT(*) FROM @tbl_dc 
    IF(@dc_count > 1)
    BEGIN
        SELECT @ret_value = ISNULL((SELECT prt.ContactName AS name, prt.PartnerName AS company, prt.Email AS email, prt.ContactNumber AS phone,	prt.PartnerCode AS code,
        partnerCodeList.itemlevel, Address1 AS 'address.street1', Address2 AS 'address.street2', City AS 'address.city', ZipCode AS 'address.postal_code', FixedLineNumber AS 'address.FixedLineNumber', CellNumber AS 'address.CellNumber', [State].StateCode AS 'address.state_code', [State].StateName AS 'address.state_name', [State].StateID AS 'address.state_id', Country.CountryCode AS 'address.country_code', Country.CountryName AS 'address.country_name', Country.CountryID  AS 'address.country_id'
        FROM Partners prt
        INNER JOIN (SELECT DISTINCT JSON_VALUE(@extra,'$.return_DC')[code], 0 [itemlevel] ) partnerCodeList ON partnerCodeList.code =  prt.PartnerCode
        LEFT JOIN TypeLookUp typ ON prt.PartnerTypeID = typ.TypeLookUpID
        LEFT JOIN PartnerAddressMap ON PartnerAddressMap.PartnerID = prt.PartnerID
        LEFT JOIN [Address] ON [Address].AddressID = PartnerAddressMap.AddressID
        LEFT JOIN dbo.[State] ON [State].StateID = Address.StateID
        LEFT JOIN Country ON Country.CountryID = Address.CountryID
        WHERE typ.TypeCode='PTR001' FOR JSON PATH ),'[]')
     END
     ELSE
     BEGIN
        SELECT @ret_value = ISNULL((SELECT prt.ContactName AS name, prt.PartnerName AS company, prt.Email AS email, prt.ContactNumber AS phone,	prt.PartnerCode AS code,
        partnerCodeList.itemlevel, Address1 AS 'address.street1', Address2 AS 'address.street2', City AS 'address.city', ZipCode AS 'address.postal_code', FixedLineNumber AS 'address.FixedLineNumber', CellNumber AS 'address.CellNumber', [State].StateCode AS 'address.state_code', [State].StateName AS 'address.state_name', [State].StateID AS 'address.state_id', Country.CountryCode AS 'address.country_code', Country.CountryName AS 'address.country_name', Country.CountryID  AS 'address.country_id'
        FROM Partners prt
        INNER JOIN ( SELECT DISTINCT JSON_VALUE(JSON_QUERY(value, '$.extra'),'$.return_DC')[code], 1 [itemlevel] FROM OPENJSON(@items)) partnerCodeList ON partnerCodeList.code =  prt.PartnerCode
        LEFT JOIN TypeLookUp typ ON prt.PartnerTypeID = typ.TypeLookUpID
        LEFT JOIN PartnerAddressMap ON PartnerAddressMap.PartnerID = prt.PartnerID
        LEFT JOIN [Address] ON [Address].AddressID = PartnerAddressMap.AddressID
        LEFT JOIN dbo.[State] ON [State].StateID = Address.StateID
        LEFT JOIN Country ON Country.CountryID = Address.CountryID
        WHERE typ.TypeCode='PTR001' FOR JSON PATH ),'[]')
     END
    RETURN @ret_value 
END

GO
/****** Object:  UserDefinedFunction [dbo].[fun_rule_get_return_dc]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
    
-- =============================================    
-- Author:      <Author, , Name>    
-- Create Date: <Create Date, , >    
-- Description: <Description, , >    
-- =============================================    
CREATE FUNCTION [dbo].[fun_rule_get_return_dc]    
(    
    @items nvarchar(max)=null    
)    
RETURNS NVARCHAR(MAX)      
AS    
BEGIN    
    -- Declare the return variable here    
    DECLARE @ret_value nvarchar(max)    
    
 IF NOT EXISTS(Select 1 FROM OPENJSON(@items) where JSON_VALUE(JSON_QUERY(VALUE,'$.extra'),'$.return_DC') = 'DSC1')    
 BEGIN    
  IF (    
    ISNULL((Select TOP 1 1 FROM OPENJSON(@items) where JSON_VALUE(JSON_QUERY(VALUE,'$.extra'),'$.return_DC')='5030'),0)=1 AND     
    ISNULL((Select TOP 1 1 FROM OPENJSON(@items) where JSON_VALUE(JSON_QUERY(VALUE,'$.extra'),'$.return_DC')='5050'),0)<>1 AND    
    ISNULL((Select TOP 1 1 FROM OPENJSON(@items) where JSON_VALUE(JSON_QUERY(VALUE,'$.extra'),'$.return_DC')='2701'),0)<>1    
	)    
      BEGIN    
		SET @ret_value='5030'    
      END    
  ELSE IF (    
     ISNULL((Select TOP 1 1 FROM OPENJSON(@items) where JSON_VALUE(JSON_QUERY(VALUE,'$.extra'),'$.return_DC')='5050'),0)=1 AND    
     ISNULL((Select TOP 1 1 FROM OPENJSON(@items) where JSON_VALUE(JSON_QUERY(VALUE,'$.extra'),'$.return_DC')='5030'),0)<>1 AND    
     ISNULL((Select TOP 1 1 FROM OPENJSON(@items) where JSON_VALUE(JSON_QUERY(VALUE,'$.extra'),'$.return_DC')='2701'),0)<>1    
    )    
      BEGIN    
		SET @ret_value='5050'    
      END    
  ELSE IF (    
     ISNULL((Select TOP 1 1 FROM OPENJSON(@items) where JSON_VALUE(JSON_QUERY(VALUE,'$.extra'),'$.return_DC')='2701'),0)=1 AND    
     ISNULL((Select TOP 1 1 FROM OPENJSON(@items) where JSON_VALUE(JSON_QUERY(VALUE,'$.extra'),'$.return_DC')='5050'),0)<>1 AND    
     ISNULL((Select TOP 1 1 FROM OPENJSON(@items) where JSON_VALUE(JSON_QUERY(VALUE,'$.extra'),'$.return_DC')='5030'),0)<>1    
    )    
      BEGIN    
		SET @ret_value='DSC1'    
      END    
  ELSE    
      BEGIN    
		SET @ret_value='DSC1'    
      END    
 END       
   ELSE    
    BEGIN    
		SET @ret_value='DSC1'    
    END    
  
    
    RETURN @ret_value    
END 
GO
/****** Object:  UserDefinedFunction [dbo].[fun_ShipedQuantity]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE FUNCTION [dbo].[fun_ShipedQuantity](@RMAOrderDetailID int) Returns float
AS
Begin
	return(select ISNULL(SUM(ShipmentDetail.Quantity), 0)
	FROM SalesReturnOrderDetail LEFT JOIN ShipmentDetail ON ShipmentDetail.OrderDetailID = SalesReturnOrderDetail.SalesReturnOrderDetailID
	Where SalesReturnOrderDetailID = @RMAOrderDetailID)
	
End

GO
/****** Object:  UserDefinedFunction [dbo].[fun_User_Authorization]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [dbo].[fun_User_Authorization](
    @Mid INT
	,@Rid INT ,
	 @tab AS tblids READONLY
)
RETURNS NVARCHAR(MAX)
AS
BEGIN	 
	RETURN (SELECT DISTINCT m.ModuleID AS ID, m.Module AS Title, m.NavigateURL, m.LabelCode,
	m.[Order], m.ParentModuleID AS ParentID 
	,[dbo].fun_Authorization(m.ModuleID, @Rid,@tab) AS [Permissions]
	FROM Module m 
	WHERE m.ActiveFlag = 1 AND m.ParentModuleID = @Mid
		AND m.ModuleID IN ( SELECT id FROM @tab)
	ORDER BY M.[Order]
	FOR JSON AUTO)
END

GO
/****** Object:  UserDefinedFunction [dbo].[fun_User_Menu]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 


CREATE FUNCTION [dbo].[fun_User_Menu](
    @Mid INT,
	@Uid int
)
RETURNS NVARCHAR(MAX)
AS
BEGIN	 
	RETURN (SELECT DISTINCT m.ModuleID AS ID, m.Module AS Title, m.NavigateURL, m.LabelCode,
	m.[Order], m.ParentModuleID AS ParentID,m.Description, ISNULL([dbo].fun_User_Menu_Child(m.ModuleID, @Uid), '[]') AS Childs
	--, [dbo].fun_User_Authorization(m.ModuleID,'1') AS childs

	FROM Module m 
	RIGHT JOIN ModuleFunction mf ON m.ModuleID = mf.ModuleID AND mf.isActive = 1
	RIGHT JOIN RoleModuleFunction rmf ON mf.ModuleFunctionId = rmf.ModuleFunctionID
	RIGHT JOIN UserRoleMap ur on rmf.RoleTypeId=ur.RoleTypeID
	RIGHT JOIN PartnerUserRoleMap pr on ur.UserRoleMapID=pr.UserRoleMapID

	WHERE ur.userID=@Uid AND m.ActiveFlag = 1 
	AND m.ParentModuleID = @Mid AND rmf.IsApplicable = 1 and FunctionName='Access' and pr.isDefault=1
	order by m.[Order]
	FOR JSON AUTO)
END

GO
/****** Object:  UserDefinedFunction [dbo].[fun_User_Menu_child]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 CREATE FUNCTION [dbo].[fun_User_Menu_child](  
    @Mid INT,  
    @Uid int  
)  
RETURNS NVARCHAR(MAX)  
AS  
BEGIN    
 RETURN (SELECT DISTINCT m.ModuleID AS ID, m.Module AS Title, m.NavigateURL, m.LabelCode,  
 m.[Order], m.ParentModuleID AS ParentID 
 --, dbo.fun_User_Authorization(m.ModuleID,'1') AS childs  
  
 FROM Module m 
 INNER JOIN ModuleFunction mf ON m.ModuleID = mf.ModuleID AND mf.isActive = 1  
 RIGHT JOIN RoleModuleFunction rmf ON mf.ModuleFunctionId = rmf.ModuleFunctionID  
 right join UserRoleMap ur on rmf.RoleTypeId=ur.RoleTypeID  
 right join PartnerUserRoleMap pr on ur.UserRoleMapID=pr.UserRoleMapID  
  
 WHERE ur.userID=@Uid AND m.ActiveFlag = 1   
 AND m.ParentModuleID = @Mid AND rmf.IsApplicable = 1 and FunctionName='Access' and pr.isDefault=1  
 order by m.[Order]  
 FOR JSON AUTO)  
END

GO
/****** Object:  UserDefinedFunction [dbo].[fun_User_Menu_Old]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE FUNCTION [dbo].[fun_User_Menu_Old](
    @Mid INT,
	@Rid NVARCHAR(200)
)
RETURNS NVARCHAR(MAX)
AS
BEGIN	 
	RETURN (SELECT DISTINCT m.ModuleID AS ID, m.Module AS Title, m.NavigateURL, m.LabelCode,
	m.[Order], m.ParentModuleID AS ParentID
	--, dbo.fun_User_Authorization(m.ModuleID,'1') AS childs

	FROM Module m INNER JOIN ModuleFunction mf ON m.ModuleID = mf.ModuleID
	RIGHT JOIN RoleModuleFunction rmf ON mf.ModuleFunctionId = rmf.ModuleFunctionID

	WHERE RoleTypeId IN (SELECT items FROM [dbo].[Split](@Rid, ',')) AND m.ActiveFlag = 1 
	AND m.ParentModuleID = @Mid AND rmf.IsApplicable = 1 
	order by m.[Order]
	FOR JSON AUTO)
END

GO
/****** Object:  UserDefinedFunction [dbo].[fun_User_Wizard_Menu]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 CREATE FUNCTION [dbo].[fun_User_Wizard_Menu](
    @Mid INT,
	@Uid int
)
RETURNS NVARCHAR(MAX)
AS
BEGIN	 
	RETURN (SELECT DISTINCT m.ModuleID AS ID, m.Module AS Title, m.NavigateURL, m.LabelCode,
	m.[Order], m.ParentModuleID AS ParentID,0 isCompleted, 0 isSelected
	--, dbo.fun_User_Authorization(m.ModuleID,'1') AS childs

	FROM Module m INNER JOIN ModuleFunction mf ON m.ModuleID = mf.ModuleID  AND mf.isActive = 1
	RIGHT JOIN RoleModuleFunction rmf ON mf.ModuleFunctionId = rmf.ModuleFunctionID
	right join UserRoleMap ur on rmf.RoleTypeId=ur.RoleTypeID
	right join PartnerUserRoleMap pr on ur.UserRoleMapID=pr.UserRoleMapID

	WHERE ur.userID=@Uid AND m.ActiveFlag = 1 
	AND m.ParentModuleID = @Mid AND rmf.IsApplicable = 1 and FunctionName='Access' and pr.isDefault=1
	order by m.[Order]
	FOR JSON AUTO)
END

GO
/****** Object:  UserDefinedFunction [dbo].[GetDateFormatByPartnerId]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE FUNCTION [dbo].[GetDateFormatByPartnerId](@PartnerId bigint, @UserID INT)       
    returns @temptable TABLE (TimeZoneDifference nvarchar(1000), TimeZoneDifferenceMinute nvarchar(1000),TimeFormat nvarchar(100))       
    as   
	BEGIN
		INSERT INTO @temptable 
		SELECT TOP 1
		TimeZone.TimeZoneDifference, TimeZone.TimeZoneDifferenceInMinutes,'MMM dd, yyyy' as TimeFormat 
		FROM 
		Users 		
		left join TimeZone on TimeZone.TimeZoneId = [Users].tz
		WHERE Users.UserID= @UserID
		
		if not exists(select 1 from @temptable where TimeZoneDifference is not null)
		begin 
			delete from @temptable
			Insert into @temptable
			select '+00.00', '00.00','MMM dd, yyyy'
			
		end
return
END

GO
/****** Object:  UserDefinedFunction [dbo].[GetRMAItemArtifact]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE FUNCTION [dbo].[GetRMAItemArtifact](@SaleReturnOrderDetailID INT)
RETURNS VARCHAR(1000)
AS
BEGIN
	DECLARE @FileUrl VARCHAR(1000)
	SET @FileUrl = (SELECT ArtifactURL FileUrl
					FROM Artifact 
					INNER JOIN SaleReturnOrderDetailReasonValue ON CAST(Artifact.ArtifactID AS VARCHAR(50)) = SaleReturnOrderDetailReasonValue.RuleValue
					INNER JOIN PartnerReturnReasonRuleMap on SaleReturnOrderDetailReasonValue.ReturnReasonRuleMapID =PartnerReturnReasonRuleMap.PartnerReturnReasonRuleMapID
					INNER JOIN ReturnReasonRuleMap ON ReturnReasonRuleMap.ReturnReasonRuleMapID = PartnerReturnReasonRuleMap.ReturnReasonRuleMapID
					INNER JOIN Rules on Rules.RuleID = ReturnReasonRuleMap.RuleID 
					INNER JOIN TypeLookUp ON TypeLookUp.TypeLookUpID = Rules.ControlTypeID AND TypeLookUp.TypeCode = 'RCT003'
					WHERE SaleReturnOrderDetailID = @SaleReturnOrderDetailID)
	RETURN @FileUrl
	
END

GO
/****** Object:  UserDefinedFunction [dbo].[JSONEscaped]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [dbo].[JSONEscaped] ( /* this is a simple utility function that takes a SQL String with all its clobber and outputs it as a sting with all the JSON escape sequences in it.*/
 @Unescaped NVARCHAR(MAX) --a string with maybe characters that will break json
 )
RETURNS NVARCHAR(MAX)
AS
BEGIN
  SELECT @Unescaped = REPLACE(@Unescaped, FROMString, TOString)
  FROM (SELECT '' AS FromString, '\' AS ToString 
        UNION ALL SELECT '"', '"' 
        UNION ALL SELECT '/', '/'
		UNION ALL SELECT '{', '[' 
        UNION ALL SELECT '}', ']'
        UNION ALL SELECT CHAR(08),'b'
        UNION ALL SELECT CHAR(12),'f'
        UNION ALL SELECT CHAR(10),'n'
        UNION ALL SELECT CHAR(13),'r'
        UNION ALL SELECT CHAR(09),'t'
		UNION ALL SELECT '"code":',''
		UNION ALL SELECT '"value":',''
 ) substitutions
RETURN @Unescaped
END

GO
/****** Object:  UserDefinedFunction [dbo].[parseJSON]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 


CREATE FUNCTION [dbo].[parseJSON]( @JSON NVARCHAR(MAX))
RETURNS @hierarchy TABLE
  (
   element_id INT IDENTITY(1, 1) NOT NULL, /* internal surrogate primary key gives the order of parsing and the list order */
   sequenceNo [int] NULL, /* the place in the sequence for the element */
   parent_ID INT,/* if the element has a parent then it is in this column. The document is the ultimate parent, so you can get the structure from recursing from the document */
   Object_ID INT,/* each list or object has an object id. This ties all elements to a parent. Lists are treated as objects here */
   NAME NVARCHAR(2000),/* the name of the object */
   StringValue NVARCHAR(MAX) NOT NULL,/*the string representation of the value of the element. */
   ValueType VARCHAR(10) NOT null /* the declared type of the value represented as a string in StringValue*/
  )
AS
BEGIN
  DECLARE
    @FirstObject INT, --the index of the first open bracket found in the JSON string
    @OpenDelimiter INT,--the index of the next open bracket found in the JSON string
    @NextOpenDelimiter INT,--the index of subsequent open bracket found in the JSON string
    @NextCloseDelimiter INT,--the index of subsequent close bracket found in the JSON string
    @Type NVARCHAR(10),--whether it denotes an object or an array
    @NextCloseDelimiterChar CHAR(1),--either a '}' or a ']'
    @Contents NVARCHAR(MAX), --the unparsed contents of the bracketed expression
    @Start INT, --index of the start of the token that you are parsing
    @end INT,--index of the end of the token that you are parsing
    @param INT,--the parameter at the end of the next Object/Array token
    @EndOfName INT,--the index of the start of the parameter at end of Object/Array token
    @token NVARCHAR(200),--either a string or object
    @value NVARCHAR(MAX), -- the value as a string
    @SequenceNo int, -- the sequence number within a list
    @name NVARCHAR(200), --the name as a string
    @parent_ID INT,--the next parent ID to allocate
    @lenJSON INT,--the current length of the JSON String
    @characters NCHAR(36),--used to convert hex to decimal
    @result BIGINT,--the value of the hex symbol being parsed
    @index SMALLINT,--used for parsing the hex value
    @Escape INT --the index of the next escape character
   
 
  DECLARE @Strings TABLE /* in this temporary table we keep all strings, even the names of the elements, since they are 'escaped' in a different way, and may contain, unescaped, brackets denoting objects or lists. These are replaced in the JSON string by tokens representing the string */
    (
     String_ID INT IDENTITY(1, 1),
     StringValue NVARCHAR(MAX)
    )
  SELECT--initialise the characters to convert hex to ascii
    @characters='0123456789abcdefghijklmnopqrstuvwxyz',
    @SequenceNo=0, --set the sequence no. to something sensible.
  /* firstly we process all strings. This is done because [{} and ] aren't escaped in strings, which complicates an iterative parse. */
    @parent_ID=0;
  WHILE 1=1 --forever until there is nothing more to do
    BEGIN
      SELECT
        @start=PATINDEX('%[^a-zA-Z]["]%', @json collate SQL_Latin1_General_CP850_Bin);--next delimited string
      IF @start=0 BREAK --no more so drop through the WHILE loop
      IF SUBSTRING(@json, @start+1, 1)='"'
        BEGIN --Delimited Name
          SET @start=@Start+1;
          SET @end=PATINDEX('%[^\]["]%', RIGHT(@json, LEN(@json+'|')-@start) collate SQL_Latin1_General_CP850_Bin);
        END
      IF @end=0 --no end delimiter to last string
        BREAK --no more
      SELECT @token=SUBSTRING(@json, @start+1, @end-1)
      --now put in the escaped control characters
      SELECT @token=REPLACE(@token, FROMString, TOString)
      FROM
        (SELECT
          '\"' AS FromString, '"' AS ToString
         UNION ALL SELECT '\\', '\'
         UNION ALL SELECT '\/', '/'
         UNION ALL SELECT '\b', CHAR(08)
         UNION ALL SELECT '\f', CHAR(12)
         UNION ALL SELECT '\n', CHAR(10)
         UNION ALL SELECT '\r', CHAR(13)
         UNION ALL SELECT '\t', CHAR(09)
        ) substitutions
      SELECT @result=0, @escape=1
  --Begin to take out any hex escape codes
      WHILE @escape>0
        BEGIN
          SELECT @index=0,
          --find the next hex escape sequence
          @escape=PATINDEX('%\x[0-9a-f][0-9a-f][0-9a-f][0-9a-f]%', @token collate SQL_Latin1_General_CP850_Bin)
          IF @escape>0 --if there is one
            BEGIN
              WHILE @index<4 --there are always four digits to a \x sequence  
                BEGIN
                  SELECT --determine its value
                    @result=@result+POWER(16, @index)
                    *(CHARINDEX(SUBSTRING(@token, @escape+2+3-@index, 1),
                                @characters)-1), @index=@index+1 ;
        
                END
                -- and replace the hex sequence by its unicode value
              SELECT @token=STUFF(@token, @escape, 6, NCHAR(@result))
            END
        END
      --now store the string away
      INSERT INTO @Strings (StringValue) SELECT @token
      -- and replace the string with a token
      SELECT @JSON=STUFF(@json, @start, @end+1,
                    '@string'+CONVERT(NVARCHAR(5), @@identity))
    END
  -- all strings are now removed. Now we find the first leaf. 
  WHILE 1=1  --forever until there is nothing more to do
  BEGIN
 
  SELECT @parent_ID=@parent_ID+1
  --find the first object or list by looking for the open bracket
  SELECT @FirstObject=PATINDEX('%[{[[]%', @json collate SQL_Latin1_General_CP850_Bin)--object or array
  IF @FirstObject = 0 BREAK
  IF (SUBSTRING(@json, @FirstObject, 1)='{')
    SELECT @NextCloseDelimiterChar='}', @type='object'
  ELSE
    SELECT @NextCloseDelimiterChar=']', @type='array'
  SELECT @OpenDelimiter=@firstObject
 
  WHILE 1=1 --find the innermost object or list...
    BEGIN
      SELECT
        @lenJSON=LEN(@JSON+'|')-1
  --find the matching close-delimiter proceeding after the open-delimiter
      SELECT
        @NextCloseDelimiter=CHARINDEX(@NextCloseDelimiterChar, @json,
                                      @OpenDelimiter+1)
  --is there an intervening open-delimiter of either type
      SELECT @NextOpenDelimiter=PATINDEX('%[{[[]%',
             RIGHT(@json, @lenJSON-@OpenDelimiter)collate SQL_Latin1_General_CP850_Bin)--object
      IF @NextOpenDelimiter=0
        BREAK
      SELECT @NextOpenDelimiter=@NextOpenDelimiter+@OpenDelimiter
      IF @NextCloseDelimiter<@NextOpenDelimiter
        BREAK
      IF SUBSTRING(@json, @NextOpenDelimiter, 1)='{'
        SELECT @NextCloseDelimiterChar='}', @type='object'
      ELSE
        SELECT @NextCloseDelimiterChar=']', @type='array'
      SELECT @OpenDelimiter=@NextOpenDelimiter
    END
  ---and parse out the list or name/value pairs
  SELECT
    @contents=SUBSTRING(@json, @OpenDelimiter+1,
                        @NextCloseDelimiter-@OpenDelimiter-1)
  SELECT
    @JSON=STUFF(@json, @OpenDelimiter,
                @NextCloseDelimiter-@OpenDelimiter+1,
                '@'+@type+CONVERT(NVARCHAR(5), @parent_ID))
  WHILE (PATINDEX('%[A-Za-z0-9@+.e]%', @contents collate SQL_Latin1_General_CP850_Bin))<>0
    BEGIN
      IF @Type='Object' --it will be a 0-n list containing a string followed by a string, number,boolean, or null
        BEGIN
          SELECT
            @SequenceNo=0,@end=CHARINDEX(':', ' '+@contents)--if there is anything, it will be a string-based name.
          SELECT  @start=PATINDEX('%[^A-Za-z@][@]%', ' '+@contents collate SQL_Latin1_General_CP850_Bin)--AAAAAAAA
          SELECT @token=SUBSTRING(' '+@contents, @start+1, @End-@Start-1),
            @endofname=PATINDEX('%[0-9]%', @token collate SQL_Latin1_General_CP850_Bin),
            @param=RIGHT(@token, LEN(@token)-@endofname+1)
          SELECT
            @token=LEFT(@token, @endofname-1),
            @Contents=RIGHT(' '+@contents, LEN(' '+@contents+'|')-@end-1)
          SELECT  @name=stringvalue FROM @strings
            WHERE string_id=@param --fetch the name
        END
      ELSE
        SELECT @Name=null,@SequenceNo=@SequenceNo+1
      SELECT
        @end=CHARINDEX(',', @contents)-- a string-token, object-token, list-token, number,boolean, or null
      IF @end=0
        SELECT  @end=PATINDEX('%[A-Za-z0-9@+.e][^A-Za-z0-9@+.e]%', @Contents+' ' collate SQL_Latin1_General_CP850_Bin)
          +1
       SELECT
         @start=PATINDEX('%[^A-Za-z0-9@+.e][A-Za-z0-9@+.e][\-]%', ' '+@contents collate SQL_Latin1_General_CP850_Bin)
		-- Edited: add more condition [\-] in order to detect negative number 08-20-2014
      --select @start,@end, LEN(@contents+'|'), @contents 
      SELECT
        @Value=RTRIM(SUBSTRING(@contents, @start, @End-@Start)),
        @Contents=RIGHT(@contents+' ', LEN(@contents+'|')-@end)
      IF SUBSTRING(@value, 1, 7)='@object'
        INSERT INTO @hierarchy
          (NAME, SequenceNo, parent_ID, StringValue, Object_ID, ValueType)
          SELECT @name, @SequenceNo, @parent_ID, SUBSTRING(@value, 8, 5),
            SUBSTRING(@value, 8, 5), 'object'
      ELSE
        IF SUBSTRING(@value, 1, 6)='@array'
          INSERT INTO @hierarchy
            (NAME, SequenceNo, parent_ID, StringValue, Object_ID, ValueType)
            SELECT @name, @SequenceNo, @parent_ID, SUBSTRING(@value, 7, 5),
              SUBSTRING(@value, 7, 5), 'array'
        ELSE
          IF SUBSTRING(@value, 1, 7)='@string'
            INSERT INTO @hierarchy
              (NAME, SequenceNo, parent_ID, StringValue, ValueType)
              SELECT @name, @SequenceNo, @parent_ID, stringvalue, 'string'
              FROM @strings
              WHERE string_id=SUBSTRING(@value, 8, 5)
          ELSE
            IF @value IN ('true', 'false')
              INSERT INTO @hierarchy
                (NAME, SequenceNo, parent_ID, StringValue, ValueType)
                SELECT @name, @SequenceNo, @parent_ID, @value, 'boolean'
            ELSE
              IF @value='null'
                INSERT INTO @hierarchy
                  (NAME, SequenceNo, parent_ID, StringValue, ValueType)
                  SELECT @name, @SequenceNo, @parent_ID, @value, 'null'
              ELSE
                IF PATINDEX('%[^0-9]%', @value collate SQL_Latin1_General_CP850_Bin)>0
                  INSERT INTO @hierarchy
                    (NAME, SequenceNo, parent_ID, StringValue, ValueType)
                    SELECT @name, @SequenceNo, @parent_ID, @value, 'real'
                ELSE
                  INSERT INTO @hierarchy
                    (NAME, SequenceNo, parent_ID, StringValue, ValueType)
                    SELECT @name, @SequenceNo, @parent_ID, @value, 'int'
      if @Contents=' ' Select @SequenceNo=0
    END
  END
INSERT INTO @hierarchy (NAME, SequenceNo, parent_ID, StringValue, Object_ID, ValueType)
  SELECT '-',1, NULL, '', @parent_id-1, @type
--
   RETURN
END

GO
/****** Object:  UserDefinedFunction [dbo].[Split]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [dbo].[Split](@String varchar(max), @Delimiter char(1))       
    returns @temptable TABLE (id int identity(1,1), items varchar(max))       
    as       
    begin       
        declare @idx int       
        declare @slice varchar(max)       
          
        select @idx = 1       
            if len(@String)<1 or @String is null  return       
          
        while @idx!= 0       
        begin       
            set @idx = charindex(@Delimiter,@String)       
            if @idx!=0       
                set @slice = left(@String,@idx - 1)       
            else       
                set @slice = @String       
              
            if(len(@slice)>0)  
                insert into @temptable(Items) values(@slice)       
      
            set @String = right(@String,len(@String) - @idx)       
            if len(@String) = 0 break       
        end   
    return       
    end

GO
/****** Object:  UserDefinedFunction [dbo].[SplitCodes]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 CREATE FUNCTION [dbo].[SplitCodes](@str nvarchar(50))       
    returns @temptable TABLE (items varchar(max))       
    as       
    begin       
  		DECLARE @yourDelimiterString VARCHAR(1000)
		DECLARE @teststring VARCHAR(1000)

		SET @yourDelimiterString = '_()*-+-'
		SET @teststring = @str

		;WITH CTE AS
		(
		  SELECT SUBSTRING(@yourDelimiterString, 1, 1) AS [String], 1 AS [Start], 1 AS [Counter]
		  UNION ALL
		  SELECT SUBSTRING(@yourDelimiterString, [Start] + 1, 1) AS [String], [Start] + 1, [Counter] + 1 
		  FROM CTE 
		  WHERE [Counter] < LEN(@yourDelimiterString)
		)

		SELECT @teststring = REPLACE(@teststring, CTE.[String], '</cnt><cnt>') FROM CTE
		if right(@teststring,11) = '</cnt><cnt>'  
		set @teststring=(select substring(@teststring, 1, (len(@teststring) - 11)))
		if left(@teststring,11) = '</cnt><cnt>' 
		set @teststring=Stuff(@teststring, 1, 11, '') 
		Insert into @temptable
		select Item from [dbo].MultipleDelemiterSplit(@teststring) where item like   '[A-Z][A-Z][A-Z]'
    return
	end

GO
/****** Object:  UserDefinedFunction [dbo].[UDF_Carrier_Configured]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 CREATE Function [dbo].[UDF_Carrier_Configured](@PartnerID int) Returns BIT
AS 
Begin  
DECLARE @RegionID INT
SELECT @RegionID = RegionID FROM Partners WHERE PartnerID = @PartnerID
IF EXISTS(SELECT 1 FROM RegionConfigMap WHERE RegionID = @RegionID AND TypeLookUpID in (SELECT TypeLookUpID FROM TypeLookUp WHERE TypeGroup = 'CarrierGateway'))
Begin
	if EXISTS(SELECT 1 FROM RegionConfigMap WHERE RegionID = @RegionID AND TypeLookUpID in (SELECT TypeLookUpID FROM TypeLookUp WHERE Typename = 'Activate') And Upper([Description]) = 'TRUE')
		return 1
End 
return 0
end

GO
/****** Object:  UserDefinedFunction [dbo].[UDF_CheckApprover_PreRequisite]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 CREATE Function [dbo].[UDF_CheckApprover_PreRequisite](@RMAOrderDetailID int, @RoleTypeID INT) Returns BIT
AS 
Begin 
	DECLARE @Quantity FLOAT, @Amount FLOAT, @Source NVARCHAR(50), @RRScope NVARCHAR(50), @ItemModelID INT, @RMAActionCodeID INT, @PartnerID INT, @Value FLOAT, @ItemInfoID INT,
	@ReturnReasonID INT, @ReturnReasonType nvarchar(50)
	SELECT @ItemInfoID = ItemInfo.ItemInfoID, @Quantity = SalesReturnOrderDetail.Quantity, @Amount = (SalesReturnOrderDetail.Quantity * ReturnPrice), @Source = SalesReturnOrderHeader.RMASource, @RRScope = SalesReturnOrderHeader.ReturnReasonType,
	@ItemModelID = ItemModelID, @RMAActionCodeID = SalesReturnOrderDetail.ReturnReasonID, @PartnerID = ISNULL(PartnerParentID, ToPartnerID), @ReturnReasonID = SalesReturnOrderDetail.ReturnReasonID
	, @ReturnReasonType = SalesReturnOrderHeader.ReturnReasonType
	FROM SalesReturnOrderDetail
	INNER JOIN ItemInfo ON ItemInfo.ItemInfoID = SalesReturnOrderDetail.ItemInfoID
	INNER JOIN ItemMaster ON ItemMaster.ItemMasterID = ItemInfo.ItemMasterID
	INNER JOIN SalesReturnOrderHeader ON SalesReturnOrderHeader.SalesReturnOrderHeaderID = SalesReturnOrderDetail.SalesReturnOrderHeaderID
	INNER JOIN Partners ON Partners.PartnerID = SalesReturnOrderHeader.ToPartnerID
	WHERE SalesReturnOrderDetail.SalesReturnOrderDetailID = @RMAOrderDetailID

	set @PartnerID = (SELECT TOP 1 PartnerID FROM Partners P INNER JOIN TypeLookUP T
										ON P.OrgSubTypeID = T.TypeLookUpID
										WHERE T.TypeCode = 'PTR004-04') 


	DECLARE @QuantityRestricted BIT, @GreaterThenMaxRestricted BIT
	IF (@RRScope = 'Account') 
	SELECT @QuantityRestricted = CASE WHEN PRRR.RuleValueEffectTO = 1 THEN 1 ELSE 0 END, @GreaterThenMaxRestricted = CASE WHEN PRRR.RuleValueEffect = 5 THEN 1 ELSE 0 END, @Value = PRRR.IsFixedRuleValue
			FROM PartnerReturnReasonRuleMap PRRR
			INNER JOIN PartnerReturnReasonMap PRR ON PRRR.PartnerReturnReasonMapID = PRR.PartnerReturnReasonMapID
			INNER JOIN ReturnReasonRuleMap RRR ON RRR.ReturnReasonRuleMapID = PRRR.ReturnReasonRuleMapID
			Inner Join TypeLookUp C on C.TypeLookUpId=RRR.RuleControlTypeID
			Inner Join Rules RS on RS.RuleID=RRR.RuleID
			left join SaleReturnOrderDetailReasonValue val on val.[ReturnReasonRuleMapID] = (case when @RMAOrderDetailID=0 then 0 else PRRR.PartnerReturnReasonRuleMapID end) and val.SaleReturnOrderDetailID=@RMAOrderDetailID
			left join [SalesReturnOrderDetail] srd on (val.SaleReturnOrderDetailID = srd.SalesReturnOrderDetailID 
			and srd.SalesReturnOrderDetailID = @RMAOrderDetailID)
			INNER JOIN [dbo].[fn_GetApprovalRole](@ReturnReasonID, @PartnerID, @ReturnReasonType, @ItemInfoID) A ON cast(A.RuleValue as int) = PRRR.RuleValue
			WHERE PRRR.IsActive=1  and  RRR.RMAActionCodeID=@RMAActionCodeID  and PRR.RMAActionCodeID=@RMAActionCodeID and
			PRR.PartnerID = @PartnerID AND C.TypeCode = 'RCT006' AND cast(A.RuleValue as int) = @RoleTypeID
	ELSE
	SELECT @QuantityRestricted = CASE WHEN PRRR.RuleValueEffectTO = 1 THEN 1 ELSE 0 END, @GreaterThenMaxRestricted = CASE WHEN PRRR.RuleValueEffect = 5 THEN 1 ELSE 0 END, @Value = PRRR.IsFixedRuleValue
			FROM ItemModelReturnReasonRuleMap PRRR
			INNER JOIN ItemModelReturnReasonMap PRR ON PRRR.ItemModelReturnReasonMapID = PRR.ItemModelReturnReasonMapID
			INNER JOIN ReturnReasonRuleMap RRR ON RRR.ReturnReasonRuleMapID = PRRR.ReturnReasonRuleMapID
			Inner Join TypeLookUp C on C.TypeLookUpId=RRR.RuleControlTypeID
			Inner Join Rules RS on RS.RuleID=RRR.RuleID
			left join SaleReturnOrderDetailReasonValue val on val.[ReturnReasonRuleMapID] = (case when @RMAOrderDetailID=0 then 0 else PRRR.ItemModelReturnReasonRuleMapID end) and val.SaleReturnOrderDetailID=@RMAOrderDetailID
			left join [SalesReturnOrderDetail] srd on (val.SaleReturnOrderDetailID = srd.SalesReturnOrderDetailID 
			and srd.SalesReturnOrderDetailID = @RMAOrderDetailID)
			INNER JOIN [dbo].[fn_GetApprovalRole](@ReturnReasonID, @PartnerID, @ReturnReasonType, @ItemInfoID) A ON cast(A.RuleValue as int) = PRRR.RuleValue
			WHERE PRRR.IsActive=1  and  RRR.RMAActionCodeID=@RMAActionCodeID  and PRR.RMAActionCodeID=@RMAActionCodeID and
			PRR.ItemModelID = @ItemModelID AND C.TypeCode = 'RCT006' AND cast(A.RuleValue as int) = @RoleTypeID

	DECLARE @ReturnValue BIT
	IF(@QuantityRestricted = CAST(1 AS BIT))
	BEGIN
		IF(@GreaterThenMaxRestricted = CAST(1 AS BIT))
		BEGIN
			SET @ReturnValue = IIF(@Quantity >= @Value, 1, 0)
		END
		ELSE IF(@GreaterThenMaxRestricted = CAST(0 AS BIT))
		BEGIN
			SET @ReturnValue = IIF(@Quantity <= @Value, 1, 0)
		END
	END
	ELSE IF(@QuantityRestricted = CAST(0 AS BIT))
	BEGIN
		IF(@GreaterThenMaxRestricted = CAST(1 AS BIT))
		BEGIN
			SET @ReturnValue = IIF(@Amount >= @Value, 1, 0)
		END
		ELSE IF(@GreaterThenMaxRestricted = CAST(0 AS BIT))
		BEGIN
			SET @ReturnValue = IIF(@Amount >= @Value, 1, 0)
		END
	END
	RETURN @ReturnValue
END

GO
/****** Object:  UserDefinedFunction [dbo].[udf_childCount]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 CREATE FUNCTION [dbo].[udf_childCount](@mid INT)
RETURNS INT
AS
BEGIN 
   RETURN (SELECT COUNT(1) FROM dbo.Module WHERE ParentModuleID = @mid AND ActiveFlag = 1)
END
GO
/****** Object:  UserDefinedFunction [dbo].[udf_convertJsontoXML]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 CREATE FUNCTION [dbo].[udf_convertJsontoXML](
    @json    varchar(max)
)
RETURNS xml
AS

BEGIN
	
    DECLARE @output varchar(max), @key varchar(max), @value varchar(max),
        @recursion_counter int, @offset int, @nested bit, @array bit,
        @tab char(1)=CHAR(9), @cr char(1)=CHAR(13), @lf char(1)=CHAR(10);

    --- Clean up the JSON syntax by removing line breaks and tabs and
    --- trimming the results of leading and trailing spaces:
    SET @json=LTRIM(RTRIM(
        REPLACE(REPLACE(REPLACE(@json, @cr, ''), @lf, ''), @tab, '')));
		
    --- Sanity check: If this is not valid JSON syntax, exit here.
    IF (LEFT(@json, 1)!='{' OR RIGHT(@json, 1)!='}')
        RETURN '';

    --- Because the first and last characters will, by definition, be
    --- curly brackets, we can remove them here, and trim the result.
    SET @json=LTRIM(RTRIM(SUBSTRING(@json, 2, LEN(@json)-2)));

    SELECT @output='';
    WHILE (@json!='') BEGIN;

        --- Look for the first key which should start with a quote.
        IF (LEFT(@json, 1)!='"')
            RETURN 'Expected quote (start of key name). Found "'+
                LEFT(@json, 1)+'"';

        --- .. and end with the next quote (that isn't escaped with
        --- and backslash).
        SET @key=SUBSTRING(@json, 2,
            PATINDEX('%[^\\]"%', SUBSTRING(@json, 2, LEN(@json))+' "'));

        --- Truncate @json with the length of the key.
        SET @json=LTRIM(SUBSTRING(@json, LEN(@key)+3, LEN(@json)));

        --- The next character should be a colon.
        IF (LEFT(@json, 1)!=':')
            RETURN 'Expected ":" after key name, found "'+
                LEFT(@json, 1)+'"!';

        --- Truncate @json to skip past the colon:
        SET @json=LTRIM(SUBSTRING(@json, 2, LEN(@json)));

        --- If the next character is an angle bracket, this is an array.
        IF (LEFT(@json, 1)='[')
            SELECT @array=1, @json=LTRIM(SUBSTRING(@json, 2, LEN(@json)));

        IF (@array IS NULL) SET @array=0;
        WHILE (@array IS NOT NULL) BEGIN;

            SELECT @value=NULL, @nested=0;
            --- The first character of the remainder of @json indicates
            --- what type of value this is.

            --- Set @value, depending on what type of value we're looking at:
            ---
            --- 1. A new JSON object:
            ---    To be sent recursively back into the parser:
            IF (@value IS NULL AND LEFT(@json, 1)='{') BEGIN;
                SELECT @recursion_counter=1, @offset=1;
                WHILE (@recursion_counter!=0 AND @offset<LEN(@json)) BEGIN;
                    SET @offset=@offset+
                        PATINDEX('%[{}]%', SUBSTRING(@json, @offset+1,
                            LEN(@json)));
                    SET @recursion_counter=@recursion_counter+
                        (CASE SUBSTRING(@json, @offset, 1)
                            WHEN '{' THEN 1
                            WHEN '}' THEN -1 END);
                END;

                SET @value=CAST(
                    [dbo].udf_convertJsontoXML(LEFT(@json, @offset))
                        AS varchar(max));
                SET @json=SUBSTRING(@json, @offset+1, LEN(@json));
                SET @nested=1;
            END

            --- 2a. Blank text (quoted)
            IF (@value IS NULL AND LEFT(@json, 2)='""')
                SELECT @value='', @json=LTRIM(SUBSTRING(@json, 3,
                    LEN(@json)));

            --- 2b. Other text (quoted, but not blank)
            IF (@value IS NULL AND LEFT(@json, 1)='"') BEGIN;
                SET @value=SUBSTRING(@json, 2,
                    PATINDEX('%[^\\]"%',
                        SUBSTRING(@json, 2, LEN(@json))+' "'));
                SET @json=LTRIM(
                    SUBSTRING(@json, LEN(@value)+3, LEN(@json)));
            END;

            --- 3. Blank (not quoted)
            IF (@value IS NULL AND LEFT(@json, 1)=',')
                SET @value='';

            --- 4. Or unescaped numbers or text.
            IF (@value IS NULL) BEGIN;
                SET @value=LEFT(@json,
                    PATINDEX('%[,}]%', REPLACE(@json, ']', '}')+'}')-1);
                SET @json=SUBSTRING(@json, LEN(@value)+1, LEN(@json));
            END;

            --- Append @key and @value to @output:
            SET @output=@output+@lf+@cr+
                REPLICATE(@tab, @@NESTLEVEL-1)+
                '<'+@key+'>'+
                    ISNULL(REPLACE(
                        REPLACE(@value, '\"', '"'), '\\', '\'), '')+
                    (CASE WHEN @nested=1
                        THEN @lf+@cr+REPLICATE(@tab, @@NESTLEVEL-1)
                        ELSE ''
                    END)+
                '</'+@key+'>';

            --- And again, error checks:
            ---
            --- 1. If these are multiple values, the next character
            ---    should be a comma:
            IF (@array=0 AND @json!='' AND LEFT(@json, 1)!=',')
                RETURN @output+'Expected "," after value, found "'+
                    LEFT(@json, 1)+'"!';

            --- 2. .. or, if this is an array, the next character
            --- should be a comma or a closing angle bracket:
            IF (@array=1 AND LEFT(@json, 1) NOT IN (',', ']'))
                RETURN @output+'In array, expected "]" or "," after '+
                    'value, found "'+LEFT(@json, 1)+'"!';

            --- If this is where the array is closed (i.e. if it's a
            --- closing angle bracket)..
            IF (@array=1 AND LEFT(@json, 1)=']') BEGIN;
                SET @array=NULL;
                SET @json=LTRIM(SUBSTRING(@json, 2, LEN(@json)));

                --- After a closed array, there should be a comma:
                IF (LEFT(@json, 1) NOT IN ('', ',')) BEGIN
                    RETURN 'Closed array, expected ","!';
                END;
            END;

            SET @json=LTRIM(SUBSTRING(@json, 2, LEN(@json)+1));
            IF (@array=0) SET @array=NULL;

        END;
    END;
	set @output=Replace(Replace(replace(@output,'&','&amp;'),'"','&quot;'),'''','&apos;')
    --- Return the output:
    RETURN CAST(@output AS xml);
END;

GO
/****** Object:  UserDefinedFunction [dbo].[udf_convertUTCtoPST]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 CREATE Function [dbo].[udf_convertUTCtoPST](@cdate datetime)
returns datetime
as
begin
declare @retdate datetime=@cdate
declare @dat datetime='01-01-'+cast(datepart(YEAR,@cdate) as varchar)
Declare @StartDaylight datetime,@EndDaylight datetime
select @StartDaylight=DATEADD(HOUR, 7, DATEADD(DAY,(7-DATEPART(WEEKDAY,DATEADD(MONTH,2,@dat))+1)%7
    +7,DATEADD(MONTH,2,@dat))),
 -- Last Sunday in October (< 2007) or first Sunday in November (>= 2007):
 @EndDaylight=DATEADD(HOUR, 6, DATEADD(DAY,(7-DATEPART(WEEKDAY,DATEADD(MONTH,10,@dat))+1)%7,DATEADD(MONTH,10,@dat)))
 if(@cdate between @StartDaylight and @EndDaylight)
 begin
	set @retDate= dateadd(minute,-480,@cdate)
 end
 Else 
 begin
	set @retDate= dateadd(minute,-420,@cdate)
 end
 return @retDate
 end

GO
/****** Object:  UserDefinedFunction [dbo].[udf_convertXMLtoJson]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
--select dbo.[udf_GetFormdetails]('ItemMaster')
CREATE Function [dbo].[udf_convertXMLtoJson](@xmlData xml)
returns nvarchar(max)
as
begin
declare @retstr nvarchar(max)=''
SELECT @retstr=Stuff(  
  (SELECT * from  
    (SELECT ',
    {'+  
      Stuff((SELECT ',"'+coalesce(b.c.value('local-name(.)', 'NVARCHAR(MAX)'),'')+'":"'+
                    isnull(b.c.value('text()[1]','NVARCHAR(MAX)'),'') +'"'
               
             from x.a.nodes('*') b(c)  
             for xml path(''),TYPE).value('(./text())[1]','NVARCHAR(MAX)')
        ,1,1,'')+'}' 
   from @xmlData.nodes('/root/*') x(a)  
   ) JSON(theLine)  
  for xml path(''),TYPE).value('.','NVARCHAR(MAX)' )
,1,1,'')
return @retstr
end

GO
/****** Object:  UserDefinedFunction [dbo].[udf_customer_type]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE Function [dbo].[udf_customer_type](@type NVARCHAR(50)) returns NVARCHAR(50)
AS
Begin
    declare @customer_type NVARCHAR(50)
    IF(@type = 'Ecom')
        SET @customer_type = 'General'
    ELSE IF(@type = 'EMP' OR @type = 'OPE')
        SET @customer_type = 'Employee'
    ELSE IF(@type = 'HOOK' OR @type = 'KOTF')
        SET @customer_type = 'KOTF'
    ELSE IF(@type = 'VIP' OR @type = 'VIP2' OR @type = 'VIP+')
        SET @customer_type = 'VIP'
    ELSE IF(@type = 'PRO' OR @type = 'PRO2' OR @type = 'PRO3' OR @type = 'PRO4')
        SET @customer_type = 'PRO' 
    ELSE IF(@type = 'CORP' OR @type = 'CORP2')
        SET @customer_type = 'CORP'
    ELSE IF(@type = 'TEAM0' OR @type = 'TEAM1' OR @type = 'TEAM2' OR @type = 'TEAM3' OR @type = 'TEAMC')
        SET @customer_type = 'TEAM' 
    ELSE
        SET @customer_type = @type
    Return @customer_type

End

GO
/****** Object:  UserDefinedFunction [dbo].[udf_find_main_category]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE Function [dbo].[udf_find_main_category](@sub_category_type NVARCHAR(50))
 returns NVARCHAR(50)
AS
Begin
    declare @main_category_type NVARCHAR(50)
    IF(@sub_category_type = 'MIDLAYERS [PIM_1397]')
        SET @main_category_type = 'Clothing / midlayers'
    ELSE IF(@sub_category_type = 'JERSEY [PIM_1391]')
        SET @main_category_type = 'Clothing / Tops'
    ELSE IF(@sub_category_type = 'BAGS &amp; PACKS [PIM_2658]')
        SET @main_category_type = 'Bags & Packs'
    ELSE IF(@sub_category_type = 'TRAVEL BAGS [PIM_1430]')
        SET @main_category_type = 'Bags & Packs / Travel & Equipments bags'
    ELSE IF(@sub_category_type = 'ACCESSORIES [PIM_1376]')
        SET @main_category_type= 'Accessories (BU ?)' 
    ELSE IF(@sub_category_type = 'EQUIPMENT BAGS [PIM_1383]')
        SET @main_category_type= 'Bags & Packs / Travel & Equipments bags'
    ELSE IF(@sub_category_type = 'GLOVES [PIM_1385]' or @sub_category_type='HEADWEAR [PIM_1387]' or @sub_category_type='HATS &amp; CAPS [PIM_1386]' or @sub_category_type='SOCKS [PIM_1424]')
        SET @main_category_type = 'Clothing / accessories' 
    ELSE IF(@sub_category_type = 'SAL  Helmets [PIM_1406]')
        SET @main_category_type = 'Protective & Goggles / helmets'
    ELSE IF(@sub_category_type = 'SAL Goggles [PIM_1412]')
        SET @main_category_type = 'Protective & Goggles / goggles'
    ELSE IF(@sub_category_type = 'Salomon Body Protection [PIM_1425]')
        SET @main_category_type = 'Protective & Goggles / Back protection'
    ELSE IF(@sub_category_type = 'SAL Eyewear [PIM_1411]')
        SET @main_category_type = 'Protective & Goggles / Sunglasses'
		else if (@sub_category_type='SAL Alpine Skis [PIM_1410]')
		set @main_category_type='Alpine equipment / Skis'
		else if (@sub_category_type='SAL Alpine Bindings [PIM_1407]')
		set @main_category_type='Alpine equipment / bindings'
		else if (@sub_category_type='SAL Alpine Boots [PIM_1408]')
		set @main_category_type='Alpine equipment / boots'
		else if (@sub_category_type='SAL Alpine Poles [PIM_1409]')
		set @main_category_type='Alpine equipment / poles'

    ELSE IF(@sub_category_type = 'SAL XC Skis [PIM_1419]')
        SET @main_category_type= 'Nordic equipment / skis' 
    ELSE IF(@sub_category_type = 'SAL XC Bindings [PIM_1416]')
        SET @main_category_type= 'Nordic equipment /bindings'
    ELSE IF(@sub_category_type = 'SAL XC Boots [PIM_1417]' )
        SET @main_category_type = 'Nordic equipment / boots' 
	 ELSE IF(@sub_category_type = 'SAL XC Skis [PIM_1419]')
        SET @main_category_type= 'Nordic equipment / skis' 
    ELSE IF(@sub_category_type = 'SAL XC Bindings [PIM_1416]')
        SET @main_category_type= 'Nordic equipment /bindings'
    ELSE IF(@sub_category_type = 'SAL XC Boots [PIM_1417]' )
        SET @main_category_type = 'Nordic equipment / boots' 	
     ELSE IF(@sub_category_type = 'SAL XC Poles [PIM_1418]')
        SET @main_category_type= 'Nordic equipment / poles' 
    ELSE IF(@sub_category_type = 'SAL SB Boards [PIM_1414]')
        SET @main_category_type= 'Snowboard equipment / boards'
    ELSE IF(@sub_category_type = 'SAL SB Bindings [PIM_1413]' )
        SET @main_category_type = 'Snowboard equipment / bindings' 	
   ELSE IF(@sub_category_type = 'SAL SB Boots [PIM_1415]')
        SET @main_category_type= 'Snowboard equipment / boots' 
    ELSE IF(@sub_category_type = 'ME :sh Running [PIM_1394]')
        SET @main_category_type= 'Shoes / trail running'
    ELSE IF(@sub_category_type = 'ME :sh Trail Running [PIM_1395]' )
        SET @main_category_type = 'Shoes / trail running' 
   ELSE IF(@sub_category_type = 'Spare parts [PIM_1426]')
        SET @main_category_type= 'Accessories (BU ?)' 
    ELSE IF(@sub_category_type = 'RECOVERY [PIM_1402]')
        SET @main_category_type= 'Shoes  / sandals and water shoes'
    ELSE IF(@sub_category_type = 'FORCES [PIM_1384]' )
        SET @main_category_type = 'Forces collection (NAM only)' 
	ELSE IF(@sub_category_type = 'SANDALS & WATERSHOES [PIM_1420]')
        SET @main_category_type= 'Shoes  / sandals and water shoes' 
    ELSE IF(@sub_category_type = 'BACKPACKING [PIM_1377]')
        SET @main_category_type= 'Shoes /hiking'
    ELSE IF(@sub_category_type = 'S-LAB ENDURANCE [PIM_1404]' )
        SET @main_category_type = 'NoShoes / trail running' 	
     ELSE IF(@sub_category_type = 'RUNNING [PIM_1403]')
        SET @main_category_type= 'shoes / running' 
    ELSE IF(@sub_category_type = 'KIDS [PIM_1392]')
        SET @main_category_type= 'KIDS / Shoes'
    ELSE IF(@sub_category_type = 'WINTER [PIM_1431]' )
        SET @main_category_type = 'Shoes / winter' 	
   ELSE IF(@sub_category_type = 'MOUNTAIN.& APPROACH [PIM_1398]' or @sub_category_type='HIKING & MULTIFUNC. [PIM_1388]')
        SET @main_category_type= 'Shoes / Hiking' 
    ELSE IF(@sub_category_type = 'LIFESTYLE [PIM_1393]')
        SET @main_category_type= 'Collection Advanced'
    ELSE IF(@sub_category_type = 'TRAIL RUNNING [PIM_1429]' )
        SET @main_category_type = 'Shoes / trail running' 
        
    ELSE IF(@sub_category_type = 'BASELAYERS [PIM_2657]')
        SET @main_category_type= 'Clothings / Tops / Tights'
    ELSE IF(@sub_category_type = 'DRESS [PIM_2656]' )
        SET @main_category_type = 'Clothing / dress (future not online)' 
	 ELSE IF(@sub_category_type = 'MID LAYER [PIM_1396]')
        SET @main_category_type= 'Clothing / midlayers' 
    ELSE IF(@sub_category_type = 'BRA [PIM_1380]')
        SET @main_category_type= 'Clothing / sports bras'
    ELSE IF(@sub_category_type = 'BASELAYER [PIM_1379]' )
        SET @main_category_type = 'Clothings / Tops / Tights' 	
     ELSE IF(@sub_category_type = 'SHIRT [PIM_1421]')
        SET @main_category_type= 'Clothings / Tops ' 
    ELSE IF(@sub_category_type = 'TIGHTS [PIM_1428]')
        SET @main_category_type= 'Clothings /Tights'
    ELSE IF(@sub_category_type = 'BRAS [PIM_1381]' )
        SET @main_category_type = 'Clothing / sports bras' 	
   ELSE IF(@sub_category_type = 'PANTS [PIM_1400]' )
        SET @main_category_type= 'Clothing / pants' 
    ELSE IF(@sub_category_type = 'SKIRTS [PIM_1423]' or @sub_category_type='SHORTS [PIM_1422]')
        SET @main_category_type= 'Clothing / shorts'
    ELSE IF(@sub_category_type = 'JACKETS [PIM_1390]' )
        SET @main_category_type = 'Clothing / jackets'
    ELSE IF(@sub_category_type = 'TEES [PIM_1427]')
        SET @main_category_type= 'Clothings / Tops '
    ELSE IF(@sub_category_type = 'SAL Alpine   accessories [PIM_2659]' or @sub_category_type='SAL Alpine   Parts & After Market [PIM_2669]' )
        SET @main_category_type = 'Alpine equipment / accessories' 
	 ELSE IF(@sub_category_type = 'SAL Protective   Parts & After Market [PIM_2685]')
        SET @main_category_type= 'Protective & Goggles / accessories' 
    ELSE IF(@sub_category_type = 'HATS & CAPS [PIM_5749]')
        SET @main_category_type= 'Clothing / accessories'
    ELSE IF(@sub_category_type = 'EQUIPMENT BAG [PIM_5744]' )
        SET @main_category_type = 'Bags & Packs / Travel & Equipments bags' 	
     ELSE IF(@sub_category_type = 'Packs [PIM_5745]')
        SET @main_category_type= 'Bags & Packs / backpacking' 
    ELSE IF(@sub_category_type = 'BAGS & PACKS [PIM_5746]' or @sub_category_type='TRAVEL BAGS [PIM_5747]' or @sub_category_type='EQUIPMENT BAGS! [PIM_6547]')
        SET @main_category_type= 'Bags & Packs / Travel & Equipments bags'
    ELSE IF(@sub_category_type = 'SHIRTS [PIM_5748]' )
        SET @main_category_type = 'Clothings / Tops' 	
	ELSE IF(@sub_category_type = 'Bra [PIM_5750]' )
        SET @main_category_type= 'Clothing / sports bras' 
    ELSE IF(@sub_category_type = 'GHW = Headwear [PIM_2716]')
        SET @main_category_type= 'Clothing / accessories'
    ELSE IF(@sub_category_type = 'SHIRTS [PIM_6546]')
        SET @main_category_type = 'Clothings / Tops'
		-----------------
	ELSE IF(@sub_category_type = 'ACCESSORIES APPAREL [PIM_6561]')
        SET @main_category_type= 'Clothing / accessories'
    ELSE IF(@sub_category_type = 'ACCESSORIES (BAGS) [PIM_7820]') --or @sub_category_type='SAL Alpine   Parts & After Market [PIM_2669]' )
        SET @main_category_type = 'Bags & Packs / accessories' 
	 ELSE IF(@sub_category_type = 'POLOS [PIM_7823]')
        SET @main_category_type= 'Clothings / Tops ' 
    ELSE IF(@sub_category_type = 'VESTS [PIM_7822]')
        SET @main_category_type= 'Clothing / jackets'
    ELSE IF(@sub_category_type = 'SAL Board   Parts & After Market [PIM_2673]' )
        SET @main_category_type = 'Snowboard equipment / accessories' 	
     ELSE IF(@sub_category_type = 'ACCESSORIES APPAREL [PIM_7821]')
        SET @main_category_type= 'ACCESSORIES APPAREL [PIM_7821]' 
    ELSE IF(@sub_category_type = 'BELTS [PIM_8427]') --or @sub_category_type='TRAVEL BAGS [PIM_5747]' or @sub_category_type='EQUIPMENT BAGS! [PIM_6547]')
        SET @main_category_type= 'Bags & Packs / sports belts'
    ELSE IF(@sub_category_type = 'DRESSES & SKIRTS [PIM_11903]' )
        SET @main_category_type = 'Clothing / shorts (future dress & skirts)' 	
		
		--------------
    --ELSE
       -- SET @main_category_type = @sub_category_type
    Return @main_category_type

End

GO
/****** Object:  UserDefinedFunction [dbo].[udf_GenerateAutoNumber]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
--select dbo.[udf_GenerateAutoNumber](1,'ItemMaster','ItemNumber',1)
CREATE Function [dbo].[udf_GenerateAutoNumber](@RuleID int,@TableName nvarchar(100),@FieldName nvarchar(100), @LocationID int)
returns nvarchar(max)
as
begin
 Declare @string as nvarchar(max) = '<PrefixAsYearFourDigit>PL_<PrefixAsMonth><PrefixAsCurrentLocationCode>'
, @PrefixName as Nvarchar(max)
, @PrefixValue as Nvarchar(max)
, @PrefixQuery as Nvarchar(max)
,@numberLength as int

--Select * from KeyFieldAutoGenRule
select @string=Prefix,@numberLength=numberLength from KeyFieldAutoGenRule where KeyFieldAutoGenRuleID=@RuleID

--PJ_<PrefixAsCurrentLocationCode><PrefixAsYearFourDigit><PrefixAsMonth>
--select * from prefixmaster
set @string=replace(@string,'<PrefixAsYearFourDigit>',(Select Substring(Cast(Year(GetDate()) as Nvarchar),1,4)))
set @string=replace(@string,'<PrefixAsYearTwoDigit>',(Select Substring(Cast(Year(GetDate()) as Nvarchar),3,4)))
set @string=replace(@string,'<PrefixAsMonth>',(SELECT RIGHT('00'+Cast(Month(Getdate()) as Varchar(2)),2)))
set @string=replace(@string,'<PrefixAsDate>',(SELECT RIGHT('00'+Cast(Day(Getdate()) as Varchar(2)),2)))
set @string=replace(@string,'<PrefixAsCurrentLocationCode>',(Select FacilityCode from Facility where FacilityID = @LocationID))

declare @num1 nvarchar(100)
declare @sql nvarchar(Max)='(select '''+@string+''' +Right(REPLICATE(''0'','+cast(@numberLength as nvarchar(10))+')+cast(isnull(cast(max(SUBSTRING('+@FieldName+',len('''+@string+''')+1,LEN('+@FieldName+'))) as int),0)+1 as nvarchar(max)),'+cast(@numberLength as nvarchar(10))+') from '+@TableName+' where '+@FieldName+' like'''+@string+'%'')'
--exec sp_executeSQL @sql,N'@num nvarchar(100) out',@num=@num1 out

--declare @number int=cast(@num1 as int)
--select @sql,@num1,@number,'PJ_#2524201601'+Right(REPLICATE('0',10)+cast(isnull(@number,0)+1 as nvarchar(max)),10)

--select @string,@sql

--set @returns= @sql--@string +Right(REPLICATE('0',10)+cast(isnull(@number,0)+1 as nvarchar(max)),10)
return @sql
 end

GO
/****** Object:  UserDefinedFunction [dbo].[udf_get_return_reasons]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [dbo].[udf_get_return_reasons]
(
@brand_code NVARCHAR(50),
@LanguageCode NVARCHAR(50)
) 
RETURNS NVARCHAR(MAX)
AS
BEGIN
    DECLARE @parent_return_reasons NVARCHAR(MAX)

	--IF(@brand_code='suu')
	--	BEGIN
			;WITH CTE AS
				(
				select DISTINCT 
				CRR.CategoryID,
				CRR.RMAActionCodeID,
				CRR.FileRequired as file_required,
				CRR.CommentRequired as comment_required,
				CRR.ApprovalRequired as approval_required,
				CRR.onBO as on_BO, 
				CRR.onCP as on_CP,
				RAC.RMAActionCode as category_code,
				RAC.RMAActionName as category_name
				from RMAActionCode RAC
				inner join TypeLookUp TLU on TLU.TypeLookUpId=RMAActionTypeID
				INNER JOIN CategoryReturnReason CRR ON CRR.CategoryID=RAC.RMAActionCodeID 
				where TLU.TypeCode='RR005' AND CASE WHEN ISJSON(RAC.Parameters)=1 THEN dbo.fn_brandExists(RAC.Parameters,@brand_code) ELSE 0 END = CAST(1 AS BIT)
				)

				SELECT @parent_return_reasons=
				ISNULL(
				(SELECT DISTINCT 
				RAC.RMAActionCodeID,
				RAC.RMAActionCode as rma_action_code,
				CASE WHEN (JSON_VALUE(RAC.RMAActionName, '$.'+REPLACE(LOWER(@LanguageCode), '-', ''))='' OR JSON_VALUE(RAC.RMAActionName, '$.'+REPLACE(LOWER(@LanguageCode), '-', '')) IS NULL) THEN (JSON_VALUE(RAC.RMAActionName, '$.enus')) ELSE JSON_VALUE(RAC.RMAActionName, '$.'+REPLACE(LOWER(@LanguageCode), '-', '')) END rma_action_name,
				CTE.file_required,
				CTE.comment_required,
				CTE.approval_required,
				CTE.on_BO, 
				CTE.on_CP,
				CTE.category_code,
				CTE.category_name
				FROM RMAActionCode RAC
				Inner JOIN RMAActionCode RACParent 
				ON RACParent.parentId=RAC.RMAActionCodeID
				INNER join CTE ON CTE.RMAActionCodeId=RACParent.parentId
				--AND CTE.category_name='Suunto' 
				FOR JSON PATH)
				,'[]')
			--SELECT @parent_return_reasons = 
			--ISNULL(
			--JSON_QUERY((SELECT DISTINCT 
			--RAC.RMAActionCodeID,
			--RAC.RMAActionCode as rma_action_code,
			--CASE WHEN (JSON_VALUE(RAC.RMAActionName, '$.'+REPLACE(LOWER(@LanguageCode), '-', ''))='' OR JSON_VALUE(RAC.RMAActionName, '$.'+REPLACE(LOWER(@LanguageCode), '-', ''))=NULL) THEN (JSON_VALUE(RAC.RMAActionName, '$.enus')) ELSE JSON_VALUE(RAC.RMAActionName, '$.'+REPLACE(LOWER(@LanguageCode), '-', '')) END rma_action_name
			--FROM RMAActionCode RAC
			--Inner JOIN RMAActionCode RACParent 
			--ON RACParent.parentId=RAC.RMAActionCodeID)),'[]')
			--WITH CTE AS
			--	(
			--	select DISTINCT 
			--	CRR.CategoryID,
			--	CRR.RMAActionCodeID,
			--	CRR.FileRequired as file_required,
			--	CRR.CommentRequired as comment_required,
			--	CRR.ApprovalRequired as approval_required,
			--	CRR.onBO as on_BO, 
			--	CRR.onCP as on_CP,
			--	RAC.RMAActionCode as category_code,
			--	RAC.RMAActionName as category_name
			--	from RMAActionCode RAC
			--	inner join TypeLookUp TLU on TLU.TypeLookUpId=RMAActionTypeID
			--	INNER JOIN CategoryReturnReason CRR ON CRR.CategoryID=RAC.RMAActionCodeID 
			--	where TLU.TypeCode='RR005' AND CASE WHEN ISJSON(RAC.Parameters)=1 THEN amer.fn_brandExists(RAC.Parameters,@brand_code) ELSE 0 END = CAST(1 AS BIT)
			--	)
			--	Select
			--		@return_reasons = ISNULL((
			--	select distinct 
			--	RAC.RMAActionCode as rma_action_code,
			--	CASE WHEN (JSON_VALUE(RAC.RMAActionName, '$.'+REPLACE(LOWER(@LanguageCode), '-', ''))='' OR JSON_VALUE(RAC.RMAActionName, '$.'+REPLACE(LOWER(@LanguageCode), '-', ''))=NULL) THEN (JSON_VALUE(RAC.RMAActionName, '$.enus')) ELSE JSON_VALUE(RAC.RMAActionName, '$.'+REPLACE(LOWER(@LanguageCode), '-', '')) END rma_action_name,
			--	CTE.file_required,
			--	CTE.comment_required,
			--	CTE.approval_required,
			--	CTE.on_BO, 
			--	CTE.on_CP,
			--	CTE.category_code,
			--	CTE.category_name
			--	from RMAActionCode RAC
			--	inner join TypeLookUp TLU on TLU.TypeLookUpId=RMAActionTypeID
			--	INNER JOIN CTE ON CTE.RMAActionCodeID=RAC.RMAActionCodeID
			--	where TLU.TypeCode='RR001' --AND uniq=1
			--	FOR JSON PATH),'[]') 
			--	--ReturnReasons
		--END
	--ELSE
	--	BEGIN
	--		SET @parent_return_reasons='[]'
	--	END

    RETURN @parent_return_reasons

End




GO
/****** Object:  UserDefinedFunction [dbo].[udf_GetFormdetails]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
--select dbo.[udf_GetFormdetails]('ItemMaster','Detail')
CREATE Function [dbo].[udf_GetFormdetails](@formName nvarchar(50),@Type nvarchar(50))
returns nvarchar(max)
as
begin
declare @formID int,@Formtitle nvarchar(50)
select @formID=FormListID,@Formtitle=DisplayFormName from FormList where FormName=@formName


declare @xml xml

if(@Type='Detail')
set @xml=(select (select FormCustFieldID field_id,CustFieldName field_name,CustFieldAlias field_title,TypeCode field_type,
isRequired field_required,isdisable field_disabled,'[]'field_option from FormCustField
where FormCustFieldID=fcf.FormCustFieldID for xml path(''),type)
from formlist fl
Inner join FormConfig fc on fl.FormListID=fc.FormListID
Inner Join FormConfigCustFieldMap fcm on fcm.FormConfigID=fc.FormConfigID
inner join FormCustField fcf on fcm.FormCustFieldID=fcf.FormCustFieldID
inner join TypeLookUp tl on fcf.ControlTypeLookupID=tl.TypeLookUpID
where fl.FormName=@formName and ishidden=0 order by fcm.SortOrder for xml path('form_fields'),root)
else
set @xml=(select (select FormCustFieldID field_id,CustFieldName field_name,CustFieldAlias field_title,TypeCode field_type,
isRequired field_required,isdisable field_disabled,'[]'field_option from FormCustField
where FormCustFieldID=fcf.FormCustFieldID for xml path(''),type)
from formlist fl
Inner join FormConfig fc on fl.FormListID=fc.FormListID
Inner Join FormConfigCustFieldMap fcm on fcm.FormConfigID=fc.FormConfigID
inner join FormCustField fcf on fcm.FormCustFieldID=fcf.FormCustFieldID
inner join TypeLookUp tl on fcf.ControlTypeLookupID=tl.TypeLookUpID
where fl.FormName=@formName and fcm.ShowInGrid=1 order by fcm.SortOrder  for xml path('form_fields'),root)


--**************************Convert XML to json**************************
declare @retstr nvarchar(max)=''
SELECT @retstr='['+[dbo].udf_convertXMLtoJson(@xml)+']'
set @retstr='{ "form_id": "'+cast(@formID as nvarchar)+'",
        "form_name": "'+@Formtitle+'","form_fields":'+replace(@retstr,'"[]"','[]')+'}'
		set @retstr=replace(@retstr,'"field_required":"1"','"field_required":true')
		set @retstr=replace(@retstr,'"field_required":"0"','"field_required":false')
		set @retstr=replace(@retstr,'"field_disabled":"1"','"field_disabled":true')
		set @retstr=replace(@retstr,'"field_disabled":"0"','"field_disabled":false')
return @retstr
end

GO
/****** Object:  UserDefinedFunction [dbo].[udf_getReturnedProductsList]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:      <Rohit Pathak>
-- Create Date: <29-Apr-2019>
-- Description: <For selecting returned items list>
-- =============================================
CREATE FUNCTION [dbo].[udf_getReturnedProductsList]
(
    @return_number nvarchar(200)
)
RETURNS nvarchar(max)
AS
BEGIN
  
DECLARE @tempTable TABLE(Product nvarchar(max), Quantity INT, ReturnReason nvarchar(max));

insert into @tempTable
select rd.product_name,rd.return_qty,
CASE WHEN (JSON_VALUE(RC.RMAActionName, '$.'+REPLACE(JSON_VALUE(rh.extra, '$.language'), '-', ''))='' OR JSON_VALUE(RC.RMAActionName, '$.'+REPLACE(JSON_VALUE(rh.extra, '$.language'), '-', '')) is NULL) THEN (JSON_VALUE(RC.RMAActionName, '$.enus')) ELSE JSON_VALUE(RC.RMAActionName, '$.'+REPLACE(JSON_VALUE(rh.extra, '$.language'), '-', '')) END RMAActionName
--RC.RMAActionName 
from return_header rh
inner join return_detail rd on rd.return_header_id=rh.return_header_id
left JOIN RMAActionCode RC on RC.RMAActionCodeID=rd.return_reason_id
where rh.return_number=@return_number

DECLARE @html NVARCHAR(MAX);
SET @html = N'';

SET @html='<table style="width:100%;">
							<tbody>
								<tr>
									<th>Product</th>
									<th>Quantity</th>
									<th>Return Reason</th>
								</tr>'

SELECT @html=@html+'<tr><td>'+Product+'</td>'+'<td>'+CAST(Quantity as nvarchar(5))+'</td>'+'<td>'+ReturnReason+'</td></tr>' from @tempTable
SELECT @html = @html + '</tbody></table>';
return @html;

END

GO
/****** Object:  UserDefinedFunction [dbo].[udf_hasADPActionCode]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 


CREATE Function [dbo].[udf_hasADPActionCode](@RepairActionCodes nvarchar(max)) returns bit
as
Begin
DECLARE @RepairActionCodeID INT 
SELECT @RepairActionCodeID = RMAActionCodeID FROM RMAActionCode WHERE RMAActionCode = 'OTH002'
if EXISTS(SELECT 1 FROM OPENJSON(@RepairActionCodes) WHERE JSON_VALUE(value, '$.RMAActionCodeID') = @RepairActionCodeID AND ISJSON(@RepairActionCodes) > 0)		
Begin
	Return 1
End

Return 0

End

GO
/****** Object:  UserDefinedFunction [dbo].[udf_hasCIDActionCode]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 


CREATE Function [dbo].[udf_hasCIDActionCode](@RepairActionCodes nvarchar(max)) returns bit
as
Begin
DECLARE @RepairActionCodeID INT 
SELECT @RepairActionCodeID = RMAActionCodeID FROM RMAActionCode WHERE RMAActionCode = 'OTH001'
if EXISTS(SELECT 1 FROM OPENJSON(@RepairActionCodes) WHERE JSON_VALUE(value, '$.RMAActionCodeID') = @RepairActionCodeID AND ISJSON(@RepairActionCodes) > 0)		
Begin
	Return 1
End

Return 0

End

GO
/****** Object:  UserDefinedFunction [dbo].[udf_PartPrice]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 


CREATE Function [dbo].[udf_PartPrice](@RMAOrderDetailID INT, @RepairActionCodes nvarchar(max), @ItemPrice float, @ItemPriceIW float, @MarkUp float, @isMarkupOnPercentage bit) returns float
as
Begin
declare @price float, @IWStatus bit
SELECT @IWStatus = CASE WHEN t.TypeCode = 'WAR001' then 1 else 0 end FROM RMAOrderDetail d INNER JOIN ItemInfo i ON i.ItemInfoID = d.ItemInfoID 
INNER JOIN TypeLookUp t ON t.TypeLookUpID = i.WarrantyStatusID
WHERE d.RMAOrderdetailID = @RMAOrderDetailID

select @price = (case when [dbo].udf_hasCIDActionCode(@RepairActionCodes) = 1 then(
					case when @isMarkupOnPercentage = 1 
					then @ItemPrice+@ItemPrice* CAST(@MarkUp AS FLOAT)/100
					else @ItemPrice+ CAST(@MarkUp AS FLOAT) end)
				when [dbo].udf_hasADPActionCode(@RepairActionCodes)=1 then (
					case when @isMarkupOnPercentage = 1 
					then @ItemPriceIW+@ItemPriceIW* CAST(@MarkUp AS FLOAT)/100 
					else @ItemPriceIW+ CAST(@MarkUp AS FLOAT) end)
				when @IWStatus <> 1 then (
					case when @isMarkupOnPercentage = 1 
					then @ItemPrice+@ItemPrice* CAST(@MarkUp AS FLOAT)/100
					else @ItemPrice+ CAST(@MarkUp AS FLOAT) end)
				when @IWStatus = 1 then (
					case when @isMarkupOnPercentage = 1 
					then @ItemPriceIW+@ItemPriceIW* CAST(@MarkUp AS FLOAT)/100
					else @ItemPriceIW+ CAST(@MarkUp AS FLOAT) end)
				else 0 end)

Return @price

End

GO
/****** Object:  UserDefinedFunction [dbo].[UDF_Repair_CanAllocate]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 


CREATE Function [dbo].[UDF_Repair_CanAllocate](@RepairPartID int) returns bit
as
begin
if exists(select 1 from RepairItemContextHistory where RMARepairPartID=@RepairPartID)
return 0


Return 1

end

GO
/****** Object:  UserDefinedFunction [dbo].[UDF_Repair_CanConsume]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 


CREATE Function [dbo].[UDF_Repair_CanConsume](@RepairPartID int) returns bit
as
Begin
Declare @AllocateStatusID int=(select StatusID from statuses where StatusCode='ST001')
Declare @ConsumedStatusID int=(select StatusID from statuses where StatusCode='ST001A')
if exists(Select 1 from RepairItemContextHistory where RMARepairPartID=@RepairPartID and ItemStatusID=@AllocateStatusID)
Begin
	if exists(Select 1 from RepairItemContextHistory where RMARepairPartID=@RepairPartID and ItemStatusID=@ConsumedStatusID)
		Return 0
	else
		Return 1
End

Return 1
End

GO
/****** Object:  UserDefinedFunction [dbo].[udf_returns_category]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE Function [dbo].[udf_returns_category](@sub_category_type NVARCHAR(150)) returns NVARCHAR(50)
AS
Begin
    declare @main_category_type NVARCHAR(50)
    IF(@sub_category_type = 'Default')
      SET @main_category_type = 'FFT00105'
	    IF(@sub_category_type = 'Default Custom')
      SET @main_category_type = 'Default Custom'
	 else IF(@sub_category_type = 'MIDLAYERS [PIM_1397]')
        SET @main_category_type = 'Clothing / midlayers'
    ELSE IF(@sub_category_type = 'JERSEY [PIM_1391]')
        SET @main_category_type = 'Clothings / Tops'
    ELSE IF(@sub_category_type = 'BAGS &amp; PACKS [PIM_2658]')
        SET @main_category_type = 'Bags & Packs'
	 ELSE IF(@sub_category_type = 'BAGS & PACKS [PIM_2658]')
        SET @main_category_type = 'Bags & Packs'
    ELSE IF(@sub_category_type = 'TRAVEL BAGS [PIM_1430]')
        SET @main_category_type = 'Bags & Packs / Travel & Equipments bags'
    ELSE IF(@sub_category_type = 'ACCESSORIES [PIM_1376]')
        SET @main_category_type= 'Accessories (BU ?)' 
    ELSE IF(@sub_category_type = 'EQUIPMENT BAGS [PIM_1383]')
        SET @main_category_type= 'Bags & Packs / Travel & Equipments bags'
    ELSE IF(@sub_category_type = 'GLOVES [PIM_1385]' or @sub_category_type='HEADWEAR [PIM_1387]' or @sub_category_type='HATS &amp; CAPS [PIM_1386]' or @sub_category_type='SOCKS [PIM_1424]'  or @sub_category_type='HATS & CAPS [PIM_1386]')
        SET @main_category_type = 'Clothing / accessories' 
    ELSE IF(@sub_category_type = 'SAL  Helmets [PIM_1406]')
        SET @main_category_type = 'Protective & Goggles / helmets'
	 ELSE IF(@sub_category_type = 'SAL  Helmets [PIM_1406]')
        SET @main_category_type = 'Protective & Goggles / helmets'
    ELSE IF(@sub_category_type = 'SAL Goggles [PIM_1412]')
        SET @main_category_type = 'Protective & Goggles / goggles'
    ELSE IF(@sub_category_type = 'Salomon Body Protection [PIM_1425]')
        SET @main_category_type = 'Protective & Goggles / Back protection'
    ELSE IF(@sub_category_type = 'SAL Eyewear [PIM_1411]')
        SET @main_category_type = 'Protective & Goggles / Sunglasses'
		else if (@sub_category_type='SAL Alpine Skis [PIM_1410]')
		set @main_category_type='Alpine equipment / Skis'
		else if (@sub_category_type='SAL Alpine Bindings [PIM_1407]')
		set @main_category_type='Alpine equipment / bindings'
		else if (@sub_category_type='SAL Alpine Boots [PIM_1408]')
		set @main_category_type='Alpine equipment / boots'
		else if (@sub_category_type='SAL Alpine Poles [PIM_1409]')
		set @main_category_type='Alpine equipment / poles'

    ELSE IF(@sub_category_type = 'SAL XC Skis [PIM_1419]')
        SET @main_category_type= 'Nordic equipment / skis' 
    ELSE IF(@sub_category_type = 'SAL XC Bindings [PIM_1416]')
        SET @main_category_type= 'Nordic equipment /bindings'
    ELSE IF(@sub_category_type = 'SAL XC Boots [PIM_1417]' )
        SET @main_category_type = 'Nordic equipment / boots' 
	 ELSE IF(@sub_category_type = 'SAL XC Skis [PIM_1419]')
        SET @main_category_type= 'Nordic equipment / skis' 
    ELSE IF(@sub_category_type = 'SAL XC Bindings [PIM_1416]')
        SET @main_category_type= 'Nordic equipment /bindings'
    ELSE IF(@sub_category_type = 'SAL XC Boots [PIM_1417]' )
        SET @main_category_type = 'Nordic equipment / boots' 	
     ELSE IF(@sub_category_type = 'SAL XC Poles [PIM_1418]')
        SET @main_category_type= 'Nordic equipment / poles' 
    ELSE IF(@sub_category_type = 'SAL SB Boards [PIM_1414]')
        SET @main_category_type= 'Snowboard equipment / boards'
    ELSE IF(@sub_category_type = 'SAL SB Bindings [PIM_1413]' )
        SET @main_category_type = 'Snowboard equipment / bindings' 	
   ELSE IF(@sub_category_type = 'SAL SB Boots [PIM_1415]')
        SET @main_category_type= 'Snowboard equipment / boots' 
    ELSE IF(@sub_category_type = 'ME :sh Running [PIM_1394]')
        SET @main_category_type= 'Shoes / trail running'
    ELSE IF(@sub_category_type = 'ME :sh Trail Running [PIM_1395]' )
        SET @main_category_type = 'Shoes / trail running' 
   ELSE IF(@sub_category_type = 'Spare parts [PIM_1426]')
        SET @main_category_type= 'Accessories (BU ?)' 
    ELSE IF(@sub_category_type = 'RECOVERY [PIM_1402]')
        SET @main_category_type= 'Shoes  / sandals and water shoes'
    ELSE IF(@sub_category_type = 'FORCES [PIM_1384]' )
        SET @main_category_type = 'Forces collection (NAM only)' 
	ELSE IF(@sub_category_type = 'SANDALS &amp; WATERSHOES [PIM_1420]')
        SET @main_category_type= 'Shoes  / sandals and water shoes' 
	ELSE IF(@sub_category_type = 'SANDALS & WATERSHOES [PIM_1420]')
        SET @main_category_type= 'Shoes  / sandals and water shoes' 
    ELSE IF(@sub_category_type = 'BACKPACKING [PIM_1377]')
        SET @main_category_type= 'Shoes /hiking'
    ELSE IF(@sub_category_type = 'S-LAB ENDURANCE [PIM_1404]' )
        SET @main_category_type = 'Shoes / trail running' 	
     ELSE IF(@sub_category_type = 'RUNNING [PIM_1403]')
        SET @main_category_type= 'shoes / running' 
    ELSE IF(@sub_category_type = 'KIDS [PIM_1392]')
        SET @main_category_type= 'KIDS / Shoes'
    ELSE IF(@sub_category_type = 'WINTER [PIM_1431]' )
        SET @main_category_type = 'Shoes / winter' 	
   ELSE IF(@sub_category_type = 'MOUNTAIN.&amp; APPROACH [PIM_1398]' or @sub_category_type='HIKING &amp; MULTIFUNC. [PIM_1388]')
        SET @main_category_type= 'Shoes / Hiking' 
   ELSE IF(@sub_category_type = 'MOUNTAIN.& APPROACH [PIM_1398]' or @sub_category_type='HIKING & MULTIFUNC. [PIM_1388]')
        SET @main_category_type= 'Shoes / Hiking' 
    ELSE IF(@sub_category_type = 'LIFESTYLE [PIM_1393]')
        SET @main_category_type= 'Collection Advanced'
    ELSE IF(@sub_category_type = 'TRAIL RUNNING [PIM_1429]' )
        SET @main_category_type = 'Shoes / trail running' 
        
    ELSE IF(@sub_category_type = 'BASELAYERS [PIM_2657]')
        SET @main_category_type= 'Clothings / Tops / Tights'
    ELSE IF(@sub_category_type = 'DRESS [PIM_2656]' )
        SET @main_category_type = 'Clothing / dress (future not online)' 
	 ELSE IF(@sub_category_type = 'MID LAYER [PIM_1396]')
        SET @main_category_type= 'Clothing / midlayers' 
    ELSE IF(@sub_category_type = 'BRA [PIM_1380]')
        SET @main_category_type= 'Clothing / sports bras'
    ELSE IF(@sub_category_type = 'BASELAYER [PIM_1379]' )
        SET @main_category_type = 'Clothings / Tops / Tights' 	
     ELSE IF(@sub_category_type = 'SHIRT [PIM_1421]')
        SET @main_category_type= 'Clothings / Tops' 
    ELSE IF(@sub_category_type = 'TIGHTS [PIM_1428]')
        SET @main_category_type= 'Clothings /Tights'
    ELSE IF(@sub_category_type = 'BRAS [PIM_1381]' )
        SET @main_category_type = 'Clothing / sports bras' 	
   ELSE IF(@sub_category_type = 'PANTS [PIM_1400]' )
        SET @main_category_type= 'Clothing / pants' 
    ELSE IF(@sub_category_type = 'SKIRTS [PIM_1423]' or @sub_category_type='SHORTS [PIM_1422]')
        SET @main_category_type= 'Clothing / shorts'
    ELSE IF(@sub_category_type = 'JACKETS [PIM_1390]' )
        SET @main_category_type = 'Clothing / jackets'
    ELSE IF(@sub_category_type = 'TEES [PIM_1427]')
        SET @main_category_type= 'Clothings / Tops'
    ELSE IF(@sub_category_type = 'SAL Alpine   accessories [PIM_2659]' or @sub_category_type='SAL Alpine   Parts & After Market [PIM_2669]'  or @sub_category_type='SAL Alpine   Parts &amp; After Market [PIM_2669]'  or @sub_category_type='SAL Alpine   Parts & After Market [PIM_2669]' )
        SET @main_category_type = 'Alpine equipment / accessories' 
	 ELSE IF(@sub_category_type = 'SAL Protective   Parts &amp; After Market [PIM_2685]')
        SET @main_category_type= 'Protective & Goggles / accessories' 
	 ELSE IF(@sub_category_type = 'SAL Protective   Parts & After Market [PIM_2685]' or @sub_category_type = 'SAL Protective   Parts & After Market [PIM_2685]')
        SET @main_category_type= 'Protective & Goggles / accessories' 
    ELSE IF(@sub_category_type = 'HATS &amp; CAPS [PIM_5749]')
        SET @main_category_type= 'Clothing / accessories'
    ELSE IF(@sub_category_type = 'HATS & CAPS [PIM_5749]')
        SET @main_category_type= 'Clothing / accessories'
    ELSE IF(@sub_category_type = 'EQUIPMENT BAG [PIM_5744]' )
        SET @main_category_type = 'Bags & Packs / Travel & Equipments bags' 	
     ELSE IF(@sub_category_type = 'Packs [PIM_5745]')
        SET @main_category_type= 'Bags & Packs / backpacking' 
    ELSE IF(@sub_category_type = 'BAGS & PACKS [PIM_5746]' or @sub_category_type='TRAVEL BAGS [PIM_5747]' or @sub_category_type='EQUIPMENT BAGS! [PIM_6547]' or @sub_category_type='BAGS &amp; PACKS [PIM_5746]' or @sub_category_type='!prodtyp.productGroup.EQUIPMENT BAGS! [PIM_6547]')
        SET @main_category_type= 'Bags & Packs / Travel & Equipments bags'
    ELSE IF(@sub_category_type = 'SHIRTS [PIM_5748]' )
        SET @main_category_type = 'Clothings / Tops' 	
	ELSE IF(@sub_category_type = 'Bra [PIM_5750]' )
        SET @main_category_type= 'Clothing / sports bras' 
    ELSE IF(@sub_category_type = 'GHW = Headwear [PIM_2716]')
        SET @main_category_type= 'Clothing / accessories'
    ELSE IF(@sub_category_type = 'SHIRTS [PIM_6546]')
        SET @main_category_type = 'Clothings / Tops'
		-----------------
	ELSE IF(@sub_category_type = 'ACCESSORIES APPAREL [PIM_6561]')
        SET @main_category_type= 'Clothing / accessories'
    ELSE IF(@sub_category_type = 'ACCESSORIES (BAGS) [PIM_7820]') --or @sub_category_type='SAL Alpine   Parts & After Market [PIM_2669]' )
        SET @main_category_type = 'Bags & Packs / accessories' 
	 ELSE IF(@sub_category_type = 'POLOS [PIM_7823]')
        SET @main_category_type= 'Clothings / Tops' 
    ELSE IF(@sub_category_type = 'VESTS [PIM_7822]')
        SET @main_category_type= 'Clothing / jackets'
    ELSE IF(@sub_category_type = 'SAL Board   Parts &amp; After Market [PIM_2673]' )
        SET @main_category_type = 'Snowboard equipment / accessories' 	
    ELSE IF(@sub_category_type = 'SAL Board   Parts & After Market [PIM_2673]' )
        SET @main_category_type = 'Snowboard equipment / accessories' 	
     ELSE IF(@sub_category_type = 'ACCESSORIES APPAREL [PIM_7821]')
        SET @main_category_type= 'Clothing / accessories' 
    ELSE IF(@sub_category_type = 'BELTS [PIM_8427]') --or @sub_category_type='TRAVEL BAGS [PIM_5747]' or @sub_category_type='EQUIPMENT BAGS! [PIM_6547]')
        SET @main_category_type= 'Bags & Packs / sports belts'
    ELSE IF(@sub_category_type = 'DRESSES & SKIRTS [PIM_11903]' )
        SET @main_category_type = 'Clothing / shorts (future dress & skirts)' 
    ELSE IF(@sub_category_type = 'DRESSES &amp; SKIRTS [PIM_11903]' )
        SET @main_category_type = 'Clothing / shorts (future dress & skirts)' 
 else 
    set @main_category_type=@sub_category_type
	return @main_category_type
End


/*

/ ****** Object:  UserDefinedFunction [dbo].[udf_returns_category]    Script Date: 23-10-2019 15:23:58 ****** /
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER Function [dbo].[udf_returns_category](@sub_category_type NVARCHAR(150)) returns NVARCHAR(50)
AS
Begin
    declare @main_category_type NVARCHAR(50)
    IF(@sub_category_type = 'Default')
      SET @main_category_type = 'FFT00105'
	    IF(@sub_category_type = 'Default Custom')
      SET @main_category_type = 'Default Custom'
	 else IF(@sub_category_type = 'MIDLAYERS [PIM_1397]')
        SET @main_category_type = 'Clothing / midlayers'
    ELSE IF(@sub_category_type = 'JERSEY [PIM_1391]')
        SET @main_category_type = 'Clothing / Tops'
    ELSE IF(@sub_category_type = 'BAGS &amp; PACKS [PIM_2658]')
        SET @main_category_type = 'Bags & Packs'
	 ELSE IF(@sub_category_type = 'BAGS & PACKS [PIM_2658]')
        SET @main_category_type = 'Bags & Packs'
    ELSE IF(@sub_category_type = 'TRAVEL BAGS [PIM_1430]')
        SET @main_category_type = 'Bags & Packs / Travel & Equipments bags'
    ELSE IF(@sub_category_type = 'ACCESSORIES [PIM_1376]')
        SET @main_category_type= 'Accessories (BU ?)' 
    ELSE IF(@sub_category_type = 'EQUIPMENT BAGS [PIM_1383]')
        SET @main_category_type= 'Bags & Packs / Travel & Equipments bags'
    ELSE IF(@sub_category_type = 'GLOVES [PIM_1385]' or @sub_category_type='HEADWEAR [PIM_1387]' or @sub_category_type='HATS &amp; CAPS [PIM_1386]' or @sub_category_type='SOCKS [PIM_1424]')
        SET @main_category_type = 'Clothing / accessories' 
    ELSE IF(@sub_category_type = 'SAL  Helmets [PIM_1406]')
        SET @main_category_type = 'Protective & Goggles / helmets'
    ELSE IF(@sub_category_type = 'SAL Goggles [PIM_1412]')
        SET @main_category_type = 'Protective & Goggles / goggles'
    ELSE IF(@sub_category_type = 'Salomon Body Protection [PIM_1425]')
        SET @main_category_type = 'Protective & Goggles / Back protection'
    ELSE IF(@sub_category_type = 'SAL Eyewear [PIM_1411]')
        SET @main_category_type = 'Protective & Goggles / Sunglasses'
		else if (@sub_category_type='SAL Alpine Skis [PIM_1410]')
		set @main_category_type='Alpine equipment / Skis'
		else if (@sub_category_type='SAL Alpine Bindings [PIM_1407]')
		set @main_category_type='Alpine equipment / bindings'
		else if (@sub_category_type='SAL Alpine Boots [PIM_1408]')
		set @main_category_type='Alpine equipment / boots'
		else if (@sub_category_type='SAL Alpine Poles [PIM_1409]')
		set @main_category_type='Alpine equipment / poles'

    ELSE IF(@sub_category_type = 'SAL XC Skis [PIM_1419]')
        SET @main_category_type= 'Nordic equipment / skis' 
    ELSE IF(@sub_category_type = 'SAL XC Bindings [PIM_1416]')
        SET @main_category_type= 'Nordic equipment /bindings'
    ELSE IF(@sub_category_type = 'SAL XC Boots [PIM_1417]' )
        SET @main_category_type = 'Nordic equipment / boots' 
	 ELSE IF(@sub_category_type = 'SAL XC Skis [PIM_1419]')
        SET @main_category_type= 'Nordic equipment / skis' 
    ELSE IF(@sub_category_type = 'SAL XC Bindings [PIM_1416]')
        SET @main_category_type= 'Nordic equipment /bindings'
    ELSE IF(@sub_category_type = 'SAL XC Boots [PIM_1417]' )
        SET @main_category_type = 'Nordic equipment / boots' 	
     ELSE IF(@sub_category_type = 'SAL XC Poles [PIM_1418]')
        SET @main_category_type= 'Nordic equipment / poles' 
    ELSE IF(@sub_category_type = 'SAL SB Boards [PIM_1414]')
        SET @main_category_type= 'Snowboard equipment / boards'
    ELSE IF(@sub_category_type = 'SAL SB Bindings [PIM_1413]' )
        SET @main_category_type = 'Snowboard equipment / bindings' 	
   ELSE IF(@sub_category_type = 'SAL SB Boots [PIM_1415]')
        SET @main_category_type= 'Snowboard equipment / boots' 
    ELSE IF(@sub_category_type = 'ME :sh Running [PIM_1394]')
        SET @main_category_type= 'Shoes / trail running'
    ELSE IF(@sub_category_type = 'ME :sh Trail Running [PIM_1395]' )
        SET @main_category_type = 'Shoes / trail running' 
   ELSE IF(@sub_category_type = 'Spare parts [PIM_1426]')
        SET @main_category_type= 'Accessories (BU ?)' 
    ELSE IF(@sub_category_type = 'RECOVERY [PIM_1402]')
        SET @main_category_type= 'Shoes  / sandals and water shoes'
    ELSE IF(@sub_category_type = 'FORCES [PIM_1384]' )
        SET @main_category_type = 'Forces collection (NAM only)' 
	ELSE IF(@sub_category_type = 'SANDALS & WATERSHOES [PIM_1420]')
        SET @main_category_type= 'Shoes  / sandals and water shoes' 
    ELSE IF(@sub_category_type = 'BACKPACKING [PIM_1377]')
        SET @main_category_type= 'Shoes /hiking'
    ELSE IF(@sub_category_type = 'S-LAB ENDURANCE [PIM_1404]' )
        SET @main_category_type = 'Shoes / trail running' 	
     ELSE IF(@sub_category_type = 'RUNNING [PIM_1403]')
        SET @main_category_type= 'shoes / running' 
    ELSE IF(@sub_category_type = 'KIDS [PIM_1392]')
        SET @main_category_type= 'KIDS / Shoes'
    ELSE IF(@sub_category_type = 'WINTER [PIM_1431]' )
        SET @main_category_type = 'Shoes / winter' 	
   ELSE IF(@sub_category_type = 'MOUNTAIN.& APPROACH [PIM_1398]' or @sub_category_type='HIKING & MULTIFUNC. [PIM_1388]')
        SET @main_category_type= 'Shoes / Hiking' 
    ELSE IF(@sub_category_type = 'LIFESTYLE [PIM_1393]')
        SET @main_category_type= 'Collection Advanced'
    ELSE IF(@sub_category_type = 'TRAIL RUNNING [PIM_1429]' )
        SET @main_category_type = 'Shoes / trail running' 
        
    ELSE IF(@sub_category_type = 'BASELAYERS [PIM_2657]')
        SET @main_category_type= 'Clothings / Tops / Tights'
    ELSE IF(@sub_category_type = 'DRESS [PIM_2656]' )
        SET @main_category_type = 'Clothing / dress (future not online)' 
	 ELSE IF(@sub_category_type = 'MID LAYER [PIM_1396]')
        SET @main_category_type= 'Clothing / midlayers' 
    ELSE IF(@sub_category_type = 'BRA [PIM_1380]')
        SET @main_category_type= 'Clothing / sports bras'
    ELSE IF(@sub_category_type = 'BASELAYER [PIM_1379]' )
        SET @main_category_type = 'Clothings / Tops / Tights' 	
     ELSE IF(@sub_category_type = 'SHIRT [PIM_1421]')
        SET @main_category_type= 'Clothings / Tops ' 
    ELSE IF(@sub_category_type = 'TIGHTS [PIM_1428]')
        SET @main_category_type= 'Clothings /Tights'
    ELSE IF(@sub_category_type = 'BRAS [PIM_1381]' )
        SET @main_category_type = 'Clothing / sports bras' 	
   ELSE IF(@sub_category_type = 'PANTS [PIM_1400]' )
        SET @main_category_type= 'Clothing / pants' 
    ELSE IF(@sub_category_type = 'SKIRTS [PIM_1423]' or @sub_category_type='SHORTS [PIM_1422]')
        SET @main_category_type= 'Clothing / shorts'
    ELSE IF(@sub_category_type = 'JACKETS [PIM_1390]' )
        SET @main_category_type = 'Clothing / jackets'
    ELSE IF(@sub_category_type = 'TEES [PIM_1427]')
        SET @main_category_type= 'Clothings / Tops '
    ELSE IF(@sub_category_type = 'SAL Alpine   accessories [PIM_2659]' or @sub_category_type='SAL Alpine   Parts & After Market [PIM_2669]' )
        SET @main_category_type = 'Alpine equipment / accessories' 
	 ELSE IF(@sub_category_type = 'SAL Protective   Parts & After Market [PIM_2685]')
        SET @main_category_type= 'Protective & Goggles / accessories' 
    ELSE IF(@sub_category_type = 'HATS & CAPS [PIM_5749]')
        SET @main_category_type= 'Clothing / accessories'
    ELSE IF(@sub_category_type = 'EQUIPMENT BAG [PIM_5744]' )
        SET @main_category_type = 'Bags & Packs / Travel & Equipments bags' 	
     ELSE IF(@sub_category_type = 'Packs [PIM_5745]')
        SET @main_category_type= 'Bags & Packs / backpacking' 
    ELSE IF(@sub_category_type = 'BAGS & PACKS [PIM_5746]' or @sub_category_type='TRAVEL BAGS [PIM_5747]' or @sub_category_type='EQUIPMENT BAGS! [PIM_6547]')
        SET @main_category_type= 'Bags & Packs / Travel & Equipments bags'
    ELSE IF(@sub_category_type = 'SHIRTS [PIM_5748]' )
        SET @main_category_type = 'Clothings / Tops' 	
	ELSE IF(@sub_category_type = 'Bra [PIM_5750]' )
        SET @main_category_type= 'Clothing / sports bras' 
    ELSE IF(@sub_category_type = 'GHW = Headwear [PIM_2716]')
        SET @main_category_type= 'Clothing / accessories'
    ELSE IF(@sub_category_type = 'SHIRTS [PIM_6546]')
        SET @main_category_type = 'Clothings / Tops'
		-----------------
	ELSE IF(@sub_category_type = 'ACCESSORIES APPAREL [PIM_6561]')
        SET @main_category_type= 'Clothing / accessories'
    ELSE IF(@sub_category_type = 'ACCESSORIES (BAGS) [PIM_7820]') --or @sub_category_type='SAL Alpine   Parts & After Market [PIM_2669]' )
        SET @main_category_type = 'Bags & Packs / accessories' 
	 ELSE IF(@sub_category_type = 'POLOS [PIM_7823]')
        SET @main_category_type= 'Clothings / Tops ' 
    ELSE IF(@sub_category_type = 'VESTS [PIM_7822]')
        SET @main_category_type= 'Clothing / jackets'
    ELSE IF(@sub_category_type = 'SAL Board   Parts & After Market [PIM_2673]' )
        SET @main_category_type = 'Snowboard equipment / accessories' 	
     ELSE IF(@sub_category_type = 'ACCESSORIES APPAREL [PIM_7821]')
        SET @main_category_type= 'ACCESSORIES APPAREL [PIM_7821]' 
    ELSE IF(@sub_category_type = 'BELTS [PIM_8427]') --or @sub_category_type='TRAVEL BAGS [PIM_5747]' or @sub_category_type='EQUIPMENT BAGS! [PIM_6547]')
        SET @main_category_type= 'Bags & Packs / sports belts'
    ELSE IF(@sub_category_type = 'DRESSES & SKIRTS [PIM_11903]' )
        SET @main_category_type = 'Clothing / shorts (future dress & skirts)' 
 else 
    set @main_category_type=@sub_category_type
	return @main_category_type
End





*/

GO
/****** Object:  UserDefinedFunction [dbo].[udf_ShowAutoNumber]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

--select dbo.[udf_ShowAutoNumber]('PL_<PrefixAsCurrentLocationCode><PrefixAsYearTwoDigit><PrefixAsMonth>',11,61)
CREATE Function [dbo].[udf_ShowAutoNumber](@Rule nvarchar(max) ,@numberLength int,@partnerID int)
returns nvarchar(max)
as
begin
 Declare @string as nvarchar(max) = @Rule
, @PrefixName as Nvarchar(max)
, @PrefixValue as Nvarchar(max)
, @PrefixQuery as Nvarchar(max)
--select TOP 1 * from PartnerUserRoleMap
--select TOP 1 * from UserRoleMap
--declare @partnerID INT = (select TOP 1 PartnerID from PartnerUserRoleMap  WHERE UserRoleMapID =  (select TOP 1 UserRoleMapID from UserRoleMap where UserID =61) and isDefault=1) 
--PJ_<PrefixAsCurrentLocationCode><PrefixAsYearFourDigit><PrefixAsMonth>
--select * from prefixmaster
set @string=replace(@string,'<PrefixAsYearFourDigit>',(Select Substring(Cast(Year(GetDate()) as Nvarchar),1,4)))
set @string=replace(@string,'<PrefixAsYearTwoDigit>',(Select Substring(Cast(Year(GetDate()) as Nvarchar),3,4)))
set @string=replace(@string,'<PrefixAsMonth>',(SELECT RIGHT('00'+Cast(Month(Getdate()) as Varchar(2)),2)))
set @string=replace(@string,'<PrefixAsDate>',(SELECT RIGHT('00'+Cast(Day(Getdate()) as Varchar(2)),2)))
set @string=replace(@string,'<PrefixAsCurrentLocationCode>',
(Select PartnerCode from Partners where PartnerID = @partnerID))

declare @num1 nvarchar(100)
select @num1=@string+Right(REPLICATE('0',@numberLength)+'1',@numberLength)

return @num1
 end

GO
/****** Object:  UserDefinedFunction [dbo].[udf_ShowAutoNumber1]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
--select dbo.[udf_ShowAutoNumber]('PL_<PrefixAsCurrentLocationCode><PrefixAsYearTwoDigit><PrefixAsMonth>',11,241)
CREATE Function [dbo].[udf_ShowAutoNumber1](@Rule nvarchar(max) ,@numberLength int,@LocationID int)
returns nvarchar(max)
as
begin
 Declare @string as nvarchar(max) = @Rule
, @PrefixName as Nvarchar(max)
, @PrefixValue as Nvarchar(max)
, @PrefixQuery as Nvarchar(max)


--PJ_<PrefixAsCurrentLocationCode><PrefixAsYearFourDigit><PrefixAsMonth>
--select * from prefixmaster
set @string=replace(@string,'<PrefixAsYearFourDigit>',(Select Substring(Cast(Year(GetDate()) as Nvarchar),1,4)))
set @string=replace(@string,'<PrefixAsYearTwoDigit>',(Select Substring(Cast(Year(GetDate()) as Nvarchar),3,4)))
set @string=replace(@string,'<PrefixAsMonth>',(SELECT RIGHT('00'+Cast(Month(Getdate()) as Varchar(2)),2)))
set @string=replace(@string,'<PrefixAsDate>',(SELECT RIGHT('00'+Cast(Day(Getdate()) as Varchar(2)),2)))
set @string=replace(@string,'<PrefixAsCurrentLocationCode>',
(Select FacilityCode from Facility where FacilityID = @LocationID))

declare @num1 nvarchar(100)
select @num1=@string+Right(REPLICATE('0',@numberLength)+'1',@numberLength)

return @num1
 end

GO
/****** Object:  UserDefinedFunction [dbo].[udf_TitleCase]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [dbo].[udf_TitleCase] (@InputString VARCHAR(4000) )
RETURNS VARCHAR(4000)
AS
BEGIN
DECLARE @Index INT
DECLARE @Char CHAR(1)
DECLARE @OutputString VARCHAR(255)
SET @OutputString = LOWER(@InputString)
SET @Index = 2
SET @OutputString =
STUFF(@OutputString, 1, 1,UPPER(SUBSTRING(@InputString,1,1)))
WHILE @Index <= LEN(@InputString)
BEGIN
SET @Char = SUBSTRING(@InputString, @Index, 1)
IF @Char IN (' ', ';', ':', '!', '?', ',', '.', '_', '-', '/', '&','''','(')
IF @Index + 1 <= LEN(@InputString)
BEGIN
IF @Char != ''''
OR
UPPER(SUBSTRING(@InputString, @Index + 1, 1)) != 'S'
SET @OutputString =
STUFF(@OutputString, @Index + 1, 1,UPPER(SUBSTRING(@InputString, @Index + 1, 1)))
END
SET @Index = @Index + 1
END
RETURN ISNULL(@OutputString,'')
END
GO
/****** Object:  UserDefinedFunction [dbo].[UDF_WF_AllItemReceived]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 CREATE Function [dbo].[UDF_WF_AllItemReceived](@RMAOrderDetailID int) Returns BIT
AS 
Begin  

DECLARE @OrderQuantity FLOAT, @ReceivedQuantity FLOAT, @DiscrepancyQuantity FLOAT 

SELECT @OrderQuantity = Quantity FROM SalesReturnOrderDetail WHERE SalesReturnOrderDetailID =  @RMAOrderDetailID

SELECT @ReceivedQuantity = SUM(Quantity) FROM InboundItemContextHistory 
INNER JOIN ModuleStatusMap ON ModuleStatusMap.ModuleStatusMapID = InboundItemContextHistory.ModuleStatusMapID
INNER JOIN Statuses ON Statuses.StatusID = ModuleStatusMap.StatusID AND Statuses.StatusCode = 'ST068' --AND Statuses.StatusCode = 'ST023'
WHERE RefDetailID = @RMAOrderDetailID AND RefTypeID=641 AND Discrepancy IS NULL

SELECT @DiscrepancyQuantity = SUM(DiscrepancyQuantity) FROM DiscrepancyLog WHERE SalesReturnOrderDetailID = @RMAOrderDetailID AND ResolvedDate IS NOT NULL
SET @OrderQuantity = @OrderQuantity + ISNULL(@DiscrepancyQuantity, 0)

IF (@OrderQuantity <= @ReceivedQuantity)
	return 1
return 0

end

GO
/****** Object:  UserDefinedFunction [dbo].[UDF_WF_ApprovalPreRequisite]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

 
  
CREATE Function [dbo].[UDF_WF_ApprovalPreRequisite](@RMAOrderDetailID int) Returns BIT  
AS   
Begin 
 DECLARE @CustomerFromAccountID INT = (SELECT TOP 1 PartnerID FROM Partners P INNER JOIN TypeLookUP T  
            ON P.OrgSubTypeID = T.TypeLookUpID  
            WHERE T.TypeCode = 'PTR004-04')  
  
 DECLARE @Quantity FLOAT, @Amount FLOAT, @Source NVARCHAR(50), @RRScope NVARCHAR(50), @ItemModelID INT, 
		@RMAActionCodeID INT, @PartnerID INT = null, @Value FLOAT    
 Select @RRScope = ReturnReasonType  from SalesReturnOrderDetail INNER JOIN SalesReturnOrderHeader ON SalesReturnOrderHeader.SalesReturnOrderHeaderID = SalesReturnOrderDetail.SalesReturnOrderHeaderID
	WHERE SalesReturnOrderDetail.SalesReturnOrderDetailID = @RMAOrderDetailID

  IF (@RRScope = 'Account')    
	 SELECT @Quantity = SalesReturnOrderDetail.Quantity, @Amount = (SalesReturnOrderDetail.Quantity * ReturnPrice), @Source = SalesReturnOrderHeader.RMASource,     
	 @ItemModelID = ItemModelID, @RMAActionCodeID = SalesReturnOrderDetail.ReturnReasonID,   
	 @PartnerID = (CASE WHEN SalesReturnOrderHeader.RMASource = 'Account' THEN (Select ISNULL(PartnerParentID, FromAccountID) From Partners WHERE PartnerID =  FromAccountID)   
	 ELSE @CustomerFromAccountID END)  
	 FROM SalesReturnOrderDetail    
	 INNER JOIN ItemInfo ON ItemInfo.ItemInfoID = SalesReturnOrderDetail.ItemInfoID    
	 INNER JOIN ItemMaster ON ItemMaster.ItemMasterID = ItemInfo.ItemMasterID    
	 --INNER JOIN [dbo].[fn_RMAItemApprover]() A ON A.SalesReturnOrderDetailID = SalesReturnOrderDetail.SalesReturnOrderDetailID    
	 INNER JOIN SalesReturnOrderHeader ON SalesReturnOrderHeader.SalesReturnOrderHeaderID = SalesReturnOrderDetail.SalesReturnOrderHeaderID    
	 --INNER JOIN Partners ON Partners.PartnerID = SalesReturnOrderHeader.FromAccountID     
	 WHERE SalesReturnOrderDetail.SalesReturnOrderDetailID = @RMAOrderDetailID    
Else
	 SELECT @Quantity = SalesReturnOrderDetail.Quantity, @Amount = (SalesReturnOrderDetail.Quantity * ReturnPrice), @Source = SalesReturnOrderHeader.RMASource, 
	 @ItemModelID = ItemModelID, @RMAActionCodeID = SalesReturnOrderDetail.ReturnReasonID 
	 FROM SalesReturnOrderDetail    
	 INNER JOIN ItemInfo ON ItemInfo.ItemInfoID = SalesReturnOrderDetail.ItemInfoID    
	 INNER JOIN ItemMaster ON ItemMaster.ItemMasterID = ItemInfo.ItemMasterID    
	 INNER JOIN SalesReturnOrderHeader ON SalesReturnOrderHeader.SalesReturnOrderHeaderID = SalesReturnOrderDetail.SalesReturnOrderHeaderID    
	 WHERE SalesReturnOrderDetail.SalesReturnOrderDetailID = @RMAOrderDetailID  
  
 DECLARE @QuantityRestricted BIT, @GreaterThenMaxRestricted BIT  
 IF (@RRScope = 'Account')   
 SELECT @QuantityRestricted = CASE WHEN PRRR.RuleValueEffectTO = 1 THEN 1 ELSE 0 END, @GreaterThenMaxRestricted = CASE WHEN PRRR.RuleValueEffect = 5 THEN 1 ELSE 0 END, @Value = PRRR.IsFixedRuleValue  
   FROM PartnerReturnReasonRuleMap PRRR  
   INNER JOIN PartnerReturnReasonMap PRR ON PRRR.PartnerReturnReasonMapID = PRR.PartnerReturnReasonMapID  
   INNER JOIN ReturnReasonRuleMap RRR ON RRR.ReturnReasonRuleMapID = PRRR.ReturnReasonRuleMapID  
   Inner Join TypeLookUp C on C.TypeLookUpId=RRR.RuleControlTypeID  
   Inner Join Rules RS on RS.RuleID=RRR.RuleID  
   left join SaleReturnOrderDetailReasonValue val on val.[ReturnReasonRuleMapID] = (case when @RMAOrderDetailID=0 then 0 else PRRR.PartnerReturnReasonRuleMapID end) and val.SaleReturnOrderDetailID=@RMAOrderDetailID  
   left join [SalesReturnOrderDetail] srd on (val.SaleReturnOrderDetailID = srd.SalesReturnOrderDetailID   
   and srd.SalesReturnOrderDetailID = @RMAOrderDetailID)  
   INNER JOIN [dbo].[fn_RMAItemApprover]() A ON A.ApprovalRoleID = PRRR.RuleValue   and A.SalesReturnOrderDetailID =   @RMAOrderDetailID
   WHERE PRRR.IsActive=1  and  RRR.RMAActionCodeID=@RMAActionCodeID  and PRR.RMAActionCodeID=@RMAActionCodeID and  
   PRR.PartnerID = @PartnerID AND C.TypeCode = 'RCT006'  
 ELSE  
 SELECT @QuantityRestricted = CASE WHEN PRRR.RuleValueEffectTO = 1 THEN 1 ELSE 0 END, @GreaterThenMaxRestricted = CASE WHEN PRRR.RuleValueEffect = 5 THEN 1 ELSE 0 END, @Value = PRRR.IsFixedRuleValue  
   FROM ItemModelReturnReasonRuleMap PRRR  
   INNER JOIN ItemModelReturnReasonMap PRR ON PRRR.ItemModelReturnReasonMapID = PRR.ItemModelReturnReasonMapID  
   INNER JOIN ReturnReasonRuleMap RRR ON RRR.ReturnReasonRuleMapID = PRRR.ReturnReasonRuleMapID  
   Inner Join TypeLookUp C on C.TypeLookUpId=RRR.RuleControlTypeID  
   Inner Join Rules RS on RS.RuleID=RRR.RuleID  
   left join SaleReturnOrderDetailReasonValue val on val.[ReturnReasonRuleMapID] = (case when @RMAOrderDetailID=0 then 0 else PRRR.ItemModelReturnReasonRuleMapID end) and val.SaleReturnOrderDetailID=@RMAOrderDetailID  
   left join [SalesReturnOrderDetail] srd on (val.SaleReturnOrderDetailID = srd.SalesReturnOrderDetailID   
   and srd.SalesReturnOrderDetailID = @RMAOrderDetailID)  
   INNER JOIN [dbo].[fn_RMAItemApprover]() A ON A.ApprovalRoleID = PRRR.RuleValue  and A.SalesReturnOrderDetailID =   @RMAOrderDetailID 
   WHERE PRRR.IsActive=1  and  RRR.RMAActionCodeID=@RMAActionCodeID  and PRR.RMAActionCodeID=@RMAActionCodeID and  
   PRR.ItemModelID = @ItemModelID AND C.TypeCode = 'RCT006'  
  
 DECLARE @ReturnValue BIT  
 IF(@QuantityRestricted = CAST(1 AS BIT))  
 BEGIN  
  IF(@GreaterThenMaxRestricted = CAST(1 AS BIT))  
  BEGIN  
   SET @ReturnValue = IIF(@Quantity >= @Value, 1, 0)  
  END  
  ELSE IF(@GreaterThenMaxRestricted = CAST(0 AS BIT))  
  BEGIN  
   SET @ReturnValue = IIF(@Quantity <= @Value, 1, 0)  
  END  
 END  
 ELSE IF(@QuantityRestricted = CAST(0 AS BIT))  
 BEGIN  
  IF(@GreaterThenMaxRestricted = CAST(1 AS BIT))  
  BEGIN  
   SET @ReturnValue = IIF(@Amount >= @Value, 1, 0)  
  END  
  ELSE IF(@GreaterThenMaxRestricted = CAST(0 AS BIT))  
  BEGIN  
   SET @ReturnValue = IIF(@Amount >= @Value, 1, 0)  
  END  
 END  
 RETURN @ReturnValue  
END

GO
/****** Object:  UserDefinedFunction [dbo].[UDF_WF_ApprovalPreRequisiteForInsert]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 CREATE Function [dbo].[UDF_WF_ApprovalPreRequisiteForInsert](@RMAOrderDetailID int) Returns BIT    
AS     
Begin    
 DECLARE @CustomerFromAccountID INT = (SELECT TOP 1 PartnerID FROM Partners P INNER JOIN TypeLookUP T  
            ON P.OrgSubTypeID = T.TypeLookUpID  
            WHERE T.TypeCode = 'PTR004-04')  
  
 DECLARE @Quantity FLOAT, @Amount FLOAT, @Source NVARCHAR(50), @RRScope NVARCHAR(50), @ItemModelID INT, 
		@RMAActionCodeID INT, @PartnerID INT = null, @Value NVARCHAR(50), @Days INT
 Select @RRScope = ReturnReasonType  from SalesReturnOrderDetail INNER JOIN SalesReturnOrderHeader ON SalesReturnOrderHeader.SalesReturnOrderHeaderID = SalesReturnOrderDetail.SalesReturnOrderHeaderID
	WHERE SalesReturnOrderDetail.SalesReturnOrderDetailID = @RMAOrderDetailID


  IF (@RRScope = 'Account')    
	 SELECT @Quantity = SalesReturnOrderDetail.Quantity, @Amount = (SalesReturnOrderDetail.Quantity * ReturnPrice), @Source = SalesReturnOrderHeader.RMASource,     
	 @ItemModelID = ItemModelID, @RMAActionCodeID = SalesReturnOrderDetail.ReturnReasonID, @Days = datediff(day, InboundItemContextHistory.CreatedDate, SalesReturnOrderHeader.CreatedBy)
	 --,@PartnerID = (CASE WHEN SalesReturnOrderHeader.ReturnReasonType = 'Account' THEN ISNULL(PartnerParentID, FromAccountID)    
	 --ELSE @CustomerFromAccountID END)  
	 FROM SalesReturnOrderDetail    
	 INNER JOIN ItemInfo ON ItemInfo.ItemInfoID = SalesReturnOrderDetail.ItemInfoID    
	 INNER JOIN ItemMaster ON ItemMaster.ItemMasterID = ItemInfo.ItemMasterID    
	 --INNER JOIN [dbo].[fn_RMAItemApprover]() A ON A.SalesReturnOrderDetailID = SalesReturnOrderDetail.SalesReturnOrderDetailID    
	 INNER JOIN SalesReturnOrderHeader ON SalesReturnOrderHeader.SalesReturnOrderHeaderID = SalesReturnOrderDetail.SalesReturnOrderHeaderID    
	 --INNER JOIN Partners ON Partners.PartnerID = SalesReturnOrderHeader.FromAccountID  
	 INNER JOIN InboundItemContextHistory ON InboundItemContextHistory.ItemInfoID = ItemInfo.ItemInfoID AND InboundItemContextHistory.PartnerID = SalesReturnOrderHeader.FromAccountID
	 WHERE SalesReturnOrderDetail.SalesReturnOrderDetailID = @RMAOrderDetailID    
Else
	 SELECT @Quantity = SalesReturnOrderDetail.Quantity, @Amount = (SalesReturnOrderDetail.Quantity * ReturnPrice), @Source = SalesReturnOrderHeader.RMASource, 
	 @ItemModelID = ItemModelID, @RMAActionCodeID = SalesReturnOrderDetail.ReturnReasonID
	 FROM SalesReturnOrderDetail    
	 INNER JOIN ItemInfo ON ItemInfo.ItemInfoID = SalesReturnOrderDetail.ItemInfoID    
	 INNER JOIN ItemMaster ON ItemMaster.ItemMasterID = ItemInfo.ItemMasterID    
	 INNER JOIN SalesReturnOrderHeader ON SalesReturnOrderHeader.SalesReturnOrderHeaderID = SalesReturnOrderDetail.SalesReturnOrderHeaderID
	 
	 WHERE SalesReturnOrderDetail.SalesReturnOrderDetailID = @RMAOrderDetailID    
    
	IF(@Source = 'Account')
		SELECT @PartnerID = ISNULL(Partners.PartnerParentID, Partners.PartnerID) FROM SalesReturnOrderHeader 
		INNER JOIN SalesReturnOrderDetail ON SalesReturnOrderDetail.SalesReturnOrderHeaderID = SalesReturnOrderHeader.SalesReturnOrderHeaderID
		INNER JOIN Partners ON Partners.PartnerID = FromAccountID
		WHERE SalesReturnOrderDetail.SalesReturnOrderDetailID = @RMAOrderDetailID
	else
		SET @PartnerID = @CustomerFromAccountID

 DECLARE @QuantityRestricted BIT, @AmountRestricted BIT, @AmountWithDays BIT, @GreaterThenMaxRestricted BIT    
 IF (@RRScope = 'Account')     
 SELECT @QuantityRestricted = CASE WHEN PRRR.RuleValueEffectTO = 1 THEN 1 ELSE 0 END, 
	 --@AmountRestricted = CASE WHEN PRRR.RuleValueEffect = 2 THEN 1 ELSE 0 END, 
	 --@AmountWithDays = CASE WHEN PRRR.RuleValueEffect = 3 THEN 1 ELSE 0 END, 
	  @AmountRestricted = CASE WHEN PRRR.RuleValueEffectTO = 2 THEN 1 ELSE 0 END, 
	 @AmountWithDays = CASE WHEN PRRR.RuleValueEffectTO = 3 THEN 1 ELSE 0 END, 
	 @GreaterThenMaxRestricted = CASE WHEN PRRR.RuleValueEffect = 5 THEN 1 ELSE 0 END, 
	 @Value = PRRR.IsFixedRuleValue    
   FROM PartnerReturnReasonRuleMap PRRR    
   INNER JOIN PartnerReturnReasonMap PRR ON PRRR.PartnerReturnReasonMapID = PRR.PartnerReturnReasonMapID    
   INNER JOIN ReturnReasonRuleMap RRR ON RRR.ReturnReasonRuleMapID = PRRR.ReturnReasonRuleMapID    
   Inner Join TypeLookUp C on C.TypeLookUpId=RRR.RuleControlTypeID    
   Inner Join Rules RS on RS.RuleID=RRR.RuleID    
   left join SaleReturnOrderDetailReasonValue val on val.[ReturnReasonRuleMapID] = (case when @RMAOrderDetailID=0 then 0 else PRRR.PartnerReturnReasonRuleMapID end) and val.SaleReturnOrderDetailID=@RMAOrderDetailID    
   left join [dbo].[SalesReturnOrderDetail] srd on (val.SaleReturnOrderDetailID = srd.SalesReturnOrderDetailID     
   and srd.SalesReturnOrderDetailID = @RMAOrderDetailID)    
   --INNER JOIN [dbo].[fn_RMAItemApprover]() A ON A.ApprovalRoleID = PRRR.RuleValue     
   --and A.SalesReturnOrderDetailID =   @RMAOrderDetailID  
   WHERE PRRR.IsActive=1  and  RRR.RMAActionCodeID=@RMAActionCodeID  and PRR.RMAActionCodeID=@RMAActionCodeID and    
   PRR.PartnerID = @PartnerID AND C.TypeCode = 'RCT006'    
 ELSE    
 SELECT @QuantityRestricted = CASE WHEN PRRR.RuleValueEffectTO = 1 THEN 1 ELSE 0 END, 
	 @AmountRestricted = CASE WHEN PRRR.RuleValueEffect = 2 THEN 1 ELSE 0 END, 
	 @AmountWithDays = CASE WHEN PRRR.RuleValueEffect = 3 THEN 1 ELSE 0 END, 
	 @GreaterThenMaxRestricted = CASE WHEN PRRR.RuleValueEffect = 5 THEN 1 ELSE 0 END, 
	 @Value = PRRR.IsFixedRuleValue    
   FROM ItemModelReturnReasonRuleMap PRRR    
   INNER JOIN ItemModelReturnReasonMap PRR ON PRRR.ItemModelReturnReasonMapID = PRR.ItemModelReturnReasonMapID    
   INNER JOIN ReturnReasonRuleMap RRR ON RRR.ReturnReasonRuleMapID = PRRR.ReturnReasonRuleMapID    
   Inner Join TypeLookUp C on C.TypeLookUpId=RRR.RuleControlTypeID    
   Inner Join Rules RS on RS.RuleID=RRR.RuleID    
   left join SaleReturnOrderDetailReasonValue val on val.[ReturnReasonRuleMapID] = (case when @RMAOrderDetailID=0 then 0 else PRRR.ItemModelReturnReasonRuleMapID end) and val.SaleReturnOrderDetailID=@RMAOrderDetailID    
   left join [SalesReturnOrderDetail] srd on (val.SaleReturnOrderDetailID = srd.SalesReturnOrderDetailID     
   and srd.SalesReturnOrderDetailID = @RMAOrderDetailID)    
   --INNER JOIN [dbo].[fn_RMAItemApprover]() A ON A.ApprovalRoleID = PRRR.RuleValue    
   --and A.SalesReturnOrderDetailID =   @RMAOrderDetailID   
   WHERE PRRR.IsActive=1  and  RRR.RMAActionCodeID=@RMAActionCodeID  and PRR.RMAActionCodeID=@RMAActionCodeID and    
   PRR.ItemModelID = @ItemModelID AND C.TypeCode = 'RCT006'    
    
DECLARE @ReturnValue BIT    
IF(@QuantityRestricted = CAST(1 AS BIT))    
BEGIN
	IF(@GreaterThenMaxRestricted = CAST(1 AS BIT))    
	BEGIN    
		SET @ReturnValue = IIF(@Quantity >= CAST(@Value AS FLOAT), 1, 0)    
	END    
	ELSE IF(@GreaterThenMaxRestricted = CAST(0 AS BIT))    
	BEGIN    
		SET @ReturnValue = IIF(@Quantity <= CAST(@Value AS FLOAT), 1, 0)
	END    
END     
ELSE IF(@AmountRestricted = CAST(1 AS BIT))    
BEGIN    
	IF(@GreaterThenMaxRestricted = CAST(1 AS BIT))    
	BEGIN    
		SET @ReturnValue = IIF(@Amount >= CAST(@Value AS FLOAT), 1, 0)    
	END    
	ELSE IF(@GreaterThenMaxRestricted = CAST(0 AS BIT))    
	BEGIN    
		SET @ReturnValue = IIF(@Amount <= CAST(@Value AS FLOAT), 1, 0)    
	END    
END    
ELSE IF(@AmountWithDays = CAST(1 AS BIT))    
BEGIN
	DECLARE @AM FLOAT, @DY FLOAT
	SELECT TOP 1 @AM = items from dbo.split(@Value, '&')
	SELECT TOP 1 @DY = items from dbo.split(@Value, '&') ORDER BY id DESC

	IF(@GreaterThenMaxRestricted = CAST(1 AS BIT))    
	BEGIN    
		SET @ReturnValue = IIF((@Amount >= @AM AND @Days >= @DY), 1, 0)    
	END    
	ELSE IF(@GreaterThenMaxRestricted = CAST(0 AS BIT))    
	BEGIN    
		SET @ReturnValue = IIF((@Amount <= @AM AND @Days <= @DY), 1, 0)    
	END    
END    

RETURN @ReturnValue    
END

GO
/****** Object:  UserDefinedFunction [dbo].[UDF_WF_Discrepancy_Resolved]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 CREATE Function [dbo].[UDF_WF_Discrepancy_Resolved](@RMAOrderDetailID int) Returns BIT
AS 
Begin  

--IF EXISTS(SELECT 1 FROM InboundItemContextHistory 
--INNER JOIN ModuleStatusMap ON ModuleStatusMap.ModuleStatusMapID = InboundItemContextHistory.ModuleStatusMapID
--INNER JOIN Statuses ON Statuses.StatusID = ModuleStatusMap.StatusID AND Statuses.StatusCode = 'ST023'
--WHERE RefDetailID = @RMAOrderDetailID AND Discrepancy IS NOT NULL)
--	return 1
return 0

end

GO
/****** Object:  UserDefinedFunction [dbo].[UDF_WF_Has_Discrepancy]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 CREATE Function [dbo].[UDF_WF_Has_Discrepancy](@RMAOrderDetailID int) Returns BIT
AS 
Begin  

IF EXISTS(SELECT 1 FROM InboundItemContextHistory 
INNER JOIN ModuleStatusMap ON ModuleStatusMap.ModuleStatusMapID = InboundItemContextHistory.ModuleStatusMapID
INNER JOIN Statuses ON Statuses.StatusID = ModuleStatusMap.StatusID AND Statuses.StatusCode = 'ST015'
WHERE RefDetailID = @RMAOrderDetailID AND Discrepancy IS NOT NULL)
	return 1
return 0

end

GO
/****** Object:  UserDefinedFunction [dbo].[UDF_WF_Repair_AllPartAllocated]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE Function [dbo].[UDF_WF_Repair_AllPartAllocated](@RepairID int) returns bit
as
Begin
Declare @AllocateStatusID int=(select StatusID from statuses where StatusCode='ST001')
if exists(select * from RMARepairPart rrp
Left join  RepairItemContextHistory ric on rrp.RMARepairPartID=ric.rmaRepairPartID
where ric.RepairItemContextHistoryID is null and RMARepairHistoryID= @RepairID)
Begin
	Return 0
End
Return 1
End

GO
/****** Object:  UserDefinedFunction [dbo].[UDF_WF_Repair_AllPartConsumed]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE Function [dbo].[UDF_WF_Repair_AllPartConsumed](@RepairID int) returns bit
as
Begin
Declare @AllocateStatusID int=(select StatusID from statuses where StatusCode='ST001')
Declare @ConsumedStatusID int=(select StatusID from statuses where StatusCode='ST001A')
if exists(select * from RMARepairPart rrp
Left join  (select * from RepairItemContextHistory where itemstatusID<>@AllocateStatusID) ric on rrp.RMARepairPartID=ric.rmaRepairPartID
where ric.RepairItemContextHistoryID is null and RMARepairHistoryID= @RepairID)
Begin
	Return 0
End
Return 1
End

GO
/****** Object:  UserDefinedFunction [dbo].[UDF_WF_Repair_AllTestPassed]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE Function [dbo].[UDF_WF_Repair_AllTestPassed](@RepairID int) returns bit
as
Begin
if exists(select * from RMARepairTestResult where RMARepairHistoryID=@RepairID
and TestNumber in(select max(TestNumber) from RMARepairTestResult where RMARepairHistoryID=@RepairID)
and TestResult='FAIL' and Remarks is null)
Begin
	Return 0
End
else
Begin
	if exists(select * from RMARepairTestResult where RMARepairHistoryID=@RepairID and Remarks is null)	
		Return 1
	else
		Return 0
End
Return 0
End

GO
/****** Object:  UserDefinedFunction [dbo].[UDF_WF_Repair_DeliveryMethodbyCourier]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 


CREATE Function [dbo].[UDF_WF_Repair_DeliveryMethodbyCourier](@RepairID int) returns bit
as
Begin
Declare @ByCourierTypeID int=(select TypeLookUpID from TypeLookUp where TypeCode='DLY002')
Declare @ByHandTypeID int=(select TypeLookUpID from TypeLookUp where TypeCode='DLY001')
if exists(select * from RMAOrderDetail rod 
inner join RMARepairHistory rrh on rod.RMAOrderDetailID=rrh.RMAOrderDetailID
where rrh.RMARepairHistoryID=@RepairID and rod.DeliveryTypeID=@ByCourierTypeID)
Begin
	Return 1
End
Return 0
End

GO
/****** Object:  UserDefinedFunction [dbo].[UDF_WF_Repair_DeliveryMethodbyHand]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE Function [dbo].[UDF_WF_Repair_DeliveryMethodbyHand](@RepairID int) returns bit
as
Begin
Declare @ByCourierTypeID int=(select TypeLookUpID from TypeLookUp where TypeCode='DLY002')
Declare @ByHandTypeID int=(select TypeLookUpID from TypeLookUp where TypeCode='DLY001')
if exists(select * from RMAOrderDetail rod 
inner join RMARepairHistory rrh on rod.RMAOrderDetailID=rrh.RMAOrderDetailID
where rrh.RMARepairHistoryID=@RepairID and rod.DeliveryTypeID=@ByHandTypeID)
Begin
	Return 1
End
Return 0
End

GO
/****** Object:  UserDefinedFunction [dbo].[UDF_WF_Repair_FullyPaid]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 


CREATE Function [dbo].[UDF_WF_Repair_FullyPaid](@RepairID int) returns bit
as
Begin
Declare @RMAOrderDetailID int =(select RMAOrderDetailID from RMARepairHistory where RMARepairHistoryID=@RepairID)
Declare @TotalCost numeric(10,2)=(select sum( c.CostAmount*(case when IsAddCost=0 then -1 else 1 end)) TotalCost from RMAOrderDetailCostMap c 
			INNER JOIN CostCodeLookUp t on t.CostCodeLookUpID = c.CostCodeLookupID where c.RMAOrderDetailID=@RMAOrderDetailID)
Declare @PaidAmount numeric(10,2)=(select ISNULL(sum(AMount),0) from RMAOrderDetailPayment where RMAOrderDetailID=@RMAOrderDetailID)
if (@PaidAmount>=@TotalCost)
Begin
	Return 1
End
Return 0
End

GO
/****** Object:  UserDefinedFunction [dbo].[UDF_WF_Repair_PartSelected]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE Function [dbo].[UDF_WF_Repair_PartSelected](@RepairID int) returns bit
as
Begin
if exists(select * from RMARepairPart where  RMARepairHistoryID= @RepairID)
Begin
	Return 1
End
Return 0
End

GO
/****** Object:  UserDefinedFunction [dbo].[UDF_WF_Repair_QuotationAproved]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE Function [dbo].[UDF_WF_Repair_QuotationAproved](@RepairID int) returns bit
as
Begin
declare @quotepending bit
Declare @RMAOrderDetailID int =(select RMAOrderDetailID from RMARepairHistory where RMARepairHistoryID=@RepairID)
select @quotepending=[dbo].UDF_WF_Repair_QuotationPending(@RepairID)
if @quotepending=1 and exists(select * from RMAQuoteAction rqa
where RMAOrderDetailID=@RMAOrderDetailID and RMAQuoteActionID in(select MAX(RMAQuoteActionID) 
from RMAQuoteAction where RMAOrderDetailID=@RMAOrderDetailID) and rqa.isApproved =1)
Begin
	Return 1
End
Return 0
End

GO
/****** Object:  UserDefinedFunction [dbo].[UDF_WF_Repair_QuotationPending]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 


CREATE Function [dbo].[UDF_WF_Repair_QuotationPending](@RepairID int) returns bit
as
Begin
Declare @RMAOrderDetailID int =(select RMAOrderDetailID from RMARepairHistory where RMARepairHistoryID=@RepairID)
Declare @TotalCost numeric(10,2)=(select sum( c.CostAmount*(case when IsAddCost=0 then -1 else 1 end)) TotalCost from RMAOrderDetailCostMap c 
			INNER JOIN CostCodeLookUp t on t.CostCodeLookUpID = c.CostCodeLookupID where c.RMAOrderDetailID=@RMAOrderDetailID)

if exists(select * from RMAOrderDetail rod 
inner join RMARepairHistory rrh on rod.RMAOrderDetailID=rrh.RMAOrderDetailID
inner join RMAQuoteAction rqa on rod.RMAOrderDetailID=rqa.RMAOrderDetailID
where rrh.RMARepairHistoryID=@RepairID and AprovedAmount>=@TotalCost)
Begin
	Return 1
End
Return 0
End

GO
/****** Object:  UserDefinedFunction [dbo].[UDF_WF_Repair_QuotationRejected]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 


CREATE Function [dbo].[UDF_WF_Repair_QuotationRejected](@RepairID int) returns bit
as
Begin
declare @quotepending bit
Declare @RMAOrderDetailID int =(select RMAOrderDetailID from RMARepairHistory where RMARepairHistoryID=@RepairID)
select @quotepending=[dbo].UDF_WF_Repair_QuotationPending(@RepairID)
if @quotepending=1 and exists(select * from RMAQuoteAction rqa
where RMAOrderDetailID=@RMAOrderDetailID and RMAQuoteActionID in(select MAX(RMAQuoteActionID) 
from RMAQuoteAction where RMAOrderDetailID=@RMAOrderDetailID) and rqa.isApproved =0)
Begin
	Return 1
End
	Return 0
End

GO
/****** Object:  UserDefinedFunction [dbo].[UDF_WF_Repair_SomeTestFailed]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE Function [dbo].[UDF_WF_Repair_SomeTestFailed](@RepairID int) returns bit
as
Begin
if exists(select * from RMARepairTestResult where RMARepairHistoryID=@RepairID
and TestNumber in(select max(TestNumber) from RMARepairTestResult where RMARepairHistoryID=@RepairID)
and TestResult='FAIL' and Remarks is null)
Begin
	Return 1
End
Return 0
End

GO
/****** Object:  UserDefinedFunction [dbo].[UDF_WF_Return_CheckDispatchInfo]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE FUNCTION [dbo].[UDF_WF_Return_CheckDispatchInfo](@RMAOrderDetailID int) Returns Bit
AS
Begin
	DECLARE @Q FLOAT, @Q1 FLOAT, @ret bit=0
	SELECT @Q = ISNULL(SUM(ShipmentDetail.Quantity), 0), @Q1 = ISNULL(SalesReturnOrderDetail.Quantity, 0)
	FROM SalesReturnOrderDetail LEFT JOIN ShipmentDetail ON ShipmentDetail.OrderDetailID = SalesReturnOrderDetail.SalesReturnOrderDetailID
	Where SalesReturnOrderDetailID = @RMAOrderDetailID GROUP BY SalesReturnOrderDetail.SalesReturnOrderDetailID, SalesReturnOrderDetail.Quantity
	IF(@Q < @Q1 OR @Q = 0)		
		set @ret = 0
	ELSE
		set @ret = 1
	return @ret
End

GO
/****** Object:  UserDefinedFunction [dbo].[UDF_WF_Return_ShipmentInitiated]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE FUNCTION [dbo].[UDF_WF_Return_ShipmentInitiated](@RMAOrderDetailID int) Returns Bit
AS
Begin
	DECLARE @Q FLOAT, @Q1 FLOAT, @ret bit=0
	SELECT @Q = ISNULL(SUM(ShipmentDetail.Quantity), 0), @Q1 = ISNULL(SalesReturnOrderDetail.Quantity, 0)
	FROM SalesReturnOrderDetail LEFT JOIN ShipmentDetail ON ShipmentDetail.OrderDetailID = SalesReturnOrderDetail.SalesReturnOrderDetailID
	Where SalesReturnOrderDetailID = @RMAOrderDetailID GROUP BY SalesReturnOrderDetail.SalesReturnOrderDetailID, SalesReturnOrderDetail.Quantity
	IF(@Q = 0)		
		set @ret = 0
	ELSE
		set @ret = 1
	return @ret
End

GO
/****** Object:  UserDefinedFunction [dbo].[UDF_WF_Return_ShippedAll]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE FUNCTION [dbo].[UDF_WF_Return_ShippedAll](@RMAOrderDetailID int) Returns Bit
AS
Begin
	DECLARE @Q FLOAT, @Q1 FLOAT, @ret bit=0
	SELECT @Q = ISNULL(SUM(ShipmentDetail.Quantity), 0), @Q1 = ISNULL(SalesReturnOrderDetail.Quantity, 0)
	FROM SalesReturnOrderDetail LEFT JOIN ShipmentDetail ON ShipmentDetail.OrderDetailID = SalesReturnOrderDetail.SalesReturnOrderDetailID
	Where SalesReturnOrderDetailID = @RMAOrderDetailID GROUP BY SalesReturnOrderDetail.SalesReturnOrderDetailID, SalesReturnOrderDetail.Quantity
	IF(@Q = @Q1)		
		set @ret = 1
	ELSE
		set @ret = 0
	return @ret
End

GO
/****** Object:  UserDefinedFunction [dbo].[UDF_WF_ReturnAllInitialInput]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE Function [dbo].[UDF_WF_ReturnAllInitialInput](@RMAOrderDetailID int) Returns BIT
AS 
Begin  
	if exists(Select * from SalesReturnOrderDetail where SalesReturnOrderDetailID=@RMAOrderDetailID) 
		Return 1 
	Else
		Return 0  
Return 0
End

GO
/****** Object:  UserDefinedFunction [dbo].[UDF_WF_ReturnApprovalRequired]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE Function [dbo].[UDF_WF_ReturnApprovalRequired](@RMAOrderDetailID int) Returns BIT
AS 
Begin  

DECLARE @wf BIT, @rl BIT, @rc BIT
SELECT @wf = [dbo].[UDF_WF_ReturnApprovalWFExists](@RMAOrderDetailID)
SELECT @rl = [dbo].[UDF_WF_ReturnApprovalRuleExists](@RMAOrderDetailID)
SELECT @rc = [dbo].[UDF_WF_ApprovalPreRequisite](@RMAOrderDetailID)
IF (@wf = CAST(1 AS BIT) AND @rl = CAST(1 AS BIT) AND @rc = CAST(1 AS BIT))
	return 1
return 0

end

GO
/****** Object:  UserDefinedFunction [dbo].[UDF_WF_ReturnApprovalRequiredForInsert]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE Function [dbo].[UDF_WF_ReturnApprovalRequiredForInsert](@RMAOrderDetailID int) Returns BIT
AS 
Begin  

DECLARE @wf BIT, @rl BIT, @rc BIT
SELECT @wf = [dbo].[UDF_WF_ReturnApprovalWFExists](@RMAOrderDetailID)
SELECT @rl = [dbo].[UDF_WF_ReturnApprovalRuleExists](@RMAOrderDetailID)
SELECT @rc = [dbo].[UDF_WF_ApprovalPreRequisiteForInsert](@RMAOrderDetailID)
IF (@wf = CAST(1 AS BIT) AND @rl = CAST(1 AS BIT) AND @rc = CAST(1 AS BIT))
	return 1
return 0

end

GO
/****** Object:  UserDefinedFunction [dbo].[UDF_WF_ReturnApprovalRuleExists]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE Function [dbo].[UDF_WF_ReturnApprovalRuleExists](@SalesReturnOrderDetailID int) Returns BIT
AS 
Begin  
DECLARE @ParentPartnerID INT, @PartnerID INT, @RMAActionCodeID INT, @Source NVARCHAR(50), @RRScope NVARCHAR(50), @ItemModelID INT
SELECT @RMAActionCodeID = ReturnReasonID, @PartnerID = SalesReturnOrderHeader.FromAccountID, @Source = SalesReturnOrderHeader.RMASource, @RRScope = ReturnReasonType,
@ItemModelID = ItemModelID
from SalesReturnOrderDetail 
INNER JOIN ItemInfo ON ItemInfo.ItemInfoID = SalesReturnOrderDetail.ItemInfoID
INNER JOIN ItemMaster ON ItemMaster.ItemMasterID = ItemInfo.ItemMasterID
INNER JOIN SalesReturnOrderHeader ON SalesReturnOrderHeader.SalesReturnOrderHeaderID = SalesReturnOrderDetail.SalesReturnOrderHeaderID
WHERE SalesReturnOrderDetailID = @SalesReturnOrderDetailID

IF(@Source = 'Customer')
	SELECT TOP 1 @ParentPartnerID = PartnerID FROM Partners INNER JOIN TypeLookUp on TypeLookUp.TypeLookUpID = Partners.OrgSubTypeID and TypeLookUp.TypeCode = 'PTR004-04'
ELSE
	select @ParentPartnerID = ISNULL(PartnerParentID, PartnerID) from Partners WHERE PartnerID = @PartnerID

IF (@RRScope = 'Account') AND EXISTS(SELECT 1
		FROM PartnerReturnReasonRuleMap PRRR
		INNER JOIN PartnerReturnReasonMap PRR ON PRRR.PartnerReturnReasonMapID = PRR.PartnerReturnReasonMapID
		INNER JOIN ReturnReasonRuleMap RRR ON RRR.ReturnReasonRuleMapID = PRRR.ReturnReasonRuleMapID
		Inner Join TypeLookUp C on C.TypeLookUpId=RRR.RuleControlTypeID
		Inner Join Rules RS on RS.RuleID=RRR.RuleID
		left join SaleReturnOrderDetailReasonValue val on val.[ReturnReasonRuleMapID] = (case when @SalesReturnOrderDetailID=0 then 0 else PRRR.PartnerReturnReasonRuleMapID end) and val.SaleReturnOrderDetailID=@SalesReturnOrderDetailID
		left join [SalesReturnOrderDetail] srd on (val.SaleReturnOrderDetailID = srd.SalesReturnOrderDetailID 
		and srd.SalesReturnOrderDetailID = @SalesReturnOrderDetailID)
		WHERE PRRR.IsActive=1  and  RRR.RMAActionCodeID=@RMAActionCodeID  and PRR.RMAActionCodeID=@RMAActionCodeID and
		PRR.PartnerID = @ParentPartnerID AND C.TypeCode = 'RCT006')
	return 1
ELSE IF (@RRScope = 'Product Model') AND EXISTS(SELECT 1
		FROM ItemModelReturnReasonRuleMap PRRR
		INNER JOIN ItemModelReturnReasonMap PRR ON PRRR.ItemModelReturnReasonMapID = PRR.ItemModelReturnReasonMapID
		INNER JOIN ReturnReasonRuleMap RRR ON RRR.ReturnReasonRuleMapID = PRRR.ReturnReasonRuleMapID
		Inner Join TypeLookUp C on C.TypeLookUpId=RRR.RuleControlTypeID
		Inner Join Rules RS on RS.RuleID=RRR.RuleID
		left join SaleReturnOrderDetailReasonValue val on val.[ReturnReasonRuleMapID] = (case when @SalesReturnOrderDetailID=0 then 0 else PRRR.ItemModelReturnReasonRuleMapID end) and val.SaleReturnOrderDetailID=@SalesReturnOrderDetailID
		left join [SalesReturnOrderDetail] srd on (val.SaleReturnOrderDetailID = srd.SalesReturnOrderDetailID 
		and srd.SalesReturnOrderDetailID = @SalesReturnOrderDetailID)
		WHERE PRRR.IsActive=1  and  RRR.RMAActionCodeID=@RMAActionCodeID  and PRR.RMAActionCodeID=@RMAActionCodeID and
		PRR.ItemModelID = @ItemModelID AND C.TypeCode = 'RCT006')
	return 1
return 0
end

GO
/****** Object:  UserDefinedFunction [dbo].[UDF_WF_ReturnApprovals]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE Function [dbo].[UDF_WF_ReturnApprovals](@RMAOrderDetailID int) Returns BIT
AS 
Begin  
 
--Declare @ApprovalCount int, @ApprovalActionCount int
--Set @ApprovalCount = 0 
--SELECT @ApprovalCount = Count(*) 
--FROM SalesReturnOrderHeader SRH 
--Inner Join SalesReturnOrderDetail SRD  on SRH.SalesReturnOrderHeaderID = SRD.SalesReturnOrderHeaderID 
--Inner Join PartnerReturnReasonMap PRR on SRH.FromAccountID = PRR.PartnerID 
--Inner Join PartnerReturnReasonRuleMap PRRR  ON PRRR.PartnerReturnReasonMapID = PRR.PartnerReturnReasonMapID 
--INNER JOIN ReturnReasonRuleMap RRR ON RRR.ReturnReasonRuleMapID = PRRR.ReturnReasonRuleMapID  
--Inner Join TypeLookUp C on C.TypeLookUpId=RRR.RuleControlTypeID  
--Inner Join Rules RS on RS.RuleID=RRR.RuleID  
--WHERE C.TypeName = 'Roles List' and SRD.SalesReturnOrderDetailID = @RMAOrderDetailID and RRR.IsActive=1 and RRR.isMandatory = 1

--If @ApprovalCount > 0
--Begin
--	Select @ApprovalActionCount =Count(*) from SalesReturnAction where SalesReturnOrderDetailID=@RMAOrderDetailID 
--	if @ApprovalCount = @ApprovalActionCount
--		Return 1 
--	Else
--		Return 0  
--End 	  
--Return 1
--End

IF NOT EXISTS(SELECT 1 FROM SalesReturnAction where SalesReturnOrderDetailID = @RMAOrderDetailID and (isapproved = 0 OR isapproved is null))
	return 1
return 0

end

GO
/****** Object:  UserDefinedFunction [dbo].[UDF_WF_ReturnApprovalWFExists]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE Function [dbo].[UDF_WF_ReturnApprovalWFExists](@RMAOrderDetailID int) Returns BIT
AS 
Begin  


IF EXISTS(SELECT 1
FROM SalesReturnOrderHeader INNER JOIN SalesReturnOrderDetail ON SalesReturnOrderDetail.SalesReturnOrderHeaderID = SalesReturnOrderHeader.SalesReturnOrderHeaderID
INNER JOIN ModuleWorkflow ON ModuleWorkflow.ModuleWorkflowID = SalesReturnOrderDetail.ModuleWorkflowID
INNER JOIN ModuleWorkFlowDetail ON ModuleWorkFlowDetail.ModuleWorkFlowID = ModuleWorkFlow.ModuleWorkFlowID
INNER JOIN ModuleStatusMap ON ModuleStatusMap.ModuleStatusMapID = ModuleWorkFlowDetail.NextModuleStatusMapID
INNER JOIN Statuses ON Statuses.StatusID = ModuleStatusMap.StatusID AND Statuses.StatusCode = 'SOR62'
WHERE SalesReturnOrderDetailID = @RMAOrderDetailID)
	return 1
return 0

end

GO
/****** Object:  UserDefinedFunction [dbo].[UDF_WF_ReturnRejects]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE Function [dbo].[UDF_WF_ReturnRejects](@RMAOrderDetailID int) Returns BIT
AS 
Begin  
 
--Declare @ApprovalCount int, @ApprovalActionCount int
--Set @ApprovalCount = 0 
--SELECT @ApprovalCount = Count(*) 
--FROM SalesReturnOrderHeader SRH 
--Inner Join SalesReturnOrderDetail SRD  on SRH.SalesReturnOrderHeaderID = SRD.SalesReturnOrderHeaderID 
--Inner Join PartnerReturnReasonMap PRR on SRH.FromAccountID = PRR.PartnerID 
--Inner Join PartnerReturnReasonRuleMap PRRR  ON PRRR.PartnerReturnReasonMapID = PRR.PartnerReturnReasonMapID 
--INNER JOIN ReturnReasonRuleMap RRR ON RRR.ReturnReasonRuleMapID = PRRR.ReturnReasonRuleMapID  
--Inner Join TypeLookUp C on C.TypeLookUpId=RRR.RuleControlTypeID  
--Inner Join Rules RS on RS.RuleID=RRR.RuleID  
--WHERE C.TypeName = 'Roles List' and SRD.SalesReturnOrderDetailID = @RMAOrderDetailID and RRR.IsActive=1 and RRR.isMandatory = 1

--If @ApprovalCount > 0
--Begin
--	Select @ApprovalActionCount =Count(*) from SalesReturnAction where SalesReturnOrderDetailID=@RMAOrderDetailID 
--	if @ApprovalCount = @ApprovalActionCount
--		Return 1 
--	Else
--		Return 0  
--End 	  
--Return 1
--End

IF EXISTS(SELECT 1 FROM SalesReturnAction where SalesReturnOrderDetailID = @RMAOrderDetailID and isapproved = 0)
	return 1
return 0

end

--select dbo.UDF_WF_ReturnApprovals(153)
--select * from salesreturnorderdetail

GO
/****** Object:  UserDefinedFunction [dbo].[UDF_WF_RMAReturnApprovals]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE Function [dbo].[UDF_WF_RMAReturnApprovals](@RMAOrderHeaderID int) Returns BIT
AS 
Begin  

IF NOT EXISTS(SELECT 1 FROM SalesReturnAction A LEFT OUTER JOIN SalesReturnOrderDetail D
				ON A.SalesReturnOrderDetailID = D.SalesReturnOrderDetailID
				WHERE SalesReturnOrderHeaderID = @RMAOrderHeaderID and (isapproved = 0 OR isapproved is null))
	return 1
return 0

end

GO
/****** Object:  UserDefinedFunction [dbo].[usp_GenerateAutoNumberByRuleName]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE Function [dbo].[usp_GenerateAutoNumberByRuleName]
( 
@RuleName nvarchar(100),
@TableName nvarchar(100),@FieldName nvarchar(100), @UserId int
)
returns  nvarchar(1000)
as
begin
 Declare @returns nvarchar(1000)
 Declare @string as nvarchar(max) = '<PrefixAsYearFourDigit>PL_<PrefixAsMonth><PrefixAsCurrentLocationCode>'
, @PrefixName as Nvarchar(max)
, @PrefixValue as Nvarchar(max)
, @PrefixQuery as Nvarchar(max)
,@numberLength as int
,@PrefixLocationCode as nvarchar(1000)
Select @PrefixLocationCode= PartnerCode 
From Partners WHERE 
PartnerID=(Select Top 1 PartnerId From UserRoleMap
INNER JOIN PartnerUserRoleMap
ON
PartnerUserRoleMap.UserRoleMapID=UserRoleMap.UserRoleMapID
)

--Select * from KeyFieldAutoGenRule
select @string=Prefix,@numberLength=numberLength from KeyFieldAutoGenRule where RuleName=@RuleName

--PJ_<PrefixAsCurrentLocationCode><PrefixAsYearFourDigit><PrefixAsMonth>
--select * from prefixmaster
set @string=replace(@string,'<PrefixAsYearFourDigit>',(Select Substring(Cast(Year(GetDate()) as Nvarchar),1,4)))
set @string=replace(@string,'<PrefixAsYearTwoDigit>',(Select Substring(Cast(Year(GetDate()) as Nvarchar),3,4)))
set @string=replace(@string,'<PrefixAsMonth>',(SELECT RIGHT('00'+Cast(Month(Getdate()) as Varchar(2)),2)))
set @string=replace(@string,'<PrefixAsDate>',(SELECT RIGHT('00'+Cast(Day(Getdate()) as Varchar(2)),2)))
set @string=replace(@string,'<PrefixAsCurrentLocationCode>',@PrefixLocationCode)
declare @num1 nvarchar(100)
declare @sql nvarchar(Max)='(select '''+@string+''' +Right(REPLICATE(''0'',10)+cast(cast(max(SUBSTRING('+@FieldName+',len('''+@string+''')+1,LEN('+@FieldName+'))) as int)+1 as nvarchar(max)),10) from '+@TableName+' where '+@FieldName+' like'''+@string+'%'')'
exec sp_executeSQL @sql,N'@num1 nvarchar(100) out',@num1=@returns out
--declare @number int=cast(@num1 as int)
--select @sql,@num1,@number,'PJ_#2524201601'+Right(REPLICATE('0',10)+cast(isnull(@number,0)+1 as nvarchar(max)),10)
return @returns
end

--Select [dbo].[usp_GenerateAutoNumberByRuleName]('PurchaseOrder_Number','POHeader','PONumber',44)
---- select (select top 1 ItemNumber from ItemMaster)

----(select 'PJ_#2524201601' +Right(REPLICATE('0',10)+cast(cast(max(SUBSTRING(ItemNumber,len('PJ_#2524201601')+1,LEN(ItemNumber))) as int)+1 as nvarchar(max)),10) from ItemMaster where ItemNumber like'PJ_#2524201601%')

--select * from KeyFieldAutoGenRule
--select * from POHeader

GO
/****** Object:  UserDefinedFunction [dbo].[MultipleDelemiterSplit]    Script Date: 25-05-2020 09:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 CREATE FUNCTION [dbo].[MultipleDelemiterSplit]
(
   @List NVARCHAR(MAX)
)
RETURNS  TABLE
AS
   RETURN
   (

      SELECT Item = FirstSet.cnt.value('(./text())[1]', 'nvarchar(4000)')
      FROM
      (
        SELECT x = CONVERT(XML, '<cnt>'
          + @List
          + '</cnt>').query('.')
      ) AS a CROSS APPLY x.nodes('cnt') AS FirstSet(cnt)
   );

GO
