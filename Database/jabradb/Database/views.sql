/****** Object:  View [dbo].[vw_archived_report]    Script Date: 25-05-2020 09:05:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

Create VIEW [dbo].[vw_archived_report]
AS
SELECT 
1 A, 2 B,3 C
GO
/****** Object:  View [dbo].[vw_CaseAssessment]    Script Date: 25-05-2020 09:05:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE VIEW [dbo].[vw_CaseAssessment]
AS
SELECT 
  dbo.Case_Creation.CaseID AS CaseID, 
  dbo.Case_Creation.CaseNo AS CaseNo, 
  dbo.Case_Creation.OrderID AS OrderID, 
  dbo.Case_Creation.OrderNo AS OrderNo, 
  dbo.Case_Creation.IssueId AS IssueId, 
  dbo.Case_Creation.RootCauseId AS RootCauseId, 
  dbo.Case_Creation.LocationId AS LocationId, 
  dbo.Case_Creation.ReferenceNo AS ReferenceNo, 
  dbo.Case_Creation.Quantity AS Quantity, 
  dbo.Case_Creation.PersonalInfoAccountID AS PersonalInfoAccountID, 
  dbo.Case_Creation.PersonalInfoAccountNo AS PersonalInfoAccountNo, 
  dbo.Case_Creation.PersonalFirstName AS PersonalFirstName, 
  dbo.Case_Creation.PersonalLastName AS PersonalLastName, 
  dbo.Case_Creation.PersonalPhoneNo AS PersonalPhoneNo, 
  dbo.Case_Creation.PersonalEmail AS PersonalEmail, 
  dbo.Case_Creation.ShipToId AS ShipToId, 
  dbo.Case_Creation.ShipToNo AS ShipToNo, 
  dbo.Case_Creation.CaseStatus AS CaseStatus, 
  dbo.Case_Creation.CreatedBy AS CreatedBy, 
  dbo.Case_Creation.CreatedDate AS CreatedDate, 
  dbo.Case_Creation.ModifiedBy AS ModifiedBy, 
  dbo.Case_Creation.ModifiedDate AS ModifiedDate, 
 
  --dbo.intake_orders.order_number AS order_number, 
  --dbo.intake_orders.vendor_number AS vendor_number, 
  --dbo.intake_orders.req_by_date AS req_by_date, 
  --dbo.intake_orders.price_year AS price_year, 
  --dbo.intake_orders.season_code_id AS season_code_id, 
  --dbo.intake_orders.product_number AS product_number, 
  --dbo.intake_orders.category_code_id AS category_code_id, 
  --dbo.intake_orders.grade_code_id AS grade_code_id, 
  --dbo.intake_orders.subcategory_code_id AS subcategory_code_id, 
  --dbo.intake_orders.sex_code AS sex_code, 
  --dbo.intake_orders.hstariff_id AS hstariff_id, 
  --dbo.intake_orders.country_of_origin_id AS country_of_origin_id, 
  --dbo.intake_orders.prim_season_code AS prim_season_code, 
  dbo.intake_orders.product_sku AS product_sku, 
  --dbo.intake_orders.product_qty AS product_qty, 
  --dbo.intake_orders.product_weight AS product_weight, 
  dbo.intake_orders.size_code_id AS size_code_id, 
  --dbo.intake_orders.sort_order AS sort_order, 
  dbo.intake_orders.base_color AS base_color, 
  --dbo.intake_orders.hex_value AS hex_value, 
  --dbo.intake_orders.createdby AS intake_orderscreatedby, 
  --dbo.intake_orders.updatedby AS intake_ordersupdatedby, 
  --dbo.intake_orders.updated_date AS intake_ordersupdated_date, 
  --dbo.intake_orders.IsActive AS intake_ordersIsActive, 
  --dbo.intake_orders.created_date AS intake_orderscreated_date 
  '' lastcolumn
FROM 
  dbo.Case_Creation 
  INNER JOIN dbo.intake_orders ON dbo.Case_Creation.OrderID = dbo.intake_orders.order_Id

GO
/****** Object:  View [dbo].[vw_GetAccountCarrier]    Script Date: 25-05-2020 09:05:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



CREATE view [dbo].[vw_GetAccountCarrier]
AS
SELECT rcm.RegionID,t.TypeName, t.TypeCode, t.TypeLookUpID,rcm.ConfigGroup
FROM regionconfigmap rcm INNER JOIN TypeLookUp t
ON rcm.configgroup = t.TypeCode
WHERE configgroup IN(SELECT typecode FROM typelookup WHERE typegroup='carriergateway')
AND rcm.TypeLookUPID IN (SELECT rcm.typelookupid FROM regionconfigmap rcm 
INNER JOIN typelookup t ON t.typelookupid=rcm.typelookupid WHERE configgroup IN(SELECT typecode FROM typelookup WHERE typegroup='carriergateway') AND typename='Activate')
--AND rcm.description='true'
GO
/****** Object:  View [dbo].[vw_GetCarrier]    Script Date: 25-05-2020 09:05:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE view [dbo].[vw_GetCarrier]
as
--select typename from typelookup where typecode in(
--	select  * from regionconfigmap rcm 
--	inner join typelookup t on t.typelookupid=rcm.typelookupid where configgroup in(select typecode from typelookup where typegroup='carriergateway')  and typename='Activate'
--	and rcm.description='true'	
--)

select rcm.RegionID,t.TypeName, t.TypeCode, t.TypeLookUpID,rcm.ConfigGroup
from regionconfigmap rcm inner join TypeLookUp t
on rcm.configgroup = t.TypeCode
where configgroup in(select typecode from typelookup where typegroup='carriergateway')
and rcm.TypeLookUPID in (select  rcm.typelookupid from regionconfigmap rcm 
inner join typelookup t on t.typelookupid=rcm.typelookupid where configgroup in(select typecode from typelookup where typegroup='carriergateway')  and typename='Activate')
and rcm.description='true'
GO
/****** Object:  View [dbo].[vw_GetCarrierByPartner]    Script Date: 25-05-2020 09:05:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE view [dbo].[vw_GetCarrierByPartner]
as
select *from TypeLookUp where TypeGroup='CarrierGateway'
GO
/****** Object:  View [dbo].[vw_GetDefaultCarrier]    Script Date: 25-05-2020 09:05:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE view [dbo].[vw_GetDefaultCarrier]
as
select typelookupid, typename from typelookup where typecode in(
	select  top 1 configgroup from regionconfigmap rcm 
	inner join typelookup t on t.typelookupid=rcm.typelookupid where configgroup in(select typecode from typelookup where typegroup='carriergateway')  and typename='Activate'
	and rcm.description='true'
	and configgroup in 
	(
		select  top 1 configgroup from regionconfigmap rcm 
		inner join typelookup t on t.typelookupid=rcm.typelookupid 
		where configgroup in(select typecode from typelookup where typegroup='carriergateway') and typename='Is Default'
		and rcm.description='true'
	)
)
GO
/****** Object:  View [dbo].[vw_inbound_log]    Script Date: 25-05-2020 09:05:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[vw_inbound_log]
AS
SELECT 
[order_Id]  id, 
''   email, 
   order_number, 
[req_by_date]   shiped_date, 
[created_date]   delivered_date, 
		JSON_QUERY('{    
		"account_id": "1",    
		"name1": "'+[vendor_number]+'",    
		"name2": "Name32",    
		"primary_email": "xyz@jabra.com",    
		"secondary_email": "",    
		"phone": "",    
		"address": {     
		"street1": "Vliegend Hertlaan 71",     
		"street2": "Le Mirage",     
		"building": "Building name",     
		"postal_code": "1234",     
		"city": "Utrecht",     
		"country": "AT",     
		"state_code": "HI"    }   }')   
		customer, 
''   items, 
''   payload, 
1   version 
FROM 
  dbo.intake_orders
GO
/****** Object:  View [dbo].[vw_ort_report]    Script Date: 25-05-2020 09:05:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE VIEW [dbo].[vw_ort_report]
AS
SELECT        rh.order_number, rh.return_number, rh.created_date, rh.return_qty AS return_Qty, PA.PartnerName AS BrandName, PA1.PartnerName, CI.name, CI.email, CI.phone, CI.address1 AS address, ISNULL(PA1.PartnerID, 0) 
                         AS return_dc, ISNULL(PA.PartnerID, 0) AS brand_id, ISNULL(rh.return_statuses, '[]') AS return_statuses
FROM            return_header AS rh INNER JOIN
                         --return_detail AS rd ON rd.return_header_id = rh.return_header_id INNER JOIN
                         customer_info AS CI ON CI.id = rh.customer_id INNER JOIN
                         Partners AS PA ON PA.PartnerID = rh.brand_id LEFT OUTER JOIN
                         Partners AS PA1 ON PA1.PartnerCode = JSON_VALUE(rh.extra, '$.return_DC') INNER JOIN
                         TypeLookUp AS tl ON tl.TypeLookUpID = rh.status_id
WHERE        (tl.TypeCode <> 'SRO005')
GROUP BY rh.return_number, rh.order_number, rh.created_date, PA.PartnerName, PA1.PartnerName, CI.name, CI.email, CI.phone, CI.address1, PA1.PartnerID, PA.PartnerID, rh.return_qty, rh.return_statuses
GO
/****** Object:  View [dbo].[vw_r3_report]    Script Date: 25-05-2020 09:05:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[vw_r3_report]
AS
SELECT        rh.order_number, rh.return_number, rh.created_date, PA.PartnerName AS BrandName, PA1.PartnerName, rd.EAN, rd.original_qty, rd.return_qty, RAC.display_name RMAActionName, tl.TypeName, ISNULL(PA1.PartnerID, 0) AS return_dc, 
                         ISNULL(PA.PartnerID, 0) AS brand_id, ISNULL(rd.status_id, 0) AS status_id, rd.product_name AS description, rh.return_statuses
FROM            return_header AS rh INNER JOIN
                         return_detail AS rd ON rd.return_header_id = rh.return_header_id INNER JOIN
                         customer_info AS CI ON CI.id = rh.customer_id LEFT OUTER JOIN
                         Partners AS PA ON PA.PartnerID = rh.brand_id LEFT OUTER JOIN
                         Partners AS PA1 ON PA1.PartnerCode = JSON_VALUE(rh.extra, '$.return_DC') INNER JOIN
                         TypeLookUp AS tl ON tl.TypeLookUpID = rh.status_id LEFT OUTER JOIN
                         RMAActionCode AS RAC ON RAC.RMAActionCodeID = rd.return_reason_id
GO
/****** Object:  View [dbo].[vw_rls_report]    Script Date: 25-05-2020 09:05:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[vw_rls_report]
AS
SELECT        rh.order_number, rh.return_number, rh.created_date, rh.return_qty AS return_Qty, PA.PartnerName AS BrandName, PA1.PartnerName, CI.name, CI.email, CI.phone, CI.address1 AS address, ISNULL(PA1.PartnerID, 0) 
                         AS return_dc, ISNULL(PA.PartnerID, 0) AS brand_id, ISNULL(rh.return_statuses, '[]') AS return_statuses
FROM            return_header AS rh INNER JOIN
                         --return_detail AS rd ON rd.return_header_id = rh.return_header_id INNER JOIN
                         customer_info AS CI ON CI.id = rh.customer_id LEFT OUTER JOIN
                         Partners AS PA ON PA.PartnerID = rh.brand_id LEFT OUTER JOIN
                         Partners AS PA1 ON PA1.PartnerCode = JSON_VALUE(rh.extra, '$.return_DC')
GROUP BY rh.return_number, rh.order_number, rh.created_date, PA.PartnerName, PA1.PartnerName, rh.extra, CI.name, CI.email, CI.phone, CI.address1, PA1.PartnerID, PA.PartnerID, rh.return_qty, rh.return_statuses
GO
/****** Object:  View [dbo].[vw_rp_report]    Script Date: 25-05-2020 09:05:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[vw_rp_report]
AS
SELECT        rh.order_number, rh.return_number, rh.created_date, PA.PartnerName AS BrandName, PA1.PartnerName, rd.product_name, rd.EAN, rd.original_qty, rd.return_qty, RAC.RMAActionName, tl.TypeName, ISNULL(rd.status_id, 0) 
                         AS status_id, ISNULL(PA.PartnerID, 0) AS brand_id, ISNULL(PA1.PartnerID, 0) AS return_dc
FROM            return_header AS rh INNER JOIN
                         return_detail AS rd ON rd.return_header_id = rh.return_header_id INNER JOIN
                         customer_info AS CI ON CI.id = rh.customer_id LEFT OUTER JOIN
                         Partners AS PA ON PA.PartnerID = rh.brand_id LEFT OUTER JOIN
                         Partners AS PA1 ON PA1.PartnerCode = JSON_VALUE(rh.extra, '$.return_DC') INNER JOIN
                         TypeLookUp AS tl ON tl.TypeLookUpID = rh.status_id LEFT OUTER JOIN
                         RMAActionCode AS RAC ON RAC.RMAActionCodeID = rd.return_reason_id
GO
/****** Object:  View [dbo].[vw_scp_report]    Script Date: 25-05-2020 09:05:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[vw_scp_report]
AS
SELECT        rh.order_number, rh.return_number, rh.created_date, rh.return_qty AS return_Qty, PA.PartnerName AS BrandName, PA1.PartnerName, CI.name, CI.email, CI.phone, CI.address1 AS address, 
ISNULL(rh.return_statuses, '[]') AS return_statuses, ISNULL(PA.PartnerID, 0) AS brand_id, ISNULL(PA1.PartnerID, 0) AS return_dc
FROM            return_header AS rh INNER JOIN
                         return_detail AS rd ON rd.return_header_id = rh.return_header_id INNER JOIN
                         customer_info AS CI ON CI.id = rh.customer_id LEFT OUTER JOIN
                         Partners AS PA ON PA.PartnerID = rh.brand_id LEFT OUTER JOIN
                         Partners AS PA1 ON PA1.PartnerCode = JSON_VALUE(rh.extra, '$.return_DC') INNER JOIN
                         TypeLookUp AS tl ON tl.TypeLookUpID = rh.status_id
GROUP BY rh.return_number, rh.order_number, rh.created_date, PA.PartnerName, PA1.PartnerName, CI.name, CI.email, CI.phone, CI.address1, rh.return_qty, rh.return_statuses, PA.PartnerID, PA1.PartnerID
GO
/****** Object:  View [dbo].[vw_tat_report]    Script Date: 25-05-2020 09:05:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[vw_tat_report]
AS
SELECT      DISTINCT  rh.order_number, rh.return_number, rh.created_date, rh.return_qty AS return_Qty, PA.PartnerName AS BrandName, PA1.PartnerName, CI.name, CI.email, CI.phone, CI.address1 AS address, ISNULL(DATEDIFF(day, 
                         rh.created_date, rh.modified_date + 1), 0) AS TAT, ISNULL(rh.return_statuses, '[]') AS return_statuses, ISNULL(PA.PartnerID, 0) AS brand_id, ISNULL(PA1.PartnerID, 0) AS return_dc
FROM            return_header AS rh INNER JOIN
                         --return_detail AS rd ON rd.return_header_id = rh.return_header_id INNER JOIN
                         customer_info AS CI ON CI.id = rh.customer_id LEFT OUTER JOIN
                         Partners AS PA ON PA.PartnerID = rh.brand_id LEFT OUTER JOIN
                         Partners AS PA1 ON PA1.PartnerCode = JSON_VALUE(rh.extra, '$.return_DC')
GROUP BY rh.return_number, rh.order_number, rh.created_date, PA.PartnerName, PA1.PartnerName, rh.extra, CI.name, rh.return_qty, rh.return_statuses, CI.email, CI.phone, CI.address1, rh.modified_date, PA.PartnerID, PA1.PartnerID
GO
/****** Object:  View [dbo].[vw_udp_report]    Script Date: 25-05-2020 09:05:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[vw_udp_report]
AS
SELECT        return_number, created_date, expected_date, Overdue_days, tracking_no, BrandName, PartnerName, lead_time, name, email, phone, address, return_dc, brand_id, return_statuses
FROM            (SELECT        rh.return_number, rh.created_date, DATEADD(day, CAST(JSON_VALUE(rh.extra, '$.lead_time') AS int), rh.created_date) AS expected_date, DATEDIFF(d, DATEADD(day, CAST(JSON_VALUE(rh.extra, '$.lead_time') 
                                                    AS int), rh.created_date), GETDATE()) AS Overdue_days, rp.tracking_no, PA.PartnerName AS BrandName, PA1.PartnerName, JSON_VALUE(rh.extra, '$.lead_time') AS lead_time, CI.name, CI.email, CI.phone, 
                                                    CI.address1 AS address, ISNULL(PA1.PartnerID, 0) AS return_dc, ISNULL(PA.PartnerID, 0) AS brand_id, ISNULL(rh.return_statuses, '[]') AS return_statuses
                          FROM            dbo.return_header AS rh INNER JOIN
                                                    dbo.return_parcel AS rp ON rh.return_header_id = rp.return_header_id INNER JOIN
                                                    dbo.customer_info AS CI ON CI.id = rh.customer_id INNER JOIN
                                                    dbo.Partners AS PA ON PA.PartnerID = rh.brand_id LEFT OUTER JOIN
                                                    dbo.Partners AS PA1 ON PA1.PartnerCode = JSON_VALUE(rh.extra, '$.return_DC') INNER JOIN
                                                    dbo.TypeLookUp AS tl ON tl.TypeLookUpID = rh.status_id
                          WHERE        (rp.received = 0)) AS A
WHERE        (DATEDIFF(d, expected_date, GETDATE()) > 0) AND (lead_time <> '')
GROUP BY return_number, created_date, expected_date, BrandName, PartnerName, name, email, phone, address, lead_time, Overdue_days, tracking_no, brand_id, return_dc, return_statuses
GO
