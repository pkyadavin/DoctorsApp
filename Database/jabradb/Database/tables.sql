/****** Object:  Table [dbo].[AccountBillTo]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AccountBillTo](
	[AccountBillToID] [int] IDENTITY(1,1) NOT NULL,
	[AccountNo] [nvarchar](50) NULL,
	[AccountName] [nvarchar](150) NULL,
	[RegionalOffice] [nvarchar](50) NULL,
	[Address1] [nvarchar](150) NULL,
	[Address2] [nvarchar](150) NULL,
	[City] [int] NULL,
	[State] [int] NULL,
	[Country] [int] NULL,
	[PostalCode] [nvarchar](10) NULL,
	[ServiceType] [nvarchar](20) NULL,
	[StoreShipToID] [int] NULL,
	[IsActive] [bit] NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[ModifiedDate] [datetime] NULL,
	[LanguageId] [int] NULL,
	[EmailAddress] [nvarchar](150) NULL,
	[Lastname] [nvarchar](50) NULL,
	[FirstName] [nvarchar](250) NULL,
	[PhoneNumber] [nvarchar](50) NULL,
 CONSTRAINT [PK_AccountBillTo] PRIMARY KEY CLUSTERED 
(
	[AccountBillToID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AccountStoreMap]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AccountStoreMap](
	[MapId] [int] IDENTITY(1,1) NOT NULL,
	[AccountBillToID] [int] NULL,
	[StoreShipToID] [int] NULL,
	[IsActive] [bit] NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[ModifiedDate] [datetime] NULL,
	[AccountNo] [nvarchar](50) NULL,
	[ShipToNo] [nvarchar](50) NULL,
 CONSTRAINT [PK_AccountStoreMap] PRIMARY KEY CLUSTERED 
(
	[MapId] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Address]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Address](
	[AddressID] [int] IDENTITY(1,1) NOT NULL,
	[Address1] [nvarchar](500) NULL,
	[Address2] [nvarchar](500) NULL,
	[City] [nvarchar](500) NULL,
	[StateID] [int] NULL,
	[ZipCode] [nvarchar](20) NULL,
	[FixedLineNumber] [varchar](100) NULL,
	[CellNumber] [varchar](100) NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifyBy] [int] NULL,
	[ModifyDate] [datetime] NULL,
	[IsActive] [bit] NULL,
	[CountryID] [int] NULL,
 CONSTRAINT [PK_Address_AddressID] PRIMARY KEY CLUSTERED 
(
	[AddressID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AreaCode]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AreaCode](
	[AreaCodeID] [int] IDENTITY(1,1) NOT NULL,
	[Code] [nvarchar](50) NULL,
	[StateID] [int] NULL,
	[IsActive] [bit] NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifyBy] [int] NULL,
	[ModifyDate] [datetime] NULL,
	[CityID] [int] NULL,
 CONSTRAINT [PK_AreaCode_AreaCodeID] PRIMARY KEY CLUSTERED 
(
	[AreaCodeID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[brand_language_map]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[brand_language_map](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[BrandID] [int] NOT NULL,
	[LanguageID] [int] NOT NULL,
 CONSTRAINT [PK_brand_language_map] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Case_Creation]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Case_Creation](
	[CaseID] [bigint] IDENTITY(1,1) NOT NULL,
	[CaseNo] [nvarchar](50) NULL,
	[OrderID] [int] NULL,
	[OrderNo] [nvarchar](50) NULL,
	[IssueId] [int] NULL,
	[RootCauseId] [int] NULL,
	[LocationId] [int] NULL,
	[ReferenceNo] [nvarchar](50) NULL,
	[Quantity] [int] NULL,
	[PersonalInfoAccountID] [int] NULL,
	[PersonalInfoAccountNo] [nvarchar](50) NULL,
	[PersonalFirstName] [nvarchar](50) NULL,
	[PersonalLastName] [nvarchar](50) NULL,
	[PersonalPhoneNo] [nvarchar](13) NULL,
	[PersonalEmail] [nvarchar](50) NULL,
	[ShipToId] [int] NULL,
	[ShipToNo] [nvarchar](50) NULL,
	[CaseStatus] [int] NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[ModifiedDate] [datetime] NULL,
 CONSTRAINT [PK_Case_Creation] PRIMARY KEY CLUSTERED 
(
	[CaseID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[case_detail]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[case_detail](
	[casedetailid] [int] IDENTITY(1,1) NOT NULL,
	[internal_code] [nvarchar](50) NULL,
	[case_header_id] [int] NULL,
	[product_number] [nvarchar](200) NULL,
	[category_code_id] [nvarchar](200) NULL,
	[grade_code_id] [nvarchar](200) NULL,
	[subcategory_code_id] [nvarchar](200) NULL,
	[sex_code] [nvarchar](200) NULL,
	[hstariff_id] [nvarchar](200) NULL,
	[product_sku] [nvarchar](200) NULL,
	[product_qty] [nvarchar](200) NULL,
	[product_weight] [nvarchar](200) NULL,
	[size_code_id] [nvarchar](200) NULL,
	[base_color] [nvarchar](200) NULL,
	[hex_value] [nvarchar](200) NULL,
	[comment] [nvarchar](500) NULL,
	[inbound_tracking_number] [nvarchar](500) NULL,
	[inbound_label_url] [nvarchar](max) NULL,
	[outbound_tracking_number] [nvarchar](500) NULL,
	[outbound_label_url] [nvarchar](max) NULL,
	[status_id] [int] NULL,
	[is_sku_validated] [bit] NULL,
	[assigned_to] [int] NULL,
	[needs_washing] [bit] NULL,
	[in_warranty] [bit] NULL,
	[recommended_resolution_id] [int] NULL,
	[recommended_repair_action_id] [int] NULL,
	[recommended_repair_material_id] [int] NULL,
	[product_location] [varchar](100) NULL,
	[repair_center_id] [int] NULL,
	[case_validation_id] [int] NULL,
	[case_ra_number] [varchar](50) NULL,
	[is_remote_resolvable] [bit] NULL,
	[remote_resolution] [bit] NULL,
	[remote_resolution_comment] [varchar](500) NULL,
	[is_non_remote_resolvable] [bit] NULL,
	[created_by] [bigint] NOT NULL,
	[created_date] [datetime] NULL,
	[updated_by] [bigint] NULL,
	[updated_date] [datetime] NULL,
	[customer_reference] [varchar](200) NULL,
 CONSTRAINT [PK_case_detail] PRIMARY KEY CLUSTERED 
(
	[casedetailid] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[case_header]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[case_header](
	[caseid] [int] IDENTITY(1,1) NOT NULL,
	[internal_code] [nvarchar](50) NOT NULL,
	[case_number] [nvarchar](50) NOT NULL,
	[po_wo_order_number] [nvarchar](50) NULL,
	[status_id] [int] NOT NULL,
	[customer_id] [int] NULL,
	[customer_bill_to_address_id] [int] NULL,
	[customer_return_address_id] [int] NULL,
	[comment] [nvarchar](500) NULL,
	[created_by] [bigint] NOT NULL,
	[created_date] [datetime] NULL,
	[updated_by] [bigint] NULL,
	[updated_date] [datetime] NULL,
	[PreferedServiceLanguageID] [int] NULL,
 CONSTRAINT [PK_case_header] PRIMARY KEY CLUSTERED 
(
	[caseid] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CaseCreation]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CaseCreation](
	[CaseID] [bigint] IDENTITY(1,1) NOT NULL,
	[PoWoNo] [nvarchar](50) NULL,
	[Upload] [nvarchar](200) NULL,
	[PersonalMail] [nvarchar](100) NULL,
	[PersonalFirstName] [nvarchar](50) NULL,
	[PersonalLastName] [nvarchar](50) NULL,
	[PersonalPhoneNo] [nvarchar](13) NULL,
	[ShipAddress1] [nvarchar](200) NULL,
	[ShipAddress2] [nvarchar](200) NULL,
	[ShipCountry] [int] NULL,
	[ShipState] [int] NULL,
	[ShipCity] [int] NULL,
	[ShipZip] [nchar](10) NULL,
	[ServiceLanguage] [int] NULL,
	[ProModel] [nvarchar](50) NULL,
	[ProPoWo] [nvarchar](50) NULL,
	[ProColor] [int] NULL,
	[ProSize] [int] NULL,
	[ProIssue] [int] NULL,
	[ProUpload] [nvarchar](200) NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[ModifiedDate] [datetime] NULL,
	[CaseNo] [nvarchar](50) NULL,
	[caseStatus] [int] NULL,
 CONSTRAINT [PK_CaseCreation] PRIMARY KEY CLUSTERED 
(
	[CaseID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CaseDetailIssueMap]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CaseDetailIssueMap](
	[CasedetailissuemapID] [int] IDENTITY(1,1) NOT NULL,
	[CaseDetailID] [int] NULL,
	[ParentIssueID] [int] NULL,
	[IssueID] [int] NULL,
	[RootcauseID] [int] NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[ModifiedDate] [datetime] NULL,
 CONSTRAINT [PK_CasedetailissueMap] PRIMARY KEY CLUSTERED 
(
	[CasedetailissuemapID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CaseDetailLocationMap]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CaseDetailLocationMap](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[CaseDetailID] [int] NULL,
	[LocationID] [int] NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[ModifiedDate] [datetime] NULL,
 CONSTRAINT [PK_CaseDetailLocation] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Category]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Category](
	[CatID] [int] IDENTITY(1,1) NOT NULL,
	[CatCd] [varchar](10) NOT NULL,
	[Description] [nvarchar](150) NULL,
	[IsActive] [bit] NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[ModifiedDate] [datetime] NULL,
 CONSTRAINT [PK_CategoryMaster] PRIMARY KEY CLUSTERED 
(
	[CatID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CategoryReturnReason]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CategoryReturnReason](
	[CategoryReturnReasonMapId] [int] IDENTITY(1,1) NOT NULL,
	[CategoryId] [int] NOT NULL,
	[RMAActionCodeId] [int] NULL,
	[IsActive] [bit] NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[ModifiedDate] [datetime] NULL,
	[OnCP] [bit] NULL,
	[OnBo] [bit] NULL,
	[FileRequired] [bit] NULL,
	[CommentRequired] [bit] NULL,
	[ApprovalRequired] [bit] NULL,
 CONSTRAINT [PK_CategoryReturnReason] PRIMARY KEY CLUSTERED 
(
	[CategoryReturnReasonMapId] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CategoryReturnReason1]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CategoryReturnReason1](
	[CategoryReturnReason1MapId] [int] IDENTITY(1,1) NOT NULL,
	[CategoryId] [int] NOT NULL,
	[RMAActionCodeId] [int] NULL,
	[IsActive] [bit] NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[ModifiedDate] [datetime] NULL,
	[OnCP] [bit] NULL,
	[OnBo] [bit] NULL,
	[FileRequired] [bit] NULL,
	[CommentRequired] [bit] NULL,
	[ApprovalRequired] [bit] NULL,
 CONSTRAINT [PK_CategoryReturnReason1] PRIMARY KEY CLUSTERED 
(
	[CategoryReturnReason1MapId] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[City]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[City](
	[CityID] [int] IDENTITY(1,1) NOT NULL,
	[CityCode] [nvarchar](10) NOT NULL,
	[CityName] [nvarchar](100) NULL,
	[Description] [nvarchar](100) NOT NULL,
	[StateID] [int] NOT NULL,
	[CountryID] [int] NULL,
	[IsActive] [bit] NULL,
 CONSTRAINT [PK_city] PRIMARY KEY CLUSTERED 
(
	[CityID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Color]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Color](
	[ColorID] [int] IDENTITY(1,1) NOT NULL,
	[ColorName] [nvarchar](50) NOT NULL,
	[IsActive] [bit] NOT NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifyBy] [int] NULL,
	[ModifyDate] [datetime] NULL,
	[ColorCode] [nvarchar](50) NOT NULL,
	[Description] [nvarchar](max) NULL,
 CONSTRAINT [PK_Color] PRIMARY KEY CLUSTERED 
(
	[ColorID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ConfigSetup]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ConfigSetup](
	[ConfigSetupID] [int] IDENTITY(1,1) NOT NULL,
	[Code] [nvarchar](50) NULL,
	[Name] [nvarchar](100) NOT NULL,
	[Value] [nvarchar](max) NOT NULL,
	[Remarks] [nvarchar](500) NULL,
	[IsActive] [bit] NOT NULL,
	[CreatedBy] [int] NOT NULL,
	[CreatedDate] [datetime] NOT NULL,
	[ModifyBy] [int] NOT NULL,
	[ModifyDate] [datetime] NOT NULL,
	[ConfigGroup] [nvarchar](200) NULL,
	[configtype] [varchar](20) NULL,
	[ValueType] [varchar](20) NULL,
	[ImagePath] [nvarchar](2000) NULL,
 CONSTRAINT [PK_ConfigSetup] PRIMARY KEY CLUSTERED 
(
	[ConfigSetupID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [IX_ConfigSetup_Code_Name] UNIQUE NONCLUSTERED 
(
	[Code] ASC,
	[Name] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[consumer_return_detail]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[consumer_return_detail](
	[request_detail_id] [bigint] IDENTITY(1,1) NOT NULL,
	[request_header_id] [bigint] NOT NULL,
	[status_id] [int] NOT NULL,
	[internal_ref_number] [nvarchar](100) NOT NULL,
	[product_id] [int] NOT NULL,
	[serial_number] [nvarchar](50) NULL,
	[return_reason_id] [int] NULL,
	[rma_request_type_id] [int] NOT NULL,
	[color_id] [int] NOT NULL,
	[product_warranty_id] [int] NULL,
	[date_code_value] [nvarchar](50) NULL,
	[files] [nvarchar](max) NULL,
	[labels] [nvarchar](max) NULL,
	[extra] [nvarchar](max) NULL,
	[remarks] [nvarchar](max) NULL,
	[isauthorized] [bit] NULL,
	[authorized_date] [datetime] NULL,
	[authorized_by] [int] NULL,
	[authorized_reason_id] [int] NULL,
	[authorized_comment] [nvarchar](500) NULL,
	[authorized_approve_date_code] [nvarchar](50) NULL,
	[modify_by] [int] NULL,
	[modified_date] [datetime] NULL,
	[is_eol] [bit] NULL,
	[customer_ref_field] [nvarchar](max) NULL,
 CONSTRAINT [PK_consumer_return_detail] PRIMARY KEY CLUSTERED 
(
	[request_detail_id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[consumer_return_header]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[consumer_return_header](
	[request_header_id] [bigint] IDENTITY(1,1) NOT NULL,
	[internal_ref_number] [nvarchar](100) NOT NULL,
	[happy_fox_id] [nvarchar](50) NOT NULL,
	[return_ref_number] [nvarchar](50) NOT NULL,
	[rma_number] [nvarchar](50) NULL,
	[rma_date] [datetime] NULL,
	[status_id] [int] NOT NULL,
	[delivery_info] [nvarchar](max) NOT NULL,
	[delivery_address] [nvarchar](max) NOT NULL,
	[brand] [nvarchar](50) NOT NULL,
	[labels] [nvarchar](max) NULL,
	[files] [nvarchar](max) NULL,
	[source] [nvarchar](50) NOT NULL,
	[extra] [nvarchar](max) NULL,
	[remarks] [nvarchar](max) NULL,
	[created_date] [datetime] NOT NULL,
	[modify_by] [int] NULL,
	[modified_date] [datetime] NULL,
	[is_updated_customer] [bit] NULL,
	[primary_email] [nvarchar](max) NULL,
	[secondary_email] [nvarchar](max) NULL,
	[add_your_own_ref] [nvarchar](max) NULL,
 CONSTRAINT [PK_consumer_return_header] PRIMARY KEY CLUSTERED 
(
	[request_header_id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Country]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Country](
	[CountryID] [int] IDENTITY(1,1) NOT NULL,
	[CountryCode] [varchar](100) NULL,
	[CountryName] [nvarchar](100) NULL,
	[RegionName] [nvarchar](100) NULL,
	[CurrencyCode] [varchar](100) NULL,
	[CurrencySymbol] [nvarchar](5) NULL,
	[DollarExchangeRate] [decimal](18, 2) NULL,
	[TeleCode] [nvarchar](50) NULL,
	[IsActive] [bit] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifyDate] [datetime] NULL,
	[RegionID] [int] NULL,
	[CreatedBy] [int] NULL,
	[ModifyBy] [int] NULL,
	[ReturnWindow] [int] NULL,
	[HomePage] [nvarchar](1000) NULL,
	[ReturnPolicy] [nvarchar](1000) NULL,
	[ContactPage] [nvarchar](1000) NULL,
	[customRequired] [bit] NULL,
	[Description] [varchar](max) NULL,
	[Tax] [int] NULL,
 CONSTRAINT [PK__Country__10D160BFF51530D6] PRIMARY KEY CLUSTERED 
(
	[CountryID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Country_ServiceType_LabelType_configuration]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Country_ServiceType_LabelType_configuration](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[country_ID] [int] NOT NULL,
	[partner_serviceType] [nvarchar](500) NULL,
	[partner_labelType] [nvarchar](500) NULL,
	[partner_Cycleon] [bit] NULL,
	[enduser_serviceType] [nvarchar](500) NULL,
	[enduser_labelType] [nvarchar](500) NULL,
	[enderuser_Cycleon] [bit] NULL,
	[configured_by] [int] NOT NULL,
	[configured_date] [datetime] NOT NULL,
 CONSTRAINT [PK_Country_ServiceType_LabelType_configuration] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CountryConfigMap]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CountryConfigMap](
	[CountryConfigMapID] [int] IDENTITY(1,1) NOT NULL,
	[CountryID] [int] NULL,
	[TypeLookupID] [int] NULL,
	[ConfigGroup] [nvarchar](100) NULL,
	[Description] [nvarchar](max) NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifyBy] [int] NULL,
	[ModifyDate] [datetime] NULL,
 CONSTRAINT [PK_CountryConfigMap_CountryConfigMapID] PRIMARY KEY CLUSTERED 
(
	[CountryConfigMapID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Currency]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Currency](
	[CurrencyID] [int] IDENTITY(1,1) NOT NULL,
	[CurrencyCode] [nvarchar](10) NOT NULL,
	[CurrencyName] [nvarchar](50) NOT NULL,
	[CurrencySymbol] [nvarchar](50) NULL,
	[Country] [nvarchar](50) NULL,
	[CreatedBy] [int] NOT NULL,
	[CreatedDate] [datetime] NOT NULL,
	[ModifyBy] [int] NOT NULL,
	[ModifyDate] [datetime] NOT NULL,
 CONSTRAINT [PK_Currency] PRIMARY KEY CLUSTERED 
(
	[CurrencyID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[customer_info]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[customer_info](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](500) NULL,
	[email] [nvarchar](500) NULL,
	[phone] [nvarchar](50) NULL,
	[address1] [nvarchar](500) NULL,
	[address2] [nvarchar](500) NULL,
	[address3] [nvarchar](500) NULL,
	[city] [nvarchar](100) NULL,
	[state] [nvarchar](100) NULL,
	[postal_code] [nvarchar](100) NULL,
	[country] [nvarchar](100) NULL,
	[cif_number] [nvarchar](100) NULL,
	[countryId] [int] NULL,
	[title] [nvarchar](10) NULL,
	[firstname] [nvarchar](50) NULL,
	[lastname] [nvarchar](50) NULL,
	[customer_type] [nvarchar](50) NULL,
	[shipping_discount] [float] NULL,
	[secondary_email] [nvarchar](200) NULL,
	[building] [nvarchar](200) NULL,
	[Company] [nvarchar](200) NULL,
	[complete_address]  AS ((((((((((((((isnull([Company],'')+', ')+isnull([building],''))+', ')+isnull([address1],''))+', ')+isnull([address2],''))+', ')+isnull([city],''))+', ')+isnull([state],''))+', ')+isnull([Country],''))+', ')+isnull([postal_code],'')),
 CONSTRAINT [PK_customer_info_id] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[customer_info_stage]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[customer_info_stage](
	[id] [bigint] NOT NULL,
	[name] [nvarchar](500) NULL,
	[email] [nvarchar](500) NULL,
	[phone] [nvarchar](50) NULL,
	[address1] [nvarchar](500) NULL,
	[address2] [nvarchar](500) NULL,
	[address3] [nvarchar](500) NULL,
	[city] [nvarchar](100) NULL,
	[state] [nvarchar](100) NULL,
	[postal_code] [nvarchar](100) NULL,
	[country] [nvarchar](100) NULL,
	[cif_number] [nvarchar](100) NULL,
	[countryId] [int] NULL,
	[title] [nvarchar](10) NULL,
	[firstname] [nvarchar](50) NULL,
	[lastname] [nvarchar](50) NULL,
	[customer_type] [nvarchar](50) NULL,
	[shipping_discount] [float] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[DashBoardMaster]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DashBoardMaster](
	[DashBoardMasterID] [int] IDENTITY(1,1) NOT NULL,
	[DashBoardCode] [nvarchar](500) NOT NULL,
	[DashBoardDescription] [nvarchar](500) NOT NULL,
	[USP_Name] [nvarchar](200) NOT NULL,
	[IsActive] [bit] NOT NULL,
	[CreatedBy] [int] NOT NULL,
	[CreatedDate] [datetime] NOT NULL,
	[ModifyBy] [int] NOT NULL,
	[ModifyDate] [datetime] NOT NULL,
	[ListType] [nvarchar](50) NULL,
 CONSTRAINT [PK_DashBoardMaster] PRIMARY KEY CLUSTERED 
(
	[DashBoardMasterID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[email_log]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[email_log](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Brand] [nvarchar](50) NOT NULL,
	[Event] [nvarchar](100) NOT NULL,
	[TO_Address] [nvarchar](max) NOT NULL,
	[CC_Address] [nvarchar](max) NULL,
	[BCC_Address] [nvarchar](max) NULL,
	[Subject] [nvarchar](max) NOT NULL,
	[Body] [nvarchar](max) NOT NULL,
	[IsDispatched] [bit] NOT NULL,
	[CreatedDate] [datetime] NOT NULL,
	[DispatchDate] [datetime] NULL,
	[Error] [nvarchar](max) NULL,
 CONSTRAINT [PK_email_log] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[email_log_stage]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[email_log_stage](
	[ID] [int] NOT NULL,
	[Brand] [nvarchar](50) NOT NULL,
	[Event] [nvarchar](100) NOT NULL,
	[TO_Address] [nvarchar](max) NOT NULL,
	[CC_Address] [nvarchar](max) NULL,
	[BCC_Address] [nvarchar](max) NULL,
	[Subject] [nvarchar](max) NOT NULL,
	[Body] [nvarchar](max) NOT NULL,
	[IsDispatched] [bit] NOT NULL,
	[CreatedDate] [datetime] NOT NULL,
	[DispatchDate] [datetime] NULL,
	[Error] [nvarchar](max) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EmailLog]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EmailLog](
	[EmailLogID] [int] IDENTITY(1,1) NOT NULL,
	[EmailType] [varchar](100) NULL,
	[Subject] [nvarchar](500) NULL,
	[Body] [nvarchar](max) NULL,
	[ToAddress] [nvarchar](4000) NULL,
	[CCAddress] [nvarchar](4000) NULL,
	[BCCAddress] [nvarchar](4000) NULL,
	[IsPending] [bit] NULL,
	[ErrorMessage] [nvarchar](1000) NULL,
	[CreatedAt] [datetime] NULL,
	[Attachment] [varbinary](max) NULL,
	[Name] [nvarchar](1000) NULL,
	[AzureQueueId] [nvarchar](500) NULL,
	[PopReceipt] [nvarchar](500) NULL,
	[InstanceId] [nvarchar](500) NULL,
	[IsQueued] [bit] NULL,
	[BlobUri] [nvarchar](2000) NULL,
	[BlobFileUri] [nvarchar](2000) NULL,
 CONSTRAINT [PK_EmailLog_EmailLogID] PRIMARY KEY CLUSTERED 
(
	[EmailLogID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ErrorLog]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ErrorLog](
	[ErrorLogID] [int] IDENTITY(1,1) NOT NULL,
	[Error_Msg] [nvarchar](max) NULL,
	[Error_Details] [nvarchar](max) NULL,
	[Request] [nvarchar](4000) NULL,
	[SqlQuery] [nvarchar](max) NULL,
	[Reserved2] [nvarchar](800) NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
 CONSTRAINT [PK_ErrorLog_ErrorLogID] PRIMARY KEY CLUSTERED 
(
	[ErrorLogID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Facility]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Facility](
	[FacilityID] [int] IDENTITY(1,1) NOT NULL,
	[FacilityCode] [nvarchar](20) NULL,
	[FacilityName] [nvarchar](100) NULL,
	[FacilityTypeID] [int] NULL,
	[IsActive] [bit] NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifyBy] [int] NULL,
	[ModifyDate] [datetime] NULL,
 CONSTRAINT [PK_Facility_FacilityID] PRIMARY KEY CLUSTERED 
(
	[FacilityID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[FormField]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FormField](
	[FormFieldID] [int] IDENTITY(1,1) NOT NULL,
	[FormName] [nvarchar](100) NULL,
	[TableName] [nvarchar](50) NULL,
	[DBFieldName] [nvarchar](100) NULL,
	[FieldType] [nvarchar](1000) NULL,
	[isRequired] [bit] NULL,
	[isVisible] [bit] NULL,
	[isEnabled] [bit] NULL,
	[ShowinGrid] [bit] NULL,
	[FeatureCodes] [nvarchar](50) NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifyBy] [int] NULL,
	[ModifyDate] [datetime] NULL,
	[SortOrder] [int] NULL,
	[ColumnAlias] [varchar](100) NULL,
	[GridWidth] [int] NULL,
	[Remarks] [nvarchar](200) NULL,
 CONSTRAINT [PK_FormField_FormFieldID] PRIMARY KEY CLUSTERED 
(
	[FormFieldID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[FormFieldLanguageMap]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FormFieldLanguageMap](
	[FormFieldLanguageMapID] [int] IDENTITY(1,1) NOT NULL,
	[FormFieldID] [int] NULL,
	[LanguageID] [int] NULL,
	[Value] [nvarchar](100) NULL,
 CONSTRAINT [PK_FormFieldLanguageMap_FormFieldLanguageMapID] PRIMARY KEY CLUSTERED 
(
	[FormFieldLanguageMapID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[fx_rate_currency_conversion]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[fx_rate_currency_conversion](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[fxRate] [decimal](18, 4) NULL,
	[masterCurrencyCode] [char](3) NULL,
	[conversionCurrencyCode] [char](3) NULL,
	[appliedFrom] [datetime] NULL,
	[appliedTo] [datetime] NULL,
	[createdDate] [datetime] NULL,
	[modifiedDate] [datetime] NULL,
	[isActive] [bit] NULL,
 CONSTRAINT [PK_fx_rate_currency_conversion] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ga_request_detail]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ga_request_detail](
	[request_detail_id] [bigint] IDENTITY(1,1) NOT NULL,
	[request_header_id] [bigint] NOT NULL,
	[status_id] [int] NOT NULL,
	[internal_ref_number] [nvarchar](100) NOT NULL,
	[serial_number] [nvarchar](50) NOT NULL,
	[sku] [nvarchar](50) NULL,
	[return_reason_id] [int] NOT NULL,
	[date_of_purchase] [datetime] NULL,
	[files] [nvarchar](max) NULL,
	[labels] [nvarchar](max) NULL,
	[extra] [nvarchar](max) NULL,
	[remarks] [nvarchar](max) NULL,
	[iscancelled] [bit] NULL,
	[cancelled_date] [datetime] NULL,
	[cancelled_by] [nvarchar](100) NULL,
	[cancelled_remarks] [nvarchar](100) NULL,
	[isauthorized] [bit] NULL,
	[authorized_date] [datetime] NULL,
	[authorized_by] [int] NULL,
	[authorized_reason_id] [int] NULL,
	[authorized_comment] [nvarchar](500) NULL,
	[authorized_approve_date_code] [nvarchar](50) NULL,
	[modify_by] [int] NULL,
	[modified_date] [datetime] NULL,
	[warranty_status_id] [int] NULL,
	[warranty_date] [datetime] NULL,
	[is_extended_warranty] [bit] NULL,
	[extended_warranty_date] [datetime] NULL,
	[iseol] [bit] NULL,
 CONSTRAINT [PK_ga_request_detail] PRIMARY KEY CLUSTERED 
(
	[request_detail_id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ga_request_header]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ga_request_header](
	[request_header_id] [bigint] IDENTITY(1,1) NOT NULL,
	[internal_ref_number] [nvarchar](100) NOT NULL,
	[return_ref_number] [nvarchar](50) NOT NULL,
	[rma_number] [nvarchar](50) NULL,
	[rma_date] [datetime] NULL,
	[status_id] [int] NOT NULL,
	[delivery_info] [nvarchar](max) NOT NULL,
	[billing_info] [nvarchar](max) NOT NULL,
	[delivery_address] [nvarchar](max) NOT NULL,
	[billing_address] [nvarchar](max) NOT NULL,
	[brand] [nvarchar](50) NOT NULL,
	[labels] [nvarchar](max) NULL,
	[files] [nvarchar](max) NULL,
	[source] [nvarchar](50) NOT NULL,
	[extra] [nvarchar](max) NULL,
	[remarks] [nvarchar](max) NULL,
	[created_date] [datetime] NOT NULL,
	[modify_by] [int] NULL,
	[modified_date] [datetime] NULL,
 CONSTRAINT [PK_ga_request_header] PRIMARY KEY CLUSTERED 
(
	[request_header_id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Grade]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Grade](
	[GradeId] [int] IDENTITY(1,1) NOT NULL,
	[GradeCd] [nvarchar](10) NOT NULL,
	[Description] [nvarchar](150) NULL,
	[IsActive] [bit] NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[ModifiedDate] [datetime] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Grouping]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Grouping](
	[GroupId] [int] IDENTITY(1,1) NOT NULL,
	[CatId] [int] NULL,
	[CatCd] [nvarchar](10) NULL,
	[SubCatId] [int] NULL,
	[SubCatCd] [nvarchar](10) NULL,
	[GradeId] [int] NULL,
	[GradeCd] [nvarchar](10) NULL,
	[isActive] [bit] NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[ModifiedDate] [datetime] NULL,
 CONSTRAINT [PK_Grouping] PRIMARY KEY CLUSTERED 
(
	[GroupId] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ImageAttachment]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ImageAttachment](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[CaseDetailId] [int] NULL,
	[Name] [nvarchar](200) NULL,
	[Path] [nvarchar](500) NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[ModifiedDate] [datetime] NULL,
 CONSTRAINT [PK_ImageAttachment1] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[inbound_log]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[inbound_log](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[email] [nvarchar](200) NULL,
	[order_number] [nvarchar](200) NOT NULL,
	[shiped_date] [datetime] NULL,
	[delivered_date] [datetime] NULL,
	[customer] [nvarchar](max) NULL,
	[items] [nvarchar](max) NULL,
	[payload] [nvarchar](max) NULL,
	[version] [int] NOT NULL,
 CONSTRAINT [PK_inbound_log_id] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[intake_orders]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[intake_orders](
	[order_Id] [int] IDENTITY(1,1) NOT NULL,
	[order_number] [nvarchar](50) NOT NULL,
	[vendor_number] [nvarchar](200) NULL,
	[req_by_date] [datetime] NULL,
	[price_year] [nvarchar](200) NULL,
	[season_code_id] [nvarchar](200) NULL,
	[product_number] [nvarchar](200) NOT NULL,
	[category_code_id] [nvarchar](200) NOT NULL,
	[grade_code_id] [nvarchar](200) NOT NULL,
	[subcategory_code_id] [nvarchar](200) NOT NULL,
	[sex_code] [nvarchar](200) NULL,
	[hstariff_id] [nvarchar](200) NULL,
	[country_of_origin_id] [nvarchar](200) NULL,
	[prim_season_code] [nvarchar](200) NULL,
	[product_sku] [nvarchar](200) NOT NULL,
	[product_qty] [nvarchar](200) NOT NULL,
	[product_weight] [nvarchar](200) NULL,
	[size_code_id] [nvarchar](200) NOT NULL,
	[sort_order] [nvarchar](200) NOT NULL,
	[color_description] [nvarchar](200) NOT NULL,
	[base_color] [nvarchar](200) NULL,
	[hex_value] [nvarchar](200) NULL,
	[createdby] [int] NOT NULL,
	[created_date] [datetime] NOT NULL,
	[updatedby] [int] NOT NULL,
	[updated_date] [datetime] NOT NULL,
	[IsActive] [bit] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ItemMaster]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ItemMaster](
	[ItemMasterID] [int] IDENTITY(1,1) NOT NULL,
	[ItemNumber] [nvarchar](50) NULL,
	[ArticleNumber] [nvarchar](50) NULL,
	[ItemName] [nvarchar](100) NULL,
	[ItemDescription] [nvarchar](500) NULL,
	[ManufacturerID] [int] NULL,
	[ItemModelID] [int] NULL,
	[ItemDiscountPC] [numeric](18, 0) NULL,
	[EANCode] [nvarchar](50) NULL,
	[SKUCode] [nvarchar](50) NULL,
	[BarCode] [nvarchar](50) NULL,
	[UOMID] [int] NULL,
	[ColorID] [int] NULL,
	[ItemCost] [numeric](18, 0) NULL,
	[ItemPrice] [numeric](18, 0) NULL,
	[IsActive] [bit] NULL,
	[ItemReceiveTypeID] [int] NULL,
	[IsSWAPAllowed] [bit] NULL,
	[IsReplacementAllowed] [bit] NULL,
	[IsApprovalRequired] [bit] NULL,
	[ExtWarrantyDays] [int] NULL,
	[ReturnDays] [int] NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifyBy] [int] NULL,
	[ModifyDate] [datetime] NULL,
	[ItemPriceIW] [numeric](18, 0) NULL,
	[ItemReturnTypeID] [int] NULL,
	[IsExtendedWarrantyAllow] [bit] NULL,
	[ItemLength] [numeric](18, 0) NULL,
	[ProductNo] [int] NULL,
	[ProductDescr] [varchar](120) NULL,
	[SexCd] [varchar](20) NULL,
	[SKU] [int] NULL,
	[Weight] [decimal](16, 4) NULL,
	[CatID] [int] NULL,
	[GradeId] [int] NULL,
	[SubCatID] [int] NULL,
	[ProductSizeID] [int] NULL,
	[ColorsID] [int] NULL,
 CONSTRAINT [PK_ItemMaster_ItemMasterID] PRIMARY KEY CLUSTERED 
(
	[ItemMasterID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ItemModel]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ItemModel](
	[ItemModelID] [int] IDENTITY(1,1) NOT NULL,
	[ModelCode] [nvarchar](50) NULL,
	[ModelName] [nvarchar](50) NULL,
	[Description] [nvarchar](100) NULL,
	[IsActive] [bit] NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[ModifiedDate] [datetime] NULL,
 CONSTRAINT [PK_ItemModel] PRIMARY KEY CLUSTERED 
(
	[ItemModelID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ItemPricelist]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ItemPricelist](
	[ItemPricelistID] [int] IDENTITY(1,1) NOT NULL,
	[ProductNo] [int] NULL,
	[PriceListCd] [varchar](10) NULL,
	[PriceListDescr] [varchar](80) NULL,
	[CrncyCd] [varchar](10) NULL,
	[Price] [decimal](16, 4) NULL,
	[SuggRetail] [decimal](16, 4) NULL,
	[CostPrice] [decimal](16, 4) NULL,
	[ProductDescr] [varchar](120) NULL,
	[CatID] [int] NULL,
	[GradeId] [int] NULL,
	[RegionID] [int] NULL,
	[SeasonID] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[jwtTokenlog]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[jwtTokenlog](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[access_token] [nvarchar](max) NULL,
	[token_type] [nvarchar](1000) NULL,
	[expires_in] [nvarchar](50) NULL,
	[CreatedBy] [int] NULL,
	[CreatedOn] [datetime] NULL,
	[ExpiredOn] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[KeyFieldAutoGenRule]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[KeyFieldAutoGenRule](
	[KeyFieldAutoGenRuleID] [int] IDENTITY(1,1) NOT NULL,
	[RuleCode] [nvarchar](10) NULL,
	[RuleName] [nvarchar](50) NULL,
	[NumberLength] [int] NULL,
	[PrefixLength] [int] NULL,
	[SuffixLength] [int] NULL,
	[Prefix] [nvarchar](500) NULL,
	[Suffix] [nvarchar](50) NULL,
	[Scope] [nvarchar](50) NULL,
	[FeatureCodes] [nvarchar](50) NULL,
	[IsActive] [bit] NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifyBy] [int] NULL,
	[ModifyDate] [datetime] NULL,
 CONSTRAINT [PK_KeyFieldAutoGenRule_KeyFieldAutoGenRuleID] PRIMARY KEY CLUSTERED 
(
	[KeyFieldAutoGenRuleID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Language]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Language](
	[LanguageID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](150) NULL,
	[Code] [nvarchar](20) NULL,
	[IsActive] [bit] NULL,
	[IsDefault] [bit] NULL,
	[CreatedBy] [int] NOT NULL,
	[CreatedDate] [datetime] NOT NULL,
	[ModifyBy] [int] NOT NULL,
	[ModifyDate] [datetime] NOT NULL,
	[MappedLanguageGroupID] [int] NULL,
 CONSTRAINT [PK__LanguageID] PRIMARY KEY CLUSTERED 
(
	[LanguageID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [IX_U_LanguageLanguage] UNIQUE NONCLUSTERED 
(
	[Name] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LanguageForm]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LanguageForm](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](100) NULL,
	[DisplayName] [nvarchar](100) NULL,
	[IsActive] [bit] NULL,
 CONSTRAINT [PK_LanguageForm_ID] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LanguageResource]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LanguageResource](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[LanguageID] [int] NULL,
	[LanugaugeKey] [nvarchar](100) NULL,
	[Value] [nvarchar](max) NULL,
	[FormID] [int] NULL,
	[IsActive] [bit] NULL,
	[CreatedDate] [datetime] NULL,
	[UpdatedDate] [datetime] NULL,
	[CreatedBy] [int] NULL,
	[UpdatedBy] [int] NULL,
 CONSTRAINT [PK_LanguageResource_ID] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Manufacturer]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Manufacturer](
	[ManufacturerID] [int] IDENTITY(1,1) NOT NULL,
	[ManufacturerCode] [nvarchar](10) NOT NULL,
	[ManufacturerName] [nvarchar](100) NOT NULL,
	[GlobalManufacturerName] [nvarchar](100) NULL,
	[IsActive] [bit] NOT NULL,
	[CreatedBy] [int] NOT NULL,
	[CreatedDate] [datetime] NOT NULL,
	[ModifyBy] [int] NOT NULL,
	[ModifyDate] [datetime] NOT NULL,
 CONSTRAINT [PK_Manufacturer] PRIMARY KEY CLUSTERED 
(
	[ManufacturerID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Module]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Module](
	[ModuleID] [int] IDENTITY(1,1) NOT NULL,
	[Module] [varchar](100) NULL,
	[Order] [int] NULL,
	[NavigateURL] [varchar](100) NULL,
	[LabelCode] [varchar](100) NULL,
	[Description] [varchar](100) NULL,
	[ActiveFlag] [bit] NULL,
	[Instructions] [nvarchar](max) NULL,
	[Scope] [nvarchar](15) NULL,
	[FeatureCodes] [nvarchar](50) NULL,
	[CreatedDate] [datetime] NULL,
	[CreatedBy] [int] NULL,
	[UpdatedBy] [int] NULL,
	[UpdatedDate] [datetime] NULL,
	[ParentModuleID] [int] NULL,
	[ChildCount]  AS ([dbo].[udf_childCount]([ModuleID])),
 CONSTRAINT [PK__Module] PRIMARY KEY CLUSTERED 
(
	[ModuleID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ModuleActionConfigValue]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ModuleActionConfigValue](
	[ModuleActionConfigValueID] [int] IDENTITY(1,1) NOT NULL,
	[VersionNumber] [nchar](50) NULL,
	[ModuleConfigID] [int] NULL,
	[ModuleActionID] [int] NULL,
	[ModuleControlTypeValueID] [int] NULL,
	[ModuleControlTypeValue] [nvarchar](100) NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifyBy] [int] NULL,
	[ModifyDate] [datetime] NULL,
 CONSTRAINT [PK_ModuleActionConfigValue_ModuleActionConfigValueID] PRIMARY KEY CLUSTERED 
(
	[ModuleActionConfigValueID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ModuleActionMap]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ModuleActionMap](
	[ModuleActionMapID] [int] IDENTITY(1,1) NOT NULL,
	[ModuleID] [int] NULL,
	[ActionID] [int] NULL,
	[ModuleFunctionID] [int] NULL,
	[SortOrder] [int] NULL,
	[IsActive] [bit] NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifyBy] [int] NULL,
	[ModifyDate] [datetime] NULL,
 CONSTRAINT [PK_ModuleActionMap_ModuleActionMapID] PRIMARY KEY CLUSTERED 
(
	[ModuleActionMapID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ModuleConfig]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ModuleConfig](
	[ModuleConfigID] [int] IDENTITY(1,1) NOT NULL,
	[ModuleID] [int] NULL,
	[TypeLookUpID] [int] NULL,
	[GroupName] [nvarchar](50) NULL,
	[Code] [nvarchar](20) NULL,
	[Description] [nvarchar](500) NULL,
	[ModuleControlTypeID] [int] NULL,
	[Notes] [nvarchar](1000) NULL,
	[IsForModule] [bit] NULL,
	[IsForAccount] [bit] NULL,
	[IsForItemMaster] [bit] NULL,
	[ParentModuleConfigID] [int] NULL,
	[IsActive] [bit] NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifyBy] [int] NULL,
	[ModifyDate] [datetime] NULL,
	[SOrtOrder] [int] NULL,
 CONSTRAINT [PK_ModuleConfig_ModuleConfigID] PRIMARY KEY CLUSTERED 
(
	[ModuleConfigID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ModuleControlType]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ModuleControlType](
	[ModuleControlTypeID] [int] IDENTITY(1,1) NOT NULL,
	[ModuleControlType] [nvarchar](50) NULL,
	[ModuleControlTypeName] [nvarchar](100) NULL,
	[IsActive] [bit] NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifyBy] [int] NULL,
	[ModifyDate] [datetime] NULL,
 CONSTRAINT [PK_ModuleControlType_ModuleControlTypeID] PRIMARY KEY CLUSTERED 
(
	[ModuleControlTypeID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ModuleControlTypeValue]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ModuleControlTypeValue](
	[ModuleControlTypeValueID] [int] IDENTITY(1,1) NOT NULL,
	[ModuleControlTypeID] [int] NULL,
	[Value] [nvarchar](500) NULL,
	[IsActive] [bit] NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifyBy] [int] NULL,
	[ModifyDate] [datetime] NULL,
 CONSTRAINT [PK_ModuleControlTypeValue_ModuleControlTypeValueID] PRIMARY KEY CLUSTERED 
(
	[ModuleControlTypeValueID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ModuleFunction]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ModuleFunction](
	[ModuleFunctionId] [int] IDENTITY(1,1) NOT NULL,
	[FunctionCode] [int] NULL,
	[ModuleID] [int] NULL,
	[FunctionName] [varchar](100) NULL,
	[FunctionType] [varchar](100) NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[ModifiedDate] [datetime] NULL,
	[isActive] [bit] NULL,
 CONSTRAINT [PK_ModuleFunction] PRIMARY KEY CLUSTERED 
(
	[ModuleFunctionId] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ModuleRuleMap]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ModuleRuleMap](
	[ModuleRuleMapID] [int] IDENTITY(1,1) NOT NULL,
	[ModuleID] [int] NULL,
	[RuleID] [int] NULL,
	[isMandatory] [bit] NULL,
	[isActive] [bit] NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifyBy] [int] NULL,
	[ModifyDate] [datetime] NULL,
 CONSTRAINT [PK_ModuleRuleMap_ModuleRuleMapID] PRIMARY KEY CLUSTERED 
(
	[ModuleRuleMapID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ModuleStatusMap]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ModuleStatusMap](
	[ModuleStatusMapID] [int] IDENTITY(1,1) NOT NULL,
	[ModuleID] [int] NULL,
	[StatusID] [int] NULL,
	[SortOrder] [int] NULL,
	[IsActive] [bit] NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifyBy] [int] NULL,
	[ModifyDate] [datetime] NULL,
 CONSTRAINT [PK_ModuleStatusMap_ModuleStatusMapID] PRIMARY KEY CLUSTERED 
(
	[ModuleStatusMapID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ModuleWorkFlow]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ModuleWorkFlow](
	[ModuleWorkFlowID] [int] IDENTITY(1,1) NOT NULL,
	[ModuleID] [int] NULL,
	[ModuleConfigNumber] [nvarchar](50) NULL,
	[ModuleConfigDate] [datetime] NULL,
	[OrderTypeLookUpID] [int] NULL,
	[OrderSubTypeLookUpID] [int] NULL,
	[ActionXMLData] [xml] NULL,
	[ActionJasonData] [nvarchar](max) NULL,
	[IsActive] [bit] NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifyBy] [int] NULL,
	[ModifyDate] [datetime] NULL,
 CONSTRAINT [PK_ModuleWorkFlow_ModuleWorkFlowID] PRIMARY KEY CLUSTERED 
(
	[ModuleWorkFlowID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ModuleWorkFlowDetail]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ModuleWorkFlowDetail](
	[ModuleWorkFlowDetailID] [int] IDENTITY(1,1) NOT NULL,
	[ModuleWorkFlowID] [int] NULL,
	[CurrentModuleStatusMapID] [int] NULL,
	[NextModuleStatusMapID] [int] NULL,
	[ModuleActionMapID] [int] NULL,
	[RoleTypeID] [int] NULL,
	[ActionOrder] [int] NULL,
	[IsActive] [bit] NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifyBy] [int] NULL,
	[ModifyDate] [datetime] NULL,
 CONSTRAINT [PK_ModuleWorkFlowDetail_ModuleWorkFlowDetailID] PRIMARY KEY CLUSTERED 
(
	[ModuleWorkFlowDetailID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[NotificationSchedule]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[NotificationSchedule](
	[NotificationScheduleID] [int] IDENTITY(1,1) NOT NULL,
	[NotificationTemplateID] [int] NULL,
	[IsTextNotification] [bit] NULL,
	[IsEmailNotification] [bit] NULL,
	[SchdeuleDayTypeLookUpID1] [int] NULL,
	[SchdeuleDayTypeLookUpID2] [int] NULL,
	[SchdeuleDayTypeLookUpID3] [int] NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifyBy] [int] NULL,
	[ModifyDate] [datetime] NULL,
 CONSTRAINT [PK_NotificationSchedule_NotificationScheduleID] PRIMARY KEY CLUSTERED 
(
	[NotificationScheduleID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[NotificationTemplate]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[NotificationTemplate](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[LanguageID] [int] NULL,
	[TemplateCode] [nvarchar](15) NULL,
	[TemplateName] [nvarchar](500) NULL,
	[TemplateSubject] [nvarchar](max) NULL,
	[TemplateBody] [nvarchar](max) NULL,
	[EnableSchedule] [bit] NULL,
	[Scope] [nvarchar](15) NULL,
	[FeatureCodes] [nvarchar](50) NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[IsActive] [bit] NULL,
	[ModifyBy] [int] NULL,
	[ModifyDate] [datetime] NULL,
	[BrandID] [int] NULL,
 CONSTRAINT [PK_NotificationTemplate_ID] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[NotificationTemplateKey]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[NotificationTemplateKey](
	[NotificationTemplateKeyID] [int] IDENTITY(1,1) NOT NULL,
	[NotificationTemplateID] [int] NULL,
	[KeyName] [nvarchar](150) NULL,
	[KeyValue] [nvarchar](150) NULL,
	[IsActive] [bit] NULL,
 CONSTRAINT [PK_NotificationTemplateKey_NotificationTemplateKeyID] PRIMARY KEY CLUSTERED 
(
	[NotificationTemplateKeyID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[oauth_access_tokens]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[oauth_access_tokens](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[access_token] [nvarchar](256) NULL,
	[expires] [datetime2](7) NULL,
	[scope] [nvarchar](255) NULL,
	[client_id] [bigint] NULL,
	[user_id] [int] NULL,
 CONSTRAINT [PK_oauth_access_tokens_id] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[oauth_authorization_codes]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[oauth_authorization_codes](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[authorization_code] [nvarchar](256) NULL,
	[expires] [datetime] NULL,
	[redirect_uri] [nvarchar](2000) NULL,
	[scope] [nvarchar](255) NULL,
	[client_id] [bigint] NULL,
	[user_id] [int] NULL,
 CONSTRAINT [PK_oauth_authorization_codes_id] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[oauth_clients]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[oauth_clients](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](255) NULL,
	[client_id] [nvarchar](80) NULL,
	[client_secret] [nvarchar](80) NULL,
	[redirect_uri] [nvarchar](2000) NULL,
	[grant_types] [nvarchar](80) NULL,
	[scope] [nvarchar](255) NULL,
	[user_id] [int] NULL,
 CONSTRAINT [PK_oauth_clients_id] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[oauth_refresh_tokens]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[oauth_refresh_tokens](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[refresh_token] [nvarchar](256) NULL,
	[expires] [datetime2](7) NULL,
	[scope] [nvarchar](255) NULL,
	[client_id] [bigint] NULL,
	[user_id] [int] NULL,
 CONSTRAINT [PK_oauth_refresh_tokens_id] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[oauth_scopes]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[oauth_scopes](
	[id] [bigint] NOT NULL,
	[scope] [varchar](80) NULL,
	[is_default] [tinyint] NULL,
 CONSTRAINT [PK_oauth_scopes_id] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[oauth_users]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[oauth_users](
	[id] [bigint] NOT NULL,
	[username] [varchar](32) NULL,
	[password] [varchar](32) NULL,
	[scope] [varchar](255) NULL,
	[isactive] [bit] NULL,
	[createdby] [bigint] NULL,
	[createddate] [datetime] NULL,
	[modifiedby] [bigint] NULL,
	[modifieddate] [datetime] NULL,
	[languageid] [int] NULL,
 CONSTRAINT [PK_oauth_users_id] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[outbound_log]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[outbound_log](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[email] [nvarchar](200) NULL,
	[order_number] [nvarchar](200) NULL,
	[return_number] [nvarchar](200) NULL,
	[payload] [nvarchar](max) NULL,
	[createdDate] [datetime] NULL,
	[source] [nvarchar](200) NULL,
	[event] [nvarchar](200) NULL,
	[status_id] [int] NULL,
	[response] [int] NULL,
 CONSTRAINT [PK_outbound_log_id] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[outbound_log_stage]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[outbound_log_stage](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[email] [nvarchar](200) NULL,
	[order_number] [nvarchar](200) NULL,
	[return_number] [nvarchar](200) NULL,
	[payload] [nvarchar](max) NULL,
	[createdDate] [datetime] NULL,
	[source] [nvarchar](200) NULL,
	[event] [nvarchar](200) NULL,
	[status_id] [int] NULL,
	[response] [int] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PartnerAddressMap]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PartnerAddressMap](
	[PartnerAddressMapID] [int] IDENTITY(1,1) NOT NULL,
	[AddressTypeID] [int] NULL,
	[AddressID] [int] NULL,
	[PartnerID] [int] NULL,
	[Description] [nvarchar](150) NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifyBy] [int] NULL,
	[ModifyDate] [datetime] NULL,
 CONSTRAINT [PK_PartnerAddressMap_PartnerAddressMapID] PRIMARY KEY CLUSTERED 
(
	[PartnerAddressMapID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PartnerAreaCodeMap]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PartnerAreaCodeMap](
	[PartnerAreaCodeMapID] [int] IDENTITY(1,1) NOT NULL,
	[PartnerID] [int] NULL,
	[AreaCodeID] [int] NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
 CONSTRAINT [PK_PartnerAreaCodeMap_PartnerAreaCodeMapID] PRIMARY KEY CLUSTERED 
(
	[PartnerAreaCodeMapID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PartnerConfigMap]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PartnerConfigMap](
	[PartnerConfigMapID] [int] IDENTITY(1,1) NOT NULL,
	[PartnerID] [int] NULL,
	[ConfigID] [int] NULL,
	[ConfigGroup] [nvarchar](50) NULL,
	[ConfigValue] [nvarchar](50) NULL,
	[Description] [nvarchar](100) NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifyBy] [int] NULL,
	[ModifyDate] [datetime] NULL,
 CONSTRAINT [PK_PartnerConfigMap_PartnerConfigMapID] PRIMARY KEY CLUSTERED 
(
	[PartnerConfigMapID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PartnerFacilityMap]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PartnerFacilityMap](
	[PartnerFacilityMapID] [int] IDENTITY(1,1) NOT NULL,
	[PartnerID] [int] NULL,
	[FacilityID] [int] NULL,
	[Description] [nvarchar](100) NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifyBy] [int] NULL,
	[ModifyDate] [datetime] NULL,
 CONSTRAINT [PK_PartnerFacilityMap_PartnerFacilityMapID] PRIMARY KEY CLUSTERED 
(
	[PartnerFacilityMapID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PartnerMultiLingualNavigationURLs]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PartnerMultiLingualNavigationURLs](
	[PartnerMultiLingualNavigationURLID] [int] IDENTITY(1,1) NOT NULL,
	[PartnerID] [int] NULL,
	[LanguageID] [int] NULL,
	[IsActive] [bit] NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifyBy] [int] NULL,
	[ModifyDate] [datetime] NULL,
	[homePageNavigationURL] [nvarchar](200) NULL,
	[contactPageNavigationURL] [nvarchar](200) NULL,
	[returnPolicyNavigationURL] [nvarchar](200) NULL,
	[LogoNavigationURL] [nvarchar](200) NULL,
 CONSTRAINT [PK_PartnerMultiLingualNavigationURLs_PartnerMultiLingualNavigationURLID] PRIMARY KEY CLUSTERED 
(
	[PartnerMultiLingualNavigationURLID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PartnerReturnReasonMap]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PartnerReturnReasonMap](
	[PartnerReturnReasonMapID] [int] IDENTITY(1,1) NOT NULL,
	[PartnerID] [int] NULL,
	[RMAActionCodeID] [int] NULL,
	[isActive] [int] NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifyBy] [int] NULL,
	[ModifyDate] [datetime] NULL,
	[onCP] [bit] NULL,
	[onBO] [bit] NULL,
	[FileRequired] [bit] NULL,
	[CommentRequired] [bit] NULL,
	[ApprovalRequired] [bit] NULL,
 CONSTRAINT [PK_PartnerReturnReasonMap_PartnerReturnReasonMapID] PRIMARY KEY CLUSTERED 
(
	[PartnerReturnReasonMapID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PartnerReturnReasonRuleMap]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PartnerReturnReasonRuleMap](
	[PartnerReturnReasonRuleMapID] [int] IDENTITY(1,1) NOT NULL,
	[PartnerReturnReasonMapID] [int] NULL,
	[ReturnReasonRuleMapID] [int] NULL,
	[RuleValue] [nvarchar](200) NULL,
	[isOverRidable] [bit] NULL,
	[isMandatory] [bit] NULL,
	[IsFixedRuleValue] [int] NULL,
	[RuleValueEffect] [int] NULL,
	[RuleValueEffectTO] [int] NULL,
	[UserInput] [bit] NULL,
	[isActive] [bit] NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifyBy] [int] NULL,
	[ModifyDate] [datetime] NULL,
 CONSTRAINT [PK_PartnerReturnReasonRuleMap_PartnerReturnReasonRuleMapID] PRIMARY KEY CLUSTERED 
(
	[PartnerReturnReasonRuleMapID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Partners]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Partners](
	[PartnerID] [int] IDENTITY(1,1) NOT NULL,
	[AirportID] [int] NULL,
	[PartnerCode] [nvarchar](500) NULL,
	[PartnerName] [nvarchar](500) NULL,
	[ContactName] [nvarchar](500) NULL,
	[ContactNumber] [nvarchar](20) NULL,
	[Email] [nvarchar](250) NULL,
	[ERPNumber] [nvarchar](50) NULL,
	[RegionID] [int] NULL,
	[PartnerParentID] [int] NULL,
	[PartnerTypeID] [int] NULL,
	[InvoiceStoreCode] [nvarchar](50) NULL,
	[PaymentApproval] [bit] NULL,
	[RepairCommandID] [int] NULL,
	[CityCategoryID] [int] NULL,
	[FacilityAddressonInvoice] [bit] NULL,
	[OrganisationTypeID] [int] NULL,
	[RepairNodeID] [int] NULL,
	[RepairLocationID] [int] NULL,
	[IsActive] [bit] NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifyBy] [int] NULL,
	[ModifyDate] [datetime] NULL,
	[OrgSubTypeID] [int] NULL,
	[TeleCode] [nvarchar](5) NULL,
	[ReturnReasonType] [int] NULL,
	[ReturnFacilityID] [int] NULL,
	[DollarExchangeRate] [float] NULL,
	[Logo] [nvarchar](500) NULL,
	[Banner] [nvarchar](500) NULL,
	[ReturnReason] [nvarchar](500) NULL,
	[host] [nvarchar](100) NULL,
	[portnumber] [nvarchar](100) NULL,
	[username] [nvarchar](100) NULL,
	[pass] [nvarchar](100) NULL,
	[SSLValue] [bit] NULL,
	[homePageNavigationURL] [nvarchar](200) NULL,
	[contactPageNavigationURL] [nvarchar](200) NULL,
	[FAQ] [nvarchar](max) NULL,
	[sponsorship] [nvarchar](max) NULL,
	[returnPolicyNavigationURL] [nvarchar](200) NULL,
	[maxParcels] [int] NULL,
	[locateserialnumberURL] [nvarchar](400) NULL,
	[supportassistanceURL] [nvarchar](400) NULL,
	[trademarkURL] [nvarchar](400) NULL,
	[safetywarningURL] [nvarchar](400) NULL,
	[cookiesPolicyURL] [nvarchar](400) NULL,
	[declarationconformityURL] [nvarchar](400) NULL,
	[commercialDeclarationURL] [nvarchar](400) NULL,
	[privacyPolicyURL] [nvarchar](400) NULL,
	[MercahntKey] [nvarchar](1000) NULL,
	[MercahntPassword] [nvarchar](1000) NULL,
 CONSTRAINT [PK_Partners_PartnerID] PRIMARY KEY CLUSTERED 
(
	[PartnerID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[partners_faq]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[partners_faq](
	[faq_id] [int] IDENTITY(1,1) NOT NULL,
	[LanguageID] [int] NOT NULL,
	[PartnerID] [int] NOT NULL,
	[faq_text] [nvarchar](max) NULL,
	[is_active] [bit] NOT NULL,
	[created_by] [int] NULL,
	[created_date] [datetime] NULL,
	[modified_by] [int] NULL,
	[modified_date] [datetime] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PartnerUserRoleMap]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PartnerUserRoleMap](
	[PartnerUserMapID] [int] IDENTITY(1,1) NOT NULL,
	[PartnerID] [int] NULL,
	[UserRoleMapID] [int] NULL,
	[isDefault] [bit] NULL,
	[IsActive] [bit] NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifyBy] [int] NULL,
	[ModifyDate] [datetime] NULL,
 CONSTRAINT [PK_PartnerUserRoleMap_PartnerUserMapID] PRIMARY KEY CLUSTERED 
(
	[PartnerUserMapID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[POData]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[POData](
	[order_number] [varchar](50) NULL,
	[vendor_number] [varchar](50) NULL,
	[req_by_date] [varchar](50) NULL,
	[price_year] [varchar](50) NULL,
	[season_code_id] [varchar](50) NULL,
	[product_number] [varchar](50) NULL,
	[category_code_id] [varchar](50) NULL,
	[grade_code_id] [varchar](50) NULL,
	[subcategory_code_id] [varchar](50) NULL,
	[sex_code] [varchar](50) NULL,
	[hstariff_id] [varchar](50) NULL,
	[country_of_origin_id] [varchar](50) NULL,
	[prim_season_code] [varchar](50) NULL,
	[product_sku] [varchar](50) NULL,
	[product_qty] [varchar](50) NULL,
	[product_weight] [varchar](50) NULL,
	[size_code_id] [varchar](50) NULL,
	[sort_order] [varchar](50) NULL,
	[color_description] [varchar](50) NULL,
	[base_color] [varchar](50) NULL,
	[hex_value] [varchar](50) NULL,
	[createdby] [varchar](50) NULL,
	[created_date] [varchar](50) NULL,
	[updatedby] [varchar](50) NULL,
	[updated_date] [varchar](50) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ProductLocation]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ProductLocation](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[LocationCode]  AS ('LOC'+right('000000000'+CONVERT([varchar](10),[ID]),(5))),
	[LocationName] [nvarchar](50) NULL,
	[RemoteAccess] [nvarchar](50) NULL,
	[SendHome] [nvarchar](50) NULL,
	[Recommerce] [nvarchar](50) NULL,
	[GoreWarranty] [nvarchar](50) NULL,
	[Salvage] [nvarchar](50) NULL,
	[Disposal] [nvarchar](50) NULL,
	[RepairCenterID] [bigint] NULL,
	[CreatedBy] [varchar](50) NULL,
	[CreatedDate] [datetime] NULL,
	[ModifiedBy] [varchar](50) NULL,
	[ModifiedDate] [date] NULL,
	[IsActive] [bit] NULL,
 CONSTRAINT [PK_ProductLocation] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ProductMaster]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ProductMaster](
	[ProductNo] [int] IDENTITY(1,1) NOT NULL,
	[ProductDescr] [varchar](120) NOT NULL,
	[CatCd] [varchar](10) NOT NULL,
	[GradeCd] [varchar](10) NOT NULL,
	[SubCatCd] [varchar](10) NOT NULL,
	[SexCd] [varchar](20) NULL,
	[SKU] [int] NOT NULL,
	[Weight] [decimal](16, 4) NULL,
	[SizeCd] [varchar](10) NOT NULL,
	[SizeDescr] [varchar](80) NOT NULL,
	[ColorDescr] [varchar](80) NOT NULL,
	[BaseColor] [varchar](30) NULL,
	[HexValue] [varchar](10) NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[ModifiedDate] [datetime] NULL,
 CONSTRAINT [PK_ProductMaster] PRIMARY KEY CLUSTERED 
(
	[ProductNo] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ProductSize]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ProductSize](
	[ProductSizeID] [int] IDENTITY(1,1) NOT NULL,
	[SizeCode] [varchar](10) NOT NULL,
	[ShortDescription] [nvarchar](150) NULL,
	[Description] [nvarchar](150) NULL,
	[IsActive] [bit] NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[ModifiedDate] [datetime] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Region]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Region](
	[RegionID] [int] IDENTITY(1,1) NOT NULL,
	[RegionCode] [nvarchar](500) NULL,
	[RegionName] [nvarchar](500) NULL,
	[Description] [nvarchar](max) NULL,
	[DateTimeFormat] [nvarchar](200) NULL,
	[ReturnArchive] [int] NULL,
	[PendingReturnArchive] [int] NULL,
	[IsActive] [bit] NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifyBy] [int] NULL,
	[ModifyDate] [datetime] NULL,
	[CurrencyID] [int] NULL,
	[ReturnWindow] [int] NULL,
	[Tax] [int] NULL,
 CONSTRAINT [PK_Region_RegionID] PRIMARY KEY CLUSTERED 
(
	[RegionID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[RegionConfigMap]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RegionConfigMap](
	[RegionConfigMapID] [int] IDENTITY(1,1) NOT NULL,
	[RegionID] [int] NULL,
	[TypeLookupID] [int] NULL,
	[ConfigGroup] [nvarchar](100) NULL,
	[Description] [nvarchar](max) NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifyBy] [int] NULL,
	[ModifyDate] [datetime] NULL,
 CONSTRAINT [PK_RegionConfigMap_RegionConfigMapID] PRIMARY KEY CLUSTERED 
(
	[RegionConfigMapID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[repair_charges]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[repair_charges](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[repair_action] [varchar](200) NOT NULL,
	[repair_charges] [int] NOT NULL,
	[created_by] [int] NOT NULL,
	[created_date] [datetime] NOT NULL,
	[updated_by] [int] NOT NULL,
	[updated_date] [datetime] NOT NULL,
	[IsActive] [bit] NOT NULL,
 CONSTRAINT [PK_repair_charges] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[repair_resolution]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[repair_resolution](
	[resolution] [varchar](200) NOT NULL,
	[is_bill_to_customer] [bit] NOT NULL,
	[is_free_of_charge] [bit] NOT NULL,
	[calculated_from_price_list] [bit] NOT NULL,
	[price_list_column] [varchar](100) NOT NULL,
	[is_repair_charge_applicable] [bit] NOT NULL,
	[created_by] [int] NOT NULL,
	[created_date] [datetime] NOT NULL,
	[updated_by] [int] NOT NULL,
	[updated_date] [datetime] NOT NULL,
	[id] [int] IDENTITY(1,1) NOT NULL,
	[isactive] [bit] NOT NULL,
	[warranty_status] [bit] NULL,
 CONSTRAINT [PK_repair_resolution] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[RepairMaterial]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RepairMaterial](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[MaterialCode]  AS ('MAT'+right('000000000'+CONVERT([varchar](10),[ID]),(5))),
	[MaterialName] [nvarchar](50) NULL,
	[Description] [nvarchar](50) NULL,
	[CreatedDate] [datetime] NULL,
	[CreatedBy] [nvarchar](50) NULL,
	[ModifyDate] [datetime] NULL,
	[ModifyBy] [nvarchar](50) NULL,
	[IsActive] [bit] NULL,
 CONSTRAINT [PK_RepairMaterial] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[return_detail]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[return_detail](
	[return_detail_id] [int] IDENTITY(1,1) NOT NULL,
	[return_header_id] [bigint] NULL,
	[status_id] [int] NULL,
	[product_id] [nvarchar](200) NULL,
	[product_name] [nvarchar](200) NULL,
	[EAN] [nvarchar](200) NULL,
	[description] [nvarchar](2000) NULL,
	[product_image] [nvarchar](500) NULL,
	[original_qty] [float] NULL,
	[unit_price] [float] NULL,
	[effective_price] [float] NULL,
	[return_qty] [float] NULL,
	[return_reason_id] [int] NULL,
	[remark] [nvarchar](max) NULL,
	[extra] [nvarchar](max) NULL,
	[created_by] [int] NULL,
	[created_date] [datetime] NULL,
	[modify_by] [int] NULL,
	[modified_date] [datetime] NULL,
	[files] [nvarchar](max) NULL,
	[order_number] [nvarchar](400) NULL,
	[serial_number] [nvarchar](100) NULL,
	[shipment_id] [nvarchar](50) NULL,
	[is_eol] [bit] NULL,
	[iscancelled] [bit] NULL,
	[cancelled_date] [datetime] NULL,
	[cancelled_by] [nvarchar](100) NULL,
	[cancelled_remarks] [nvarchar](100) NULL,
	[RMA] [nvarchar](100) NULL,
	[warranty_status_id] [int] NULL,
	[warranty] [nvarchar](max) NULL,
	[warrantydate] [datetime] NULL,
	[isauthorized] [bit] NULL,
	[authorized_date] [datetime] NULL,
	[authorized_by] [int] NULL,
	[authorized_reason_id] [int] NULL,
	[authorized_comment] [nvarchar](500) NULL,
	[authorized_approve_date_code] [nvarchar](50) NULL,
 CONSTRAINT [PK_return_detail_return_detail_id] PRIMARY KEY CLUSTERED 
(
	[return_detail_id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[return_detail_stage]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[return_detail_stage](
	[return_detail_id] [int] NOT NULL,
	[return_header_id] [bigint] NULL,
	[status_id] [int] NULL,
	[product_id] [nvarchar](200) NULL,
	[product_name] [nvarchar](200) NULL,
	[EAN] [nvarchar](200) NULL,
	[description] [nvarchar](2000) NULL,
	[product_image] [nvarchar](500) NULL,
	[original_qty] [float] NULL,
	[unit_price] [float] NULL,
	[effective_price] [float] NULL,
	[return_qty] [float] NULL,
	[return_reason_id] [int] NULL,
	[remark] [nvarchar](max) NULL,
	[extra] [nvarchar](max) NULL,
	[created_by] [int] NULL,
	[created_date] [datetime] NULL,
	[modify_by] [int] NULL,
	[modified_date] [datetime] NULL,
	[files] [nvarchar](max) NULL,
	[order_number] [nvarchar](400) NULL,
	[serial_number] [nvarchar](100) NULL,
	[shipment_id] [nvarchar](50) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[return_event]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[return_event](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[event] [int] NULL,
	[return_detail_id] [int] NULL,
	[remark] [nvarchar](500) NULL,
	[event_date] [datetime] NULL,
	[created_by] [int] NULL,
	[return_header_id] [bigint] NULL,
 CONSTRAINT [PK_return_event_id] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[return_event_stage]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[return_event_stage](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[event] [int] NULL,
	[return_detail_id] [int] NULL,
	[remark] [nvarchar](500) NULL,
	[event_date] [datetime] NULL,
	[created_by] [int] NULL,
	[return_header_id] [bigint] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[return_freight]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[return_freight](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[origin] [int] NULL,
	[destination] [int] NULL,
	[brand] [int] NULL,
	[avg_weight] [float] NULL,
	[avg_cost] [float] NULL,
	[over_weight] [float] NULL,
	[over_cost] [float] NULL,
	[applicable_form] [datetime] NULL,
	[applicable_upto] [datetime] NULL,
	[created_by] [int] NULL,
	[created_date] [datetime] NULL,
	[modify_by] [int] NULL,
	[modify_date] [datetime] NULL,
	[ServiceLevel] [nvarchar](100) NULL,
	[lead_time] [int] NULL,
	[service_name] [nvarchar](max) NULL,
	[is_drop_off] [bit] NULL,
	[avg_cost_vat] [float] NULL,
	[over_cost_vat] [float] NULL,
	[customs_duty_fees] [float] NULL,
	[customs_duty_fees_vat] [float] NULL,
 CONSTRAINT [PK_return_freight_id] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[return_header]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[return_header](
	[return_header_id] [bigint] IDENTITY(1,1) NOT NULL,
	[return_number] [nvarchar](200) NULL,
	[status_id] [int] NULL,
	[order_number] [nvarchar](200) NULL,
	[internal_order_number] [nvarchar](200) NULL,
	[order_date] [datetime] NULL,
	[shipped_date] [datetime] NULL,
	[brand_id] [int] NULL,
	[inbound_log_id] [bigint] NULL,
	[customer_id] [bigint] NULL,
	[labels] [nvarchar](max) NULL,
	[custom_declaration] [nvarchar](max) NULL,
	[order_amount] [float] NULL,
	[order_tax] [float] NULL,
	[refund_amount] [float] NULL,
	[refund_tax] [float] NULL,
	[shipping_charge] [float] NULL,
	[shipping_tax] [float] NULL,
	[total_refund] [float] NULL,
	[currency] [int] NULL,
	[source] [nvarchar](200) NULL,
	[extra] [nvarchar](max) NULL,
	[created_by] [int] NULL,
	[created_date] [datetime] NULL,
	[modify_by] [int] NULL,
	[modified_date] [datetime] NULL,
	[files] [nvarchar](max) NULL,
	[is_exchange] [bit] NULL,
	[return_qty]  AS ([dbo].[fn_getReturnCount]([return_header_id])),
	[return_statuses]  AS ([dbo].[fn_getReturnstatuses]([return_header_id])),
	[return_dc] [nvarchar](100) NULL,
	[default_return_shipment] [nvarchar](100) NULL,
	[servicetype] [nvarchar](20) NULL,
	[primary_email] [nvarchar](200) NULL,
	[secondary_email] [nvarchar](200) NULL,
	[add_own_reference_number] [nvarchar](max) NULL,
 CONSTRAINT [PK_return_header_return_header_id] PRIMARY KEY CLUSTERED 
(
	[return_header_id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[return_header_stage]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[return_header_stage](
	[return_header_id] [bigint] NOT NULL,
	[return_number] [nvarchar](200) NULL,
	[status_id] [int] NULL,
	[order_number] [nvarchar](200) NULL,
	[internal_order_number] [nvarchar](200) NULL,
	[order_date] [datetime] NULL,
	[shipped_date] [datetime] NULL,
	[brand_id] [int] NULL,
	[inbound_log_id] [bigint] NULL,
	[customer_id] [bigint] NULL,
	[labels] [nvarchar](max) NULL,
	[custom_declaration] [nvarchar](max) NULL,
	[order_amount] [float] NULL,
	[order_tax] [float] NULL,
	[refund_amount] [float] NULL,
	[refund_tax] [float] NULL,
	[shipping_charge] [float] NULL,
	[shipping_tax] [float] NULL,
	[total_refund] [float] NULL,
	[currency] [int] NULL,
	[source] [nvarchar](200) NULL,
	[extra] [nvarchar](max) NULL,
	[created_by] [int] NULL,
	[created_date] [datetime] NULL,
	[modify_by] [int] NULL,
	[modified_date] [datetime] NULL,
	[return_qty]  AS ([dbo].[fn_getReturnCount_stage]([return_header_id])),
	[return_statuses]  AS ([dbo].[fn_getReturnstatuses_stage]([return_header_id])),
	[files] [nvarchar](max) NULL,
	[is_exchange] [bit] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[return_mrnmap]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[return_mrnmap](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[return_header_id] [int] NULL,
	[MRNNo] [nvarchar](500) NULL,
	[CreatedBy] [int] NULL,
	[CreatedOn] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[return_mrnmap_stage]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[return_mrnmap_stage](
	[id] [int] NOT NULL,
	[return_header_id] [int] NULL,
	[MRNNo] [nvarchar](500) NULL,
	[CreatedBy] [int] NULL,
	[CreatedOn] [datetime] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[return_parcel]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[return_parcel](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[return_header_id] [bigint] NULL,
	[shipment_number] [nvarchar](500) NULL,
	[shipment_id] [nvarchar](500) NULL,
	[carrier] [nvarchar](500) NULL,
	[delivery_date] [datetime] NULL,
	[received] [bit] NULL,
	[tracking_url] [nvarchar](500) NULL,
	[route_number] [int] NULL,
	[carrier_code] [nvarchar](50) NULL,
	[dimensions] [nvarchar](max) NULL,
	[tracking_no] [nvarchar](50) NULL,
	[avg_cost] [float] NULL,
	[over_cost] [float] NULL,
	[sponsorship_cost] [float] NULL,
	[is_oversize] [bit] NULL,
	[avg_cost_vat] [float] NULL,
	[over_cost_vat] [float] NULL,
	[sponsorship_cost_vat] [float] NULL,
	[custom_cost_vat] [float] NULL,
	[custom_cost] [float] NULL,
 CONSTRAINT [PK_return_parcel_id] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[return_parcel_stage]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[return_parcel_stage](
	[id] [int] NOT NULL,
	[return_header_id] [bigint] NULL,
	[shipment_number] [nvarchar](500) NULL,
	[shipment_id] [nvarchar](500) NULL,
	[carrier] [nvarchar](500) NULL,
	[delivery_date] [datetime] NULL,
	[received] [bit] NULL,
	[tracking_url] [nvarchar](500) NULL,
	[route_number] [int] NULL,
	[carrier_code] [nvarchar](50) NULL,
	[dimensions] [nvarchar](max) NULL,
	[tracking_no] [nvarchar](50) NULL,
	[avg_cost] [float] NULL,
	[over_cost] [float] NULL,
	[sponsorship_cost] [float] NULL,
	[is_oversize] [bit] NULL,
	[avg_cost_vat] [float] NULL,
	[over_cost_vat] [float] NULL,
	[sponsorship_cost_vat] [float] NULL,
	[custom_cost_vat] [float] NULL,
	[custom_cost] [float] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ReturnReasonIssue]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ReturnReasonIssue](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[ParentID] [int] NULL,
	[Code] [varchar](100) NULL,
	[Name] [nvarchar](100) NULL,
	[Description] [varchar](max) NULL,
	[IsActive] [bit] NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifyBy] [int] NULL,
	[ModifyDate] [datetime] NULL,
 CONSTRAINT [PK__ReturnReasonIssue__10D160BFF51530D6] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ReturnReasonLocation]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ReturnReasonLocation](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[CategoryID] [int] NULL,
	[Code] [varchar](100) NULL,
	[Name] [nvarchar](100) NULL,
	[Description] [varchar](max) NULL,
	[IsActive] [bit] NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifyBy] [int] NULL,
	[ModifyDate] [datetime] NULL,
 CONSTRAINT [PK__ReturnReasonLocation__10D160BFF51530D6] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ReturnReasonRootCause]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ReturnReasonRootCause](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[Code] [nvarchar](50) NOT NULL,
	[Description] [nvarchar](max) NULL,
	[IsActive] [bit] NOT NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifyBy] [int] NULL,
	[ModifyDate] [datetime] NULL,
 CONSTRAINT [PK_ReturnReasonRootCause] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ReturnReasonRuleMap]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ReturnReasonRuleMap](
	[ReturnReasonRuleMapID] [int] IDENTITY(1,1) NOT NULL,
	[RMAActionCodeID] [int] NULL,
	[RuleID] [int] NULL,
	[RuleControlTypeID] [int] NULL,
	[RuleValue] [nvarchar](200) NULL,
	[isOverRidable] [bit] NULL,
	[isMandatory] [bit] NULL,
	[isActive] [bit] NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifyBy] [int] NULL,
	[ModifyDate] [datetime] NULL,
	[IsFixedRuleValue] [int] NULL,
	[RuleValueEffect] [int] NULL,
	[RuleValueEffectTO] [int] NULL,
	[UserInput] [bit] NULL,
 CONSTRAINT [PK_ReturnReasonRuleMap_ReturnReasonRuleMapID] PRIMARY KEY CLUSTERED 
(
	[ReturnReasonRuleMapID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[returns_note]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[returns_note](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Note] [nvarchar](max) NULL,
	[CreatedDate] [datetime] NULL,
	[CreatedBy] [int] NULL,
	[IsActive] [bit] NULL,
	[return_header_id] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[RMAActionCode]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RMAActionCode](
	[RMAActionCodeID] [int] IDENTITY(1,1) NOT NULL,
	[RMAActionCode] [nvarchar](50) NULL,
	[RMAActionName] [nvarchar](max) NULL,
	[RMAActionTypeID] [int] NULL,
	[isActive] [bit] NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifyBy] [int] NULL,
	[ModifyDate] [datetime] NULL,
	[FeatureCodes] [nvarchar](500) NULL,
	[Parameters] [nvarchar](max) NULL,
	[RMAActionType] [int] NULL,
	[TenantReturnReasonCode] [nvarchar](100) NULL,
	[onCP] [bit] NULL,
	[onBO] [bit] NULL,
	[FileRequired] [bit] NULL,
	[CommentRequired] [bit] NULL,
	[ApprovalRequired] [bit] NULL,
	[display_name]  AS (case [RMAActionTypeID] when (565) then json_value([RMAActionName],'$.enus') else [RMAActionName] end),
	[ParentId] [int] NULL,
 CONSTRAINT [PK_RMAActionCode_RMAActionCodeID] PRIMARY KEY CLUSTERED 
(
	[RMAActionCodeID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[RMAActionCodeMap]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RMAActionCodeMap](
	[RMAActionCodeMapID] [int] IDENTITY(1,1) NOT NULL,
	[RMAActionCodeID] [int] NULL,
	[ParentActionCodeID] [int] NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifyBy] [int] NULL,
	[ModifyDate] [datetime] NULL,
 CONSTRAINT [PK_RMAActionCodeMap_RMAActionCodeMapID] PRIMARY KEY CLUSTERED 
(
	[RMAActionCodeMapID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[RMAActionModelMap]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RMAActionModelMap](
	[RMAActionModelMapID] [int] IDENTITY(1,1) NOT NULL,
	[RMAActionCodeID] [int] NULL,
	[SKUItemMasterID] [int] NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifyBy] [int] NULL,
	[ModifyDate] [datetime] NULL,
 CONSTRAINT [PK_RMAActionModelMap_RMAActionModelMapID] PRIMARY KEY CLUSTERED 
(
	[RMAActionModelMapID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[RoleModuleFunction]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RoleModuleFunction](
	[RoleModuleFunctionID] [int] IDENTITY(1,1) NOT NULL,
	[RoleTypeId] [int] NULL,
	[ModuleFunctionID] [int] NULL,
	[IsApplicable] [bit] NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[UpdatedBy] [int] NULL,
	[UpdatedDate] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[RoleModuleFunctionID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[RoleType]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RoleType](
	[RoleID] [int] IDENTITY(1,1) NOT NULL,
	[RoleName] [varchar](100) NULL,
	[InBuilt] [bit] NOT NULL,
	[DashBoardMasterID] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[CreatedBy] [int] NULL,
	[ModifiedBy] [int] NULL,
	[ModifiedDate] [datetime] NULL,
	[IsActive] [bit] NULL,
	[UserType] [nvarchar](100) NULL,
 CONSTRAINT [PK_RoleType_dbo] PRIMARY KEY CLUSTERED 
(
	[RoleID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Rules]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Rules](
	[RuleID] [int] IDENTITY(1,1) NOT NULL,
	[RuleCode] [nvarchar](50) NULL,
	[RuleName] [nvarchar](100) NULL,
	[RuleDescription] [nvarchar](500) NULL,
	[RuleFunction] [nvarchar](250) NULL,
	[RuleTypeID] [int] NULL,
	[ControlTypeID] [int] NULL,
	[isActive] [bit] NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifyBy] [int] NULL,
	[ModifyDate] [datetime] NULL,
	[FeatureCodes] [nvarchar](500) NULL,
	[SortOrder] [int] NULL,
	[RuleGroupID] [int] NULL,
	[UserInput] [bit] NULL,
 CONSTRAINT [PK_Rules_RuleID] PRIMARY KEY CLUSTERED 
(
	[RuleID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SalePlan]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SalePlan](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[Code] [nvarchar](10) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[IsActive] [bit] NOT NULL,
	[CreatedBy] [bigint] NULL,
	[CreatedDate] [datetime] NOT NULL,
	[ModifiedBy] [bigint] NULL,
	[ModifiedDate] [datetime] NOT NULL,
	[Salable] [bit] NOT NULL,
 CONSTRAINT [PK_SalePlan] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SalePlanModule]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SalePlanModule](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[SalePlanID] [bigint] NULL,
	[ModuleID] [bigint] NULL,
	[IsActive] [bit] NOT NULL,
	[CreatedBy] [bigint] NULL,
	[CreatedDate] [datetime] NOT NULL,
	[ModifiedBy] [bigint] NULL,
	[ModifiedDate] [datetime] NOT NULL,
 CONSTRAINT [PK_SalePlanModule] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SAPOrder_MRNMap]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SAPOrder_MRNMap](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[sap_order_number] [nvarchar](500) NULL,
	[MRNNo] [nvarchar](500) NULL,
	[CustomsProcedure] [nvarchar](500) NULL,
	[CountryOfDestination] [nvarchar](500) NULL,
	[order_number] [nvarchar](500) NULL,
	[return_header_id] [int] NULL,
	[UploadedOn] [datetime] NULL,
	[UploadedFileName] [nvarchar](500) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Season]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Season](
	[SeasonID] [int] IDENTITY(1,1) NOT NULL,
	[SeasonName] [nvarchar](50) NOT NULL,
	[SeasonCode] [nvarchar](50) NOT NULL,
	[Description] [nvarchar](max) NULL,
	[IsActive] [bit] NOT NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifyBy] [int] NULL,
	[ModifyDate] [datetime] NULL,
 CONSTRAINT [PK_Season] PRIMARY KEY CLUSTERED 
(
	[SeasonID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SeasonalConfig]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SeasonalConfig](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[Logo] [nvarchar](500) NULL,
	[Banner] [nvarchar](500) NULL,
	[ReturnReason] [nvarchar](500) NULL,
	[fromDate] [datetime] NULL,
	[toDate] [datetime] NULL,
	[PartnerId] [int] NULL,
	[CreatedBy] [int] NULL,
	[CreateDate] [datetime] NULL,
	[IsActive] [int] NULL,
 CONSTRAINT [PK_SeasonalConfig_id] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[State]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[State](
	[StateID] [int] IDENTITY(1,1) NOT NULL,
	[StateName] [nvarchar](100) NULL,
	[CountryID] [int] NULL,
	[IsActive] [bit] NULL,
	[TimeZoneID] [int] NULL,
	[LanguageID] [int] NULL,
	[DateTimeFormat] [nvarchar](1) NULL,
	[PhoneMask] [nvarchar](1) NULL,
	[CreatedDate] [datetime] NULL,
	[ModifyDate] [datetime] NULL,
	[CurrencyID] [int] NULL,
	[StateCode] [nvarchar](100) NULL,
	[CreatedBy] [int] NULL,
	[ModifyBy] [int] NULL,
	[Description] [nvarchar](max) NULL,
 CONSTRAINT [PK__States__C3BA3B5A6EC0E476] PRIMARY KEY CLUSTERED 
(
	[StateID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[StoreShipTo]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[StoreShipTo](
	[StoreShipToID] [int] IDENTITY(1,1) NOT NULL,
	[ShipToNo] [nvarchar](50) NULL,
	[ShipToName] [nvarchar](150) NULL,
	[RegionalOffice] [nvarchar](50) NULL,
	[Address1] [nvarchar](150) NULL,
	[Address2] [nvarchar](150) NULL,
	[City] [nvarchar](20) NULL,
	[State] [nvarchar](20) NULL,
	[Country] [nvarchar](20) NULL,
	[PostalCode] [nvarchar](10) NULL,
	[AccountBillToID] [int] NULL,
	[IsActive] [bit] NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[ModifiedDate] [datetime] NULL,
	[LanguageId] [int] NULL,
 CONSTRAINT [PK_StoreShipTo] PRIMARY KEY CLUSTERED 
(
	[StoreShipToID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SubCategory]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SubCategory](
	[SubCatID] [int] IDENTITY(1,1) NOT NULL,
	[SubCatCd] [nvarchar](10) NOT NULL,
	[Description] [nvarchar](150) NULL,
	[IsActive] [bit] NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[ModifiedDate] [datetime] NULL,
 CONSTRAINT [PK_SubCategory] PRIMARY KEY CLUSTERED 
(
	[SubCatID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[sysdiagrams]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[sysdiagrams](
	[name] [sysname] NOT NULL,
	[principal_id] [int] NOT NULL,
	[diagram_id] [int] IDENTITY(1,1) NOT NULL,
	[version] [int] NULL,
	[definition] [varbinary](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[diagram_id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UK_principal_name] UNIQUE NONCLUSTERED 
(
	[principal_id] ASC,
	[name] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[T1]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[T1](
	[ID] [int] NOT NULL,
	[name] [varchar](10) NOT NULL,
	[Country] [varchar](10) NULL,
 CONSTRAINT [PK_ID] PRIMARY KEY NONCLUSTERED 
(
	[ID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Tenant]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Tenant](
	[TenantID] [int] IDENTITY(1,1) NOT NULL,
	[TenantName] [nvarchar](200) NOT NULL,
	[TenantCode] [nvarchar](50) NOT NULL,
	[ClaimType] [nvarchar](50) NOT NULL,
	[EmailId] [nvarchar](100) NULL,
	[ValidFrom] [datetime] NOT NULL,
	[ValidTo] [datetime] NOT NULL,
	[NoofUsers] [int] NULL,
	[Domain] [nvarchar](250) NULL,
	[XMLData] [nvarchar](max) NULL,
	[IsApprove] [bit] NOT NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NOT NULL,
	[ModifiedBy] [int] NULL,
	[ModifiedDate] [datetime] NOT NULL,
	[LogoUrl] [nvarchar](500) NULL,
	[IsTenantSignOff] [bit] NULL,
	[DBServer] [nvarchar](50) NULL,
	[DBUserName] [nvarchar](50) NULL,
	[DBPassword] [nvarchar](50) NULL,
	[DBServerName] [nvarchar](50) NULL,
	[isActive] [bit] NOT NULL,
	[CPDomain] [nvarchar](250) NULL,
	[CurrencyID] [int] NULL,
	[StatusID] [int] NULL,
	[IsCallCenterSupport] [nvarchar](100) NULL,
	[IsCustomerRegistration] [bit] NULL,
	[FeatureIDs] [nvarchar](1000) NULL,
	[IsTroubleshoot] [bit] NULL,
	[PaymentLookupIDs] [nvarchar](100) NULL,
	[PaymentBillingAddress] [nvarchar](100) NULL,
	[DeliveryLookupIDs] [nvarchar](100) NULL,
	[QuoteApprovalLookupIDs] [nvarchar](100) NULL,
	[CarrierLookupIDs] [nvarchar](100) NULL,
	[IsShippingLable] [bit] NULL,
	[IsPOPReq] [bit] NULL,
	[IsInvoiceGeneration] [bit] NULL,
	[OOWQuoteRejectionMinCharges] [money] NULL,
	[SwapTypeLookupIDs] [nvarchar](100) NULL,
	[ReturSwapModelIDs] [nvarchar](100) NULL,
	[IsReturnInvoiceGeneration] [bit] NULL,
	[APIMethodIDs] [nvarchar](100) NULL,
	[OTP] [nvarchar](100) NULL,
	[ResetPWDOTP] [varchar](50) NULL,
	[ResetPWDExpiry] [datetime] NULL,
	[Country] [nvarchar](100) NULL,
	[Mobile] [nvarchar](100) NULL,
	[IsNotified] [int] NULL,
	[Comment] [nvarchar](2000) NULL,
	[OTPSMS] [nvarchar](100) NULL,
	[UpdatedFeatureIDs] [nvarchar](1000) NULL,
	[FTP] [nvarchar](1000) NULL,
	[FTPUser] [nvarchar](200) NULL,
	[FTPPassword] [nvarchar](200) NULL,
	[IsActivated] [bit] NULL,
 CONSTRAINT [PK_Tenant] PRIMARY KEY CLUSTERED 
(
	[TenantID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TenantSalePlanMap]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TenantSalePlanMap](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[SalePlanID] [bigint] NULL,
	[TenantID] [int] NULL,
	[IsActive] [bit] NOT NULL,
	[CreatedBy] [bigint] NULL,
	[CreatedDate] [datetime] NOT NULL,
	[ModifiedBy] [bigint] NULL,
	[ModifiedDate] [datetime] NOT NULL,
 CONSTRAINT [PK_TenantSalePlanMap] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TimeZone]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TimeZone](
	[TimeZoneId] [int] IDENTITY(1,1) NOT NULL,
	[TimeZoneName] [varchar](100) NULL,
	[TimeZoneDescription] [nvarchar](100) NULL,
	[TimeZoneDifference] [decimal](18, 2) NULL,
	[TimeZoneDifferenceInMinutes] [decimal](18, 2) NULL,
	[DayTimeSaving] [bit] NULL,
	[UTCOffset] [nvarchar](50) NULL,
	[IsActive] [bit] NOT NULL,
	[TimeFormat] [nvarchar](500) NULL,
 CONSTRAINT [PK__TimeZone] PRIMARY KEY CLUSTERED 
(
	[TimeZoneId] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TypeLookUp]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TypeLookUp](
	[TypeLookUpID] [int] IDENTITY(1,1) NOT NULL,
	[TypeCode] [nvarchar](20) NULL,
	[TypeName] [nvarchar](50) NULL,
	[TypeGroup] [nvarchar](50) NULL,
	[Description] [nvarchar](150) NULL,
	[SortOrder] [int] NULL,
	[IsActive] [bit] NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifyBy] [int] NULL,
	[ModifyDate] [datetime] NULL,
	[FeatureCodes] [nvarchar](500) NULL,
	[showinCP] [nvarchar](200) NULL,
	[showinBO] [nvarchar](200) NULL,
 CONSTRAINT [PK_TypeLookUp_TypeLookUpID] PRIMARY KEY CLUSTERED 
(
	[TypeLookUpID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UOMMaster]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UOMMaster](
	[UOMID] [int] IDENTITY(1,1) NOT NULL,
	[UOMCode] [nvarchar](10) NOT NULL,
	[UOMName] [nvarchar](50) NOT NULL,
	[IsActive] [bit] NOT NULL,
	[CreatedBy] [int] NOT NULL,
	[CreatedDate] [datetime] NOT NULL,
	[ModifyBy] [int] NOT NULL,
	[ModifyDate] [datetime] NOT NULL,
 CONSTRAINT [PK_UOMMaster] PRIMARY KEY CLUSTERED 
(
	[UOMID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[User_Password_History]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[User_Password_History](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[UserID] [int] NOT NULL,
	[Password] [nvarchar](500) NOT NULL,
	[PasswordChangeDate] [datetime] NOT NULL,
 CONSTRAINT [PK_User_Password_History] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UserRoleMap]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserRoleMap](
	[UserRoleMapID] [int] IDENTITY(1,1) NOT NULL,
	[UserID] [int] NULL,
	[RoleTypeID] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[CreatedBy] [int] NULL,
	[ModifiedBy] [int] NULL,
	[ModifiedDate] [datetime] NULL,
	[IsActive] [bit] NULL,
 CONSTRAINT [PK_UserRoleMap_UserRoleMapID] PRIMARY KEY CLUSTERED 
(
	[UserRoleMapID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 25-05-2020 09:04:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[UserID] [int] IDENTITY(1,1) NOT NULL,
	[TenantID] [int] NOT NULL,
	[Initials] [nvarchar](5) NULL,
	[UserImage] [nvarchar](500) NULL,
	[FirstName] [nvarchar](50) NOT NULL,
	[MiddleName] [nvarchar](50) NULL,
	[LastName] [nvarchar](50) NULL,
	[Email] [nvarchar](50) NOT NULL,
	[CellNumber] [nvarchar](50) NULL,
	[UserName] [nvarchar](50) NOT NULL,
	[Password] [nvarchar](50) NOT NULL,
	[UserType] [nvarchar](50) NOT NULL,
	[TimeZoneID] [int] NULL,
	[CreatedDate] [datetime] NOT NULL,
	[ModifiedDate] [datetime] NOT NULL,
	[LastLoggedInDate] [datetime] NULL,
	[IsLoggedIn] [bit] NULL,
	[IsActive] [bit] NOT NULL,
	[UserTheme] [varchar](50) NULL,
	[LanguageID] [int] NOT NULL,
	[TeleCode] [nvarchar](5) NULL,
	[Scope] [nvarchar](20) NULL,
	[home] [nvarchar](100) NULL,
	[tz] [int] NULL,
	[FullName]  AS ((isnull([FirstName],'')+isnull(' '+[MiddleName],''))+isnull(' '+[LastName],'')),
	[NodeID] [int] NULL,
	[Brands] [nvarchar](max) NULL,
	[IsFirstLoginAttempt] [bit] NULL,
	[FailedLoginAttempt] [int] NULL,
	[PasswordUpdateDate] [datetime] NULL,
	[IsFailedLoginLock] [bit] NULL,
 CONSTRAINT [PK_TenantUser] PRIMARY KEY CLUSTERED 
(
	[UserID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[ConfigSetup] ADD  CONSTRAINT [DF_ConfigSetup_IsActive]  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[ConfigSetup] ADD  CONSTRAINT [DF_ConfigSetup_CreatedDate]  DEFAULT (getutcdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[ConfigSetup] ADD  CONSTRAINT [DF_ConfigSetup_ModifyDate]  DEFAULT (getutcdate()) FOR [ModifyDate]
GO
ALTER TABLE [dbo].[consumer_return_header] ADD  CONSTRAINT [DF_consumer_return_header_created_date]  DEFAULT (getutcdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[consumer_return_header] ADD  DEFAULT ((0)) FOR [is_updated_customer]
GO
ALTER TABLE [dbo].[Country_ServiceType_LabelType_configuration] ADD  CONSTRAINT [DF_Country_ServiceType_LabelType_configuration_partner_Cycleon]  DEFAULT ((0)) FOR [partner_Cycleon]
GO
ALTER TABLE [dbo].[Country_ServiceType_LabelType_configuration] ADD  CONSTRAINT [DF_Country_ServiceType_LabelType_configuration_enderuser_Cycleon]  DEFAULT ((0)) FOR [enderuser_Cycleon]
GO
ALTER TABLE [dbo].[Country_ServiceType_LabelType_configuration] ADD  CONSTRAINT [DF_Country_ServiceType_LabelType_configuration_configured_date]  DEFAULT (getutcdate()) FOR [configured_date]
GO
ALTER TABLE [dbo].[Currency] ADD  CONSTRAINT [DF_Currency_CreatedDate]  DEFAULT (getutcdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[Currency] ADD  CONSTRAINT [DF_Currency_ModifyDate]  DEFAULT (getutcdate()) FOR [ModifyDate]
GO
ALTER TABLE [dbo].[email_log] ADD  CONSTRAINT [DF_Table_1_IsSent]  DEFAULT ((0)) FOR [IsDispatched]
GO
ALTER TABLE [dbo].[email_log] ADD  CONSTRAINT [DF_email_log_CreatedDate]  DEFAULT (getutcdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[EmailLog] ADD  CONSTRAINT [DF_EmailLog_IsPending]  DEFAULT ((0)) FOR [IsPending]
GO
ALTER TABLE [dbo].[ErrorLog] ADD  CONSTRAINT [DF_ErrorLog_CreatedDate]  DEFAULT (getdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[Facility] ADD  CONSTRAINT [DF_Facility_IsActive]  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[Facility] ADD  CONSTRAINT [DF_Facility_CreatedDate]  DEFAULT (getutcdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[Facility] ADD  CONSTRAINT [DF_Facility_ModifyDate]  DEFAULT (getutcdate()) FOR [ModifyDate]
GO
ALTER TABLE [dbo].[FormField] ADD  CONSTRAINT [DF_FormField_isRequired]  DEFAULT ((0)) FOR [isRequired]
GO
ALTER TABLE [dbo].[FormField] ADD  CONSTRAINT [DF_FormField_isVisible]  DEFAULT ((1)) FOR [isVisible]
GO
ALTER TABLE [dbo].[FormField] ADD  CONSTRAINT [DF_FormField_isEnabled]  DEFAULT ((1)) FOR [isEnabled]
GO
ALTER TABLE [dbo].[FormField] ADD  CONSTRAINT [DF_FormField_ShowinGrid]  DEFAULT ((0)) FOR [ShowinGrid]
GO
ALTER TABLE [dbo].[FormField] ADD  CONSTRAINT [DF_FormField_GridWidth]  DEFAULT ((200)) FOR [GridWidth]
GO
ALTER TABLE [dbo].[ga_request_header] ADD  CONSTRAINT [DF_ga_request_header_created_date]  DEFAULT (getutcdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[inbound_log] ADD  DEFAULT ((1)) FOR [version]
GO
ALTER TABLE [dbo].[ItemMaster] ADD  CONSTRAINT [DF_ItemMaster_IsSWAPAllowed]  DEFAULT ((0)) FOR [IsSWAPAllowed]
GO
ALTER TABLE [dbo].[ItemMaster] ADD  CONSTRAINT [DF_ItemMaster_IsReplacementAllowed]  DEFAULT ((0)) FOR [IsReplacementAllowed]
GO
ALTER TABLE [dbo].[ItemMaster] ADD  CONSTRAINT [DF_ItemMaster_IsApprovalRequired]  DEFAULT ((0)) FOR [IsApprovalRequired]
GO
ALTER TABLE [dbo].[ItemMaster] ADD  CONSTRAINT [DF_ItemMaster_ReturnDays]  DEFAULT ((0)) FOR [ReturnDays]
GO
ALTER TABLE [dbo].[ItemMaster] ADD  CONSTRAINT [DF_ItemMaster_CreatedDate]  DEFAULT (getutcdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[ItemMaster] ADD  CONSTRAINT [DF_ItemMaster_ModifyDate]  DEFAULT (getutcdate()) FOR [ModifyDate]
GO
ALTER TABLE [dbo].[KeyFieldAutoGenRule] ADD  CONSTRAINT [DF_KeyFieldAutoGenRule_IsActive]  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[KeyFieldAutoGenRule] ADD  CONSTRAINT [DF_KeyFieldAutoGenRule_CreatedDate]  DEFAULT (getutcdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[KeyFieldAutoGenRule] ADD  CONSTRAINT [DF_KeyFieldAutoGenRule_ModifyDate]  DEFAULT (getutcdate()) FOR [ModifyDate]
GO
ALTER TABLE [dbo].[Language] ADD  CONSTRAINT [DF_Language_LanguageLocalizationAlias]  DEFAULT (N'en-US') FOR [Code]
GO
ALTER TABLE [dbo].[Language] ADD  CONSTRAINT [DF_Language_CreatedBy]  DEFAULT ((44)) FOR [CreatedBy]
GO
ALTER TABLE [dbo].[Language] ADD  CONSTRAINT [DF_Language_CreatedDate]  DEFAULT (getutcdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[Language] ADD  CONSTRAINT [DF_Language_ModifyBy]  DEFAULT ((44)) FOR [ModifyBy]
GO
ALTER TABLE [dbo].[Language] ADD  CONSTRAINT [DF_Language_ModifyDate]  DEFAULT (getutcdate()) FOR [ModifyDate]
GO
ALTER TABLE [dbo].[LanguageForm] ADD  CONSTRAINT [DF_LanguageForm_IsActive]  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[LanguageResource] ADD  CONSTRAINT [DF_LanguageResource_IsActive]  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[ModuleActionConfigValue] ADD  CONSTRAINT [DF_ModuleActionConfigValue_VersionNumber]  DEFAULT ('') FOR [VersionNumber]
GO
ALTER TABLE [dbo].[ModuleActionConfigValue] ADD  CONSTRAINT [DF_ModuleActionConfigValue_CreatedDate]  DEFAULT (getutcdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[ModuleActionConfigValue] ADD  CONSTRAINT [DF_ModuleActionConfigValue_ModifyDate]  DEFAULT (getutcdate()) FOR [ModifyDate]
GO
ALTER TABLE [dbo].[ModuleActionMap] ADD  CONSTRAINT [DF_ModuleActionMap_IsActive]  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[ModuleActionMap] ADD  CONSTRAINT [DF_ModuleActionMap_CreatedDate]  DEFAULT (getutcdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[ModuleActionMap] ADD  CONSTRAINT [DF_ModuleActionMap_ModifyDate]  DEFAULT (getutcdate()) FOR [ModifyDate]
GO
ALTER TABLE [dbo].[ModuleConfig] ADD  CONSTRAINT [DF_ModuleConfig_IsForModule]  DEFAULT ((0)) FOR [IsForModule]
GO
ALTER TABLE [dbo].[ModuleConfig] ADD  CONSTRAINT [DF_ModuleConfig_IsForAccount]  DEFAULT ((0)) FOR [IsForAccount]
GO
ALTER TABLE [dbo].[ModuleConfig] ADD  CONSTRAINT [DF_ModuleConfig_IsForItemMaster]  DEFAULT ((0)) FOR [IsForItemMaster]
GO
ALTER TABLE [dbo].[ModuleConfig] ADD  CONSTRAINT [DF_ModuleConfig_IsActive]  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[ModuleConfig] ADD  CONSTRAINT [DF_ModuleConfig_CreatedDate]  DEFAULT (getutcdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[ModuleConfig] ADD  CONSTRAINT [DF_ModuleConfig_ModifyDate]  DEFAULT (getutcdate()) FOR [ModifyDate]
GO
ALTER TABLE [dbo].[ModuleControlType] ADD  CONSTRAINT [DF_ModuleControlType_IsActive]  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[ModuleControlType] ADD  CONSTRAINT [DF_ModuleControlType_CreatedDate]  DEFAULT (getutcdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[ModuleControlType] ADD  CONSTRAINT [DF_ModuleControlType_ModifyDate]  DEFAULT (getutcdate()) FOR [ModifyDate]
GO
ALTER TABLE [dbo].[ModuleControlTypeValue] ADD  CONSTRAINT [DF_ModuleControlTypeValue_IsActive]  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[ModuleControlTypeValue] ADD  CONSTRAINT [DF_ModuleControlTypeValue_CreatedDate]  DEFAULT (getutcdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[ModuleControlTypeValue] ADD  CONSTRAINT [DF_ModuleControlTypeValue_ModifyDate]  DEFAULT (getutcdate()) FOR [ModifyDate]
GO
ALTER TABLE [dbo].[ModuleFunction] ADD  DEFAULT ((1)) FOR [isActive]
GO
ALTER TABLE [dbo].[ModuleRuleMap] ADD  CONSTRAINT [DF_ModuleRuleMap_isMandatory]  DEFAULT ((0)) FOR [isMandatory]
GO
ALTER TABLE [dbo].[ModuleStatusMap] ADD  CONSTRAINT [DF_ModuleStatusMap_IsActive]  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[ModuleStatusMap] ADD  CONSTRAINT [DF_ModuleStatusMap_CreatedDate]  DEFAULT (getutcdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[ModuleStatusMap] ADD  CONSTRAINT [DF_ModuleStatusMap_ModifyDate]  DEFAULT (getutcdate()) FOR [ModifyDate]
GO
ALTER TABLE [dbo].[ModuleWorkFlow] ADD  CONSTRAINT [DF_ModuleWorkFlow_ModuleConfigDate]  DEFAULT (getutcdate()) FOR [ModuleConfigDate]
GO
ALTER TABLE [dbo].[ModuleWorkFlow] ADD  CONSTRAINT [DF_ModuleWorkFlow_IsActive]  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[ModuleWorkFlow] ADD  CONSTRAINT [DF_ModuleWorkFlow_CreatedDate]  DEFAULT (getutcdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[ModuleWorkFlow] ADD  CONSTRAINT [DF_ModuleWorkFlow_ModifyDate]  DEFAULT (getutcdate()) FOR [ModifyDate]
GO
ALTER TABLE [dbo].[ModuleWorkFlowDetail] ADD  CONSTRAINT [DF_ModuleWorkFlowDetail_IsActive]  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[ModuleWorkFlowDetail] ADD  CONSTRAINT [DF_ModuleWorkFlowDetail_CreatedDate]  DEFAULT (getutcdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[ModuleWorkFlowDetail] ADD  CONSTRAINT [DF_ModuleWorkFlowDetail_ModifyDate]  DEFAULT (getutcdate()) FOR [ModifyDate]
GO
ALTER TABLE [dbo].[NotificationSchedule] ADD  CONSTRAINT [DF_NotificationSchedule_IsTextNotification]  DEFAULT ((0)) FOR [IsTextNotification]
GO
ALTER TABLE [dbo].[NotificationSchedule] ADD  CONSTRAINT [DF_NotificationSchedule_IsEmailNotification]  DEFAULT ((0)) FOR [IsEmailNotification]
GO
ALTER TABLE [dbo].[NotificationSchedule] ADD  CONSTRAINT [DF_NotificationSchedule_CreatedDate]  DEFAULT (getutcdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[NotificationSchedule] ADD  CONSTRAINT [DF_NotificationSchedule_ModifyDate]  DEFAULT (getutcdate()) FOR [ModifyDate]
GO
ALTER TABLE [dbo].[NotificationTemplate] ADD  CONSTRAINT [DF_NotificationTemplate_TemplateSubject]  DEFAULT ('') FOR [TemplateSubject]
GO
ALTER TABLE [dbo].[NotificationTemplate] ADD  CONSTRAINT [DF_NotificationTemplate_EnableSchedule]  DEFAULT ((0)) FOR [EnableSchedule]
GO
ALTER TABLE [dbo].[NotificationTemplate] ADD  CONSTRAINT [DF_NotificationTemplate_CreatedDate]  DEFAULT (getutcdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[NotificationTemplate] ADD  CONSTRAINT [DF_NotificationTemplate_IsActive]  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[NotificationTemplate] ADD  CONSTRAINT [DF_NotificationTemplate_ModifyDate]  DEFAULT (getutcdate()) FOR [ModifyDate]
GO
ALTER TABLE [dbo].[oauth_users] ADD  CONSTRAINT [DF_oauth_users_createddate]  DEFAULT (getutcdate()) FOR [createddate]
GO
ALTER TABLE [dbo].[oauth_users] ADD  CONSTRAINT [DF_oauth_users_modifieddate]  DEFAULT (getutcdate()) FOR [modifieddate]
GO
ALTER TABLE [dbo].[PartnerMultiLingualNavigationURLs] ADD  CONSTRAINT [DF_PartnerMultiLingualNavigationURLs_IsActive]  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[PartnerMultiLingualNavigationURLs] ADD  CONSTRAINT [DF_PartnerMultiLingualNavigationURLs_CreatedDate]  DEFAULT (getutcdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[PartnerMultiLingualNavigationURLs] ADD  CONSTRAINT [DF_PartnerMultiLingualNavigationURLs_ModifyDate]  DEFAULT (getutcdate()) FOR [ModifyDate]
GO
ALTER TABLE [dbo].[PartnerReturnReasonMap] ADD  CONSTRAINT [DF_PartnerReturnReasonMap_onCP]  DEFAULT ((0)) FOR [onCP]
GO
ALTER TABLE [dbo].[PartnerReturnReasonMap] ADD  CONSTRAINT [DF_PartnerReturnReasonMap_onBO]  DEFAULT ((0)) FOR [onBO]
GO
ALTER TABLE [dbo].[PartnerReturnReasonMap] ADD  CONSTRAINT [DF_PartnerReturnReasonMap_FileRequired]  DEFAULT ((0)) FOR [FileRequired]
GO
ALTER TABLE [dbo].[PartnerReturnReasonMap] ADD  CONSTRAINT [DF_PartnerReturnReasonMap_CommentRequired]  DEFAULT ((0)) FOR [CommentRequired]
GO
ALTER TABLE [dbo].[PartnerReturnReasonMap] ADD  CONSTRAINT [DF_PartnerReturnReasonMap_ApprovalRequired]  DEFAULT ((0)) FOR [ApprovalRequired]
GO
ALTER TABLE [dbo].[Partners] ADD  CONSTRAINT [DF_Partners_IsActive]  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[Partners] ADD  CONSTRAINT [DF_Partners_CreatedDate]  DEFAULT (getutcdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[Partners] ADD  CONSTRAINT [DF_Partners_ModifyDate]  DEFAULT (getutcdate()) FOR [ModifyDate]
GO
ALTER TABLE [dbo].[partners_faq] ADD  DEFAULT ((1)) FOR [is_active]
GO
ALTER TABLE [dbo].[PartnerUserRoleMap] ADD  CONSTRAINT [DF_PartnerUserRoleMap_isDefault]  DEFAULT ((0)) FOR [isDefault]
GO
ALTER TABLE [dbo].[PartnerUserRoleMap] ADD  CONSTRAINT [DF_PartnerUserRoleMap_IsActive]  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[PartnerUserRoleMap] ADD  CONSTRAINT [DF_PartnerUserRoleMap_CreatedDate]  DEFAULT (getutcdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[PartnerUserRoleMap] ADD  CONSTRAINT [DF_PartnerUserRoleMap_ModifyDate]  DEFAULT (getutcdate()) FOR [ModifyDate]
GO
ALTER TABLE [dbo].[Region] ADD  CONSTRAINT [DF_Region_ReturnArchive]  DEFAULT ((30)) FOR [ReturnArchive]
GO
ALTER TABLE [dbo].[Region] ADD  CONSTRAINT [DF_Region_PendingReturnArchive]  DEFAULT ((30)) FOR [PendingReturnArchive]
GO
ALTER TABLE [dbo].[Region] ADD  CONSTRAINT [DF_Region_IsActive]  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[Region] ADD  CONSTRAINT [DF_Region_CreatedDate]  DEFAULT (getutcdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[Region] ADD  CONSTRAINT [DF_Region_ModifyDate]  DEFAULT (getutcdate()) FOR [ModifyDate]
GO
ALTER TABLE [dbo].[repair_charges] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[repair_resolution] ADD  CONSTRAINT [DF_repair_resolution_isactive]  DEFAULT ((1)) FOR [isactive]
GO
ALTER TABLE [dbo].[ReturnReasonRuleMap] ADD  CONSTRAINT [DF_ReturnReasonRuleMap_UserInput]  DEFAULT ((1)) FOR [UserInput]
GO
ALTER TABLE [dbo].[RMAActionCode] ADD  CONSTRAINT [DF_RMAActionCode_onCP]  DEFAULT ((0)) FOR [onCP]
GO
ALTER TABLE [dbo].[RMAActionCode] ADD  CONSTRAINT [DF_RMAActionCode_onBO]  DEFAULT ((0)) FOR [onBO]
GO
ALTER TABLE [dbo].[RMAActionCode] ADD  CONSTRAINT [DF_RMAActionCode_FileRequired]  DEFAULT ((0)) FOR [FileRequired]
GO
ALTER TABLE [dbo].[RMAActionCode] ADD  CONSTRAINT [DF_RMAActionCode_CommentRequired]  DEFAULT ((0)) FOR [CommentRequired]
GO
ALTER TABLE [dbo].[RMAActionCode] ADD  CONSTRAINT [DF_RMAActionCode_ApprovalRequired]  DEFAULT ((0)) FOR [ApprovalRequired]
GO
ALTER TABLE [dbo].[RoleType] ADD  CONSTRAINT [DF_RoleType_InBuilt]  DEFAULT ((1)) FOR [InBuilt]
GO
ALTER TABLE [dbo].[Rules] ADD  CONSTRAINT [DF_Rules_SortOrder]  DEFAULT ((0)) FOR [SortOrder]
GO
ALTER TABLE [dbo].[SalePlan] ADD  CONSTRAINT [DF_SalePlan_CreatedDate]  DEFAULT (getutcdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[SalePlan] ADD  CONSTRAINT [DF_SalePlan_ModifiedBy]  DEFAULT (getutcdate()) FOR [ModifiedDate]
GO
ALTER TABLE [dbo].[SalePlan] ADD  DEFAULT ((0)) FOR [Salable]
GO
ALTER TABLE [dbo].[SalePlanModule] ADD  CONSTRAINT [DF_SalePlanModule_CreatedDate]  DEFAULT (getutcdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[SalePlanModule] ADD  CONSTRAINT [DF_SalePlanModule_ModifiedBy]  DEFAULT (getutcdate()) FOR [ModifiedDate]
GO
ALTER TABLE [dbo].[SAPOrder_MRNMap] ADD  CONSTRAINT [DF_SAPOrder_MRNMap_UploadedOn]  DEFAULT (getutcdate()) FOR [UploadedOn]
GO
ALTER TABLE [dbo].[SeasonalConfig] ADD  CONSTRAINT [DF_SeasonalConfig_IsActive]  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[TenantSalePlanMap] ADD  CONSTRAINT [DF_TenantSalePlanMap_CreatedDate]  DEFAULT (getutcdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[TenantSalePlanMap] ADD  CONSTRAINT [DF_TenantSalePlanMap_ModifiedBy]  DEFAULT (getutcdate()) FOR [ModifiedDate]
GO
ALTER TABLE [dbo].[TimeZone] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[TypeLookUp] ADD  CONSTRAINT [DF_TypeLookUp_IsActive]  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[TypeLookUp] ADD  CONSTRAINT [DF_TypeLookUp_CreatedDate]  DEFAULT (getutcdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[TypeLookUp] ADD  CONSTRAINT [DF_TypeLookUp_ModifyDate]  DEFAULT (getutcdate()) FOR [ModifyDate]
GO
ALTER TABLE [dbo].[User_Password_History] ADD  CONSTRAINT [DF_User_Password_History_PasswordChangeDate]  DEFAULT (getutcdate()) FOR [PasswordChangeDate]
GO
ALTER TABLE [dbo].[Users] ADD  CONSTRAINT [DF_User_TenantID]  DEFAULT ((1)) FOR [TenantID]
GO
ALTER TABLE [dbo].[Users] ADD  CONSTRAINT [DF_Users_CreatedDate]  DEFAULT (getutcdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[Users] ADD  CONSTRAINT [DF_Users_ModifiedDate]  DEFAULT (getutcdate()) FOR [ModifiedDate]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT ((0)) FOR [FailedLoginAttempt]
GO
ALTER TABLE [dbo].[Address]  WITH CHECK ADD  CONSTRAINT [FK_amer_Address_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[Address] CHECK CONSTRAINT [FK_amer_Address_Users_CreatedBy]
GO
ALTER TABLE [dbo].[Address]  WITH CHECK ADD  CONSTRAINT [FK_amer_Address_Users_ModifyBy] FOREIGN KEY([ModifyBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[Address] CHECK CONSTRAINT [FK_amer_Address_Users_ModifyBy]
GO
ALTER TABLE [dbo].[brand_language_map]  WITH CHECK ADD  CONSTRAINT [FK_brand_language_map_Partners] FOREIGN KEY([BrandID])
REFERENCES [dbo].[Partners] ([PartnerID])
GO
ALTER TABLE [dbo].[brand_language_map] CHECK CONSTRAINT [FK_brand_language_map_Partners]
GO
ALTER TABLE [dbo].[case_header]  WITH CHECK ADD  CONSTRAINT [FK_case_header_PreferedServiceLanguageID_Language_LanguageID] FOREIGN KEY([PreferedServiceLanguageID])
REFERENCES [dbo].[Language] ([LanguageID])
GO
ALTER TABLE [dbo].[case_header] CHECK CONSTRAINT [FK_case_header_PreferedServiceLanguageID_Language_LanguageID]
GO
ALTER TABLE [dbo].[CaseDetailIssueMap]  WITH CHECK ADD  CONSTRAINT [FK_CaseDetailIssueMap_CaseDetailID_case_detail_casedetailid] FOREIGN KEY([CaseDetailID])
REFERENCES [dbo].[case_detail] ([casedetailid])
GO
ALTER TABLE [dbo].[CaseDetailIssueMap] CHECK CONSTRAINT [FK_CaseDetailIssueMap_CaseDetailID_case_detail_casedetailid]
GO
ALTER TABLE [dbo].[CaseDetailIssueMap]  WITH CHECK ADD  CONSTRAINT [FK_CaseDetailIssueMap_CreatedBy_users_UserID] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[CaseDetailIssueMap] CHECK CONSTRAINT [FK_CaseDetailIssueMap_CreatedBy_users_UserID]
GO
ALTER TABLE [dbo].[CaseDetailIssueMap]  WITH CHECK ADD  CONSTRAINT [FK_CaseDetailIssueMap_IssueID_ReturnReasonIssue_ID] FOREIGN KEY([IssueID])
REFERENCES [dbo].[ReturnReasonIssue] ([ID])
GO
ALTER TABLE [dbo].[CaseDetailIssueMap] CHECK CONSTRAINT [FK_CaseDetailIssueMap_IssueID_ReturnReasonIssue_ID]
GO
ALTER TABLE [dbo].[CaseDetailIssueMap]  WITH CHECK ADD  CONSTRAINT [FK_CaseDetailIssueMap_ModifiedBy_users_UserID] FOREIGN KEY([ModifiedBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[CaseDetailIssueMap] CHECK CONSTRAINT [FK_CaseDetailIssueMap_ModifiedBy_users_UserID]
GO
ALTER TABLE [dbo].[CaseDetailIssueMap]  WITH CHECK ADD  CONSTRAINT [FK_CaseDetailIssueMap_ParentIssueID_ReturnReasonIssue_ID] FOREIGN KEY([ParentIssueID])
REFERENCES [dbo].[ReturnReasonIssue] ([ID])
GO
ALTER TABLE [dbo].[CaseDetailIssueMap] CHECK CONSTRAINT [FK_CaseDetailIssueMap_ParentIssueID_ReturnReasonIssue_ID]
GO
ALTER TABLE [dbo].[CaseDetailIssueMap]  WITH CHECK ADD  CONSTRAINT [FK_CaseDetailIssueMap_RootcauseID_ReturnReasonRootCause_ID] FOREIGN KEY([RootcauseID])
REFERENCES [dbo].[ReturnReasonRootCause] ([ID])
GO
ALTER TABLE [dbo].[CaseDetailIssueMap] CHECK CONSTRAINT [FK_CaseDetailIssueMap_RootcauseID_ReturnReasonRootCause_ID]
GO
ALTER TABLE [dbo].[CaseDetailLocationMap]  WITH CHECK ADD  CONSTRAINT [FK_CaseDetailLocationMap_CaseDetailID_case_detail_casedetailid] FOREIGN KEY([CaseDetailID])
REFERENCES [dbo].[case_detail] ([casedetailid])
GO
ALTER TABLE [dbo].[CaseDetailLocationMap] CHECK CONSTRAINT [FK_CaseDetailLocationMap_CaseDetailID_case_detail_casedetailid]
GO
ALTER TABLE [dbo].[CaseDetailLocationMap]  WITH CHECK ADD  CONSTRAINT [FK_CaseDetailLocationMap_CreatedBy_users_UserID] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[CaseDetailLocationMap] CHECK CONSTRAINT [FK_CaseDetailLocationMap_CreatedBy_users_UserID]
GO
ALTER TABLE [dbo].[CaseDetailLocationMap]  WITH CHECK ADD  CONSTRAINT [FK_CaseDetailLocationMap_LocationID_ReturnReasonLocation_ID] FOREIGN KEY([LocationID])
REFERENCES [dbo].[ReturnReasonLocation] ([ID])
GO
ALTER TABLE [dbo].[CaseDetailLocationMap] CHECK CONSTRAINT [FK_CaseDetailLocationMap_LocationID_ReturnReasonLocation_ID]
GO
ALTER TABLE [dbo].[CaseDetailLocationMap]  WITH CHECK ADD  CONSTRAINT [FK_CaseDetailLocationMap_ModifiedBy_users_UserID] FOREIGN KEY([ModifiedBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[CaseDetailLocationMap] CHECK CONSTRAINT [FK_CaseDetailLocationMap_ModifiedBy_users_UserID]
GO
ALTER TABLE [dbo].[Category]  WITH CHECK ADD  CONSTRAINT [FK_Category_CreatedBy_users_UserID] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[Category] CHECK CONSTRAINT [FK_Category_CreatedBy_users_UserID]
GO
ALTER TABLE [dbo].[Category]  WITH CHECK ADD  CONSTRAINT [FK_Category_ModifiedBy_users_UserID] FOREIGN KEY([ModifiedBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[Category] CHECK CONSTRAINT [FK_Category_ModifiedBy_users_UserID]
GO
ALTER TABLE [dbo].[City]  WITH CHECK ADD  CONSTRAINT [FK_city_country_id_country_CountryID] FOREIGN KEY([CountryID])
REFERENCES [dbo].[Country] ([CountryID])
GO
ALTER TABLE [dbo].[City] CHECK CONSTRAINT [FK_city_country_id_country_CountryID]
GO
ALTER TABLE [dbo].[City]  WITH CHECK ADD  CONSTRAINT [FK_city_state_id_state_StateID] FOREIGN KEY([StateID])
REFERENCES [dbo].[State] ([StateID])
GO
ALTER TABLE [dbo].[City] CHECK CONSTRAINT [FK_city_state_id_state_StateID]
GO
ALTER TABLE [dbo].[consumer_return_detail]  WITH CHECK ADD  CONSTRAINT [FK_consumer_return_detail_consumer_return_header] FOREIGN KEY([request_header_id])
REFERENCES [dbo].[consumer_return_header] ([request_header_id])
GO
ALTER TABLE [dbo].[consumer_return_detail] CHECK CONSTRAINT [FK_consumer_return_detail_consumer_return_header]
GO
ALTER TABLE [dbo].[Country]  WITH CHECK ADD  CONSTRAINT [FK_country_created_by_users_UserID] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[Country] CHECK CONSTRAINT [FK_country_created_by_users_UserID]
GO
ALTER TABLE [dbo].[Country]  WITH CHECK ADD  CONSTRAINT [FK_country_RegionID_Region_RegionID] FOREIGN KEY([RegionID])
REFERENCES [dbo].[Region] ([RegionID])
GO
ALTER TABLE [dbo].[Country] CHECK CONSTRAINT [FK_country_RegionID_Region_RegionID]
GO
ALTER TABLE [dbo].[Country]  WITH CHECK ADD  CONSTRAINT [FK_country_updated_by_users_UserID] FOREIGN KEY([ModifyBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[Country] CHECK CONSTRAINT [FK_country_updated_by_users_UserID]
GO
ALTER TABLE [dbo].[CountryConfigMap]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_CountryConfigMap_Country_CountryID] FOREIGN KEY([CountryID])
REFERENCES [dbo].[Country] ([CountryID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[CountryConfigMap] CHECK CONSTRAINT [FK_ameruat_CountryConfigMap_Country_CountryID]
GO
ALTER TABLE [dbo].[CountryConfigMap]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_CountryConfigMap_TypeLookUp_TypeLookupID] FOREIGN KEY([TypeLookupID])
REFERENCES [dbo].[TypeLookUp] ([TypeLookUpID])
GO
ALTER TABLE [dbo].[CountryConfigMap] CHECK CONSTRAINT [FK_ameruat_CountryConfigMap_TypeLookUp_TypeLookupID]
GO
ALTER TABLE [dbo].[CountryConfigMap]  WITH NOCHECK ADD  CONSTRAINT [FK_CountryConfigMap_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[CountryConfigMap] CHECK CONSTRAINT [FK_CountryConfigMap_Users_CreatedBy]
GO
ALTER TABLE [dbo].[CountryConfigMap]  WITH NOCHECK ADD  CONSTRAINT [FK_CountryConfigMap_Users_ModifyBy] FOREIGN KEY([ModifyBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[CountryConfigMap] CHECK CONSTRAINT [FK_CountryConfigMap_Users_ModifyBy]
GO
ALTER TABLE [dbo].[Currency]  WITH NOCHECK ADD  CONSTRAINT [FK_Currency_CreatedBy_User_UserID] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[Currency] CHECK CONSTRAINT [FK_Currency_CreatedBy_User_UserID]
GO
ALTER TABLE [dbo].[Currency]  WITH NOCHECK ADD  CONSTRAINT [FK_Currency_ModifyBy_User_UserID] FOREIGN KEY([ModifyBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[Currency] CHECK CONSTRAINT [FK_Currency_ModifyBy_User_UserID]
GO
ALTER TABLE [dbo].[customer_info]  WITH CHECK ADD  CONSTRAINT [FK_customer_info_countryId] FOREIGN KEY([countryId])
REFERENCES [dbo].[Country] ([CountryID])
GO
ALTER TABLE [dbo].[customer_info] CHECK CONSTRAINT [FK_customer_info_countryId]
GO
ALTER TABLE [dbo].[ErrorLog]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_ErrorLog_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[ErrorLog] CHECK CONSTRAINT [FK_ameruat_ErrorLog_Users_CreatedBy]
GO
ALTER TABLE [dbo].[Facility]  WITH CHECK ADD  CONSTRAINT [FK_amer_Facility_TypeLookUp_FacilityTypeID] FOREIGN KEY([FacilityTypeID])
REFERENCES [dbo].[TypeLookUp] ([TypeLookUpID])
GO
ALTER TABLE [dbo].[Facility] CHECK CONSTRAINT [FK_amer_Facility_TypeLookUp_FacilityTypeID]
GO
ALTER TABLE [dbo].[Facility]  WITH CHECK ADD  CONSTRAINT [FK_amer_Facility_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[Facility] CHECK CONSTRAINT [FK_amer_Facility_Users_CreatedBy]
GO
ALTER TABLE [dbo].[Facility]  WITH CHECK ADD  CONSTRAINT [FK_amer_Facility_Users_ModifyBy] FOREIGN KEY([ModifyBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[Facility] CHECK CONSTRAINT [FK_amer_Facility_Users_ModifyBy]
GO
ALTER TABLE [dbo].[FormField]  WITH NOCHECK ADD  CONSTRAINT [FK_FormField_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[FormField] CHECK CONSTRAINT [FK_FormField_Users_CreatedBy]
GO
ALTER TABLE [dbo].[FormField]  WITH NOCHECK ADD  CONSTRAINT [FK_FormField_Users_ModifyBy] FOREIGN KEY([ModifyBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[FormField] CHECK CONSTRAINT [FK_FormField_Users_ModifyBy]
GO
ALTER TABLE [dbo].[FormFieldLanguageMap]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_FormFieldLanguageMap_FormField_FormFieldID] FOREIGN KEY([FormFieldID])
REFERENCES [dbo].[FormField] ([FormFieldID])
GO
ALTER TABLE [dbo].[FormFieldLanguageMap] CHECK CONSTRAINT [FK_ameruat_FormFieldLanguageMap_FormField_FormFieldID]
GO
ALTER TABLE [dbo].[ga_request_detail]  WITH CHECK ADD  CONSTRAINT [FK_ga_request_detail_ga_request_header] FOREIGN KEY([request_header_id])
REFERENCES [dbo].[ga_request_header] ([request_header_id])
GO
ALTER TABLE [dbo].[ga_request_detail] CHECK CONSTRAINT [FK_ga_request_detail_ga_request_header]
GO
ALTER TABLE [dbo].[ItemMaster]  WITH CHECK ADD  CONSTRAINT [FK_amer_ItemMaster_TypeLookUp_ItemReceiveTypeID] FOREIGN KEY([ItemReceiveTypeID])
REFERENCES [dbo].[TypeLookUp] ([TypeLookUpID])
GO
ALTER TABLE [dbo].[ItemMaster] CHECK CONSTRAINT [FK_amer_ItemMaster_TypeLookUp_ItemReceiveTypeID]
GO
ALTER TABLE [dbo].[ItemMaster]  WITH CHECK ADD  CONSTRAINT [FK_amer_ItemMaster_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[ItemMaster] CHECK CONSTRAINT [FK_amer_ItemMaster_Users_CreatedBy]
GO
ALTER TABLE [dbo].[ItemMaster]  WITH CHECK ADD  CONSTRAINT [FK_amer_ItemMaster_Users_ModifyBy] FOREIGN KEY([ModifyBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[ItemMaster] CHECK CONSTRAINT [FK_amer_ItemMaster_Users_ModifyBy]
GO
ALTER TABLE [dbo].[ItemMaster]  WITH NOCHECK ADD  CONSTRAINT [FK_itemmaster_ColorID_Color_ColorID] FOREIGN KEY([ColorID])
REFERENCES [dbo].[Color] ([ColorID])
GO
ALTER TABLE [dbo].[ItemMaster] CHECK CONSTRAINT [FK_itemmaster_ColorID_Color_ColorID]
GO
ALTER TABLE [dbo].[ItemMaster]  WITH NOCHECK ADD  CONSTRAINT [FK_itemmaster_ManufacturerID_Manufacturer+ManufacturerID] FOREIGN KEY([ManufacturerID])
REFERENCES [dbo].[Manufacturer] ([ManufacturerID])
GO
ALTER TABLE [dbo].[ItemMaster] CHECK CONSTRAINT [FK_itemmaster_ManufacturerID_Manufacturer+ManufacturerID]
GO
ALTER TABLE [dbo].[ItemMaster]  WITH NOCHECK ADD  CONSTRAINT [FK_itemmaster_UOMID_UOMMaster_UOMID] FOREIGN KEY([UOMID])
REFERENCES [dbo].[UOMMaster] ([UOMID])
GO
ALTER TABLE [dbo].[ItemMaster] CHECK CONSTRAINT [FK_itemmaster_UOMID_UOMMaster_UOMID]
GO
ALTER TABLE [dbo].[KeyFieldAutoGenRule]  WITH NOCHECK ADD  CONSTRAINT [FK_KeyFieldAutoGenRule_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[KeyFieldAutoGenRule] CHECK CONSTRAINT [FK_KeyFieldAutoGenRule_Users_CreatedBy]
GO
ALTER TABLE [dbo].[KeyFieldAutoGenRule]  WITH NOCHECK ADD  CONSTRAINT [FK_KeyFieldAutoGenRule_Users_ModifyBy] FOREIGN KEY([ModifyBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[KeyFieldAutoGenRule] CHECK CONSTRAINT [FK_KeyFieldAutoGenRule_Users_ModifyBy]
GO
ALTER TABLE [dbo].[LanguageResource]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_LanguageResource_LanguageForm_FormID] FOREIGN KEY([FormID])
REFERENCES [dbo].[LanguageForm] ([ID])
GO
ALTER TABLE [dbo].[LanguageResource] CHECK CONSTRAINT [FK_ameruat_LanguageResource_LanguageForm_FormID]
GO
ALTER TABLE [dbo].[LanguageResource]  WITH NOCHECK ADD  CONSTRAINT [FK_LanguageResource_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[LanguageResource] CHECK CONSTRAINT [FK_LanguageResource_Users_CreatedBy]
GO
ALTER TABLE [dbo].[LanguageResource]  WITH NOCHECK ADD  CONSTRAINT [FK_LanguageResource_Users_UpdatedBy] FOREIGN KEY([UpdatedBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[LanguageResource] CHECK CONSTRAINT [FK_LanguageResource_Users_UpdatedBy]
GO
ALTER TABLE [dbo].[Module]  WITH CHECK ADD  CONSTRAINT [FK_Module_CreatedBy_users_UserID] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[Module] CHECK CONSTRAINT [FK_Module_CreatedBy_users_UserID]
GO
ALTER TABLE [dbo].[Module]  WITH CHECK ADD  CONSTRAINT [FK_Module_ParentModuleID_Module_ModuleID] FOREIGN KEY([ParentModuleID])
REFERENCES [dbo].[Module] ([ModuleID])
GO
ALTER TABLE [dbo].[Module] CHECK CONSTRAINT [FK_Module_ParentModuleID_Module_ModuleID]
GO
ALTER TABLE [dbo].[Module]  WITH CHECK ADD  CONSTRAINT [FK_Module_UpdatedBy_users_UserID] FOREIGN KEY([UpdatedBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[Module] CHECK CONSTRAINT [FK_Module_UpdatedBy_users_UserID]
GO
ALTER TABLE [dbo].[ModuleActionConfigValue]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_ModuleActionConfigValue_ModuleConfig_ModuleConfigID] FOREIGN KEY([ModuleConfigID])
REFERENCES [dbo].[ModuleConfig] ([ModuleConfigID])
GO
ALTER TABLE [dbo].[ModuleActionConfigValue] CHECK CONSTRAINT [FK_ameruat_ModuleActionConfigValue_ModuleConfig_ModuleConfigID]
GO
ALTER TABLE [dbo].[ModuleActionConfigValue]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_ModuleActionConfigValue_ModuleControlTypeValue_ModuleControlTypeValueID] FOREIGN KEY([ModuleControlTypeValueID])
REFERENCES [dbo].[ModuleControlTypeValue] ([ModuleControlTypeValueID])
GO
ALTER TABLE [dbo].[ModuleActionConfigValue] CHECK CONSTRAINT [FK_ameruat_ModuleActionConfigValue_ModuleControlTypeValue_ModuleControlTypeValueID]
GO
ALTER TABLE [dbo].[ModuleActionConfigValue]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_ModuleActionConfigValue_ModuleWorkFlow_ModuleActionID] FOREIGN KEY([ModuleActionID])
REFERENCES [dbo].[ModuleWorkFlow] ([ModuleWorkFlowID])
GO
ALTER TABLE [dbo].[ModuleActionConfigValue] CHECK CONSTRAINT [FK_ameruat_ModuleActionConfigValue_ModuleWorkFlow_ModuleActionID]
GO
ALTER TABLE [dbo].[ModuleActionConfigValue]  WITH NOCHECK ADD  CONSTRAINT [FK_ModuleActionConfigValue_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[ModuleActionConfigValue] CHECK CONSTRAINT [FK_ModuleActionConfigValue_Users_CreatedBy]
GO
ALTER TABLE [dbo].[ModuleActionConfigValue]  WITH NOCHECK ADD  CONSTRAINT [FK_ModuleActionConfigValue_Users_ModifyBy] FOREIGN KEY([ModifyBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[ModuleActionConfigValue] CHECK CONSTRAINT [FK_ModuleActionConfigValue_Users_ModifyBy]
GO
ALTER TABLE [dbo].[ModuleActionMap]  WITH NOCHECK ADD  CONSTRAINT [FK_ModuleActionMap_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[ModuleActionMap] CHECK CONSTRAINT [FK_ModuleActionMap_Users_CreatedBy]
GO
ALTER TABLE [dbo].[ModuleActionMap]  WITH NOCHECK ADD  CONSTRAINT [FK_ModuleActionMap_Users_ModifyBy] FOREIGN KEY([ModifyBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[ModuleActionMap] CHECK CONSTRAINT [FK_ModuleActionMap_Users_ModifyBy]
GO
ALTER TABLE [dbo].[ModuleConfig]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_ModuleConfig_ModuleConfig_ParentModuleConfigID] FOREIGN KEY([ParentModuleConfigID])
REFERENCES [dbo].[ModuleConfig] ([ModuleConfigID])
GO
ALTER TABLE [dbo].[ModuleConfig] CHECK CONSTRAINT [FK_ameruat_ModuleConfig_ModuleConfig_ParentModuleConfigID]
GO
ALTER TABLE [dbo].[ModuleConfig]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_ModuleConfig_ModuleControlType_ModuleControlTypeID] FOREIGN KEY([ModuleControlTypeID])
REFERENCES [dbo].[ModuleControlType] ([ModuleControlTypeID])
GO
ALTER TABLE [dbo].[ModuleConfig] CHECK CONSTRAINT [FK_ameruat_ModuleConfig_ModuleControlType_ModuleControlTypeID]
GO
ALTER TABLE [dbo].[ModuleConfig]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_ModuleConfig_TypeLookUp_TypeLookUpID] FOREIGN KEY([TypeLookUpID])
REFERENCES [dbo].[TypeLookUp] ([TypeLookUpID])
GO
ALTER TABLE [dbo].[ModuleConfig] CHECK CONSTRAINT [FK_ameruat_ModuleConfig_TypeLookUp_TypeLookUpID]
GO
ALTER TABLE [dbo].[ModuleConfig]  WITH NOCHECK ADD  CONSTRAINT [FK_ModuleConfig_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[ModuleConfig] CHECK CONSTRAINT [FK_ModuleConfig_Users_CreatedBy]
GO
ALTER TABLE [dbo].[ModuleConfig]  WITH NOCHECK ADD  CONSTRAINT [FK_ModuleConfig_Users_ModifyBy] FOREIGN KEY([ModifyBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[ModuleConfig] CHECK CONSTRAINT [FK_ModuleConfig_Users_ModifyBy]
GO
ALTER TABLE [dbo].[ModuleControlType]  WITH NOCHECK ADD  CONSTRAINT [FK_ModuleControlType_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[ModuleControlType] CHECK CONSTRAINT [FK_ModuleControlType_Users_CreatedBy]
GO
ALTER TABLE [dbo].[ModuleControlType]  WITH NOCHECK ADD  CONSTRAINT [FK_ModuleControlType_Users_ModifyBy] FOREIGN KEY([ModifyBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[ModuleControlType] CHECK CONSTRAINT [FK_ModuleControlType_Users_ModifyBy]
GO
ALTER TABLE [dbo].[ModuleControlTypeValue]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_ModuleControlTypeValue_ModuleControlType_ModuleControlTypeID] FOREIGN KEY([ModuleControlTypeID])
REFERENCES [dbo].[ModuleControlType] ([ModuleControlTypeID])
GO
ALTER TABLE [dbo].[ModuleControlTypeValue] CHECK CONSTRAINT [FK_ameruat_ModuleControlTypeValue_ModuleControlType_ModuleControlTypeID]
GO
ALTER TABLE [dbo].[ModuleControlTypeValue]  WITH NOCHECK ADD  CONSTRAINT [FK_ModuleControlTypeValue_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[ModuleControlTypeValue] CHECK CONSTRAINT [FK_ModuleControlTypeValue_Users_CreatedBy]
GO
ALTER TABLE [dbo].[ModuleControlTypeValue]  WITH NOCHECK ADD  CONSTRAINT [FK_ModuleControlTypeValue_Users_ModifyBy] FOREIGN KEY([ModifyBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[ModuleControlTypeValue] CHECK CONSTRAINT [FK_ModuleControlTypeValue_Users_ModifyBy]
GO
ALTER TABLE [dbo].[ModuleFunction]  WITH CHECK ADD  CONSTRAINT [FK_ModuleFunction_CreatedBy_users_UserID] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[ModuleFunction] CHECK CONSTRAINT [FK_ModuleFunction_CreatedBy_users_UserID]
GO
ALTER TABLE [dbo].[ModuleFunction]  WITH CHECK ADD  CONSTRAINT [FK_ModuleFunction_ModifiedBy_users_UserID] FOREIGN KEY([ModifiedBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[ModuleFunction] CHECK CONSTRAINT [FK_ModuleFunction_ModifiedBy_users_UserID]
GO
ALTER TABLE [dbo].[ModuleFunction]  WITH CHECK ADD  CONSTRAINT [FK_ModuleFunction_Module] FOREIGN KEY([ModuleID])
REFERENCES [dbo].[Module] ([ModuleID])
GO
ALTER TABLE [dbo].[ModuleFunction] CHECK CONSTRAINT [FK_ModuleFunction_Module]
GO
ALTER TABLE [dbo].[ModuleRuleMap]  WITH NOCHECK ADD  CONSTRAINT [FK_ModuleRuleMap_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[ModuleRuleMap] CHECK CONSTRAINT [FK_ModuleRuleMap_Users_CreatedBy]
GO
ALTER TABLE [dbo].[ModuleRuleMap]  WITH NOCHECK ADD  CONSTRAINT [FK_ModuleRuleMap_Users_ModifyBy] FOREIGN KEY([ModifyBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[ModuleRuleMap] CHECK CONSTRAINT [FK_ModuleRuleMap_Users_ModifyBy]
GO
ALTER TABLE [dbo].[ModuleStatusMap]  WITH NOCHECK ADD  CONSTRAINT [FK_ModuleStatusMap_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[ModuleStatusMap] CHECK CONSTRAINT [FK_ModuleStatusMap_Users_CreatedBy]
GO
ALTER TABLE [dbo].[ModuleStatusMap]  WITH NOCHECK ADD  CONSTRAINT [FK_ModuleStatusMap_Users_ModifyBy] FOREIGN KEY([ModifyBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[ModuleStatusMap] CHECK CONSTRAINT [FK_ModuleStatusMap_Users_ModifyBy]
GO
ALTER TABLE [dbo].[ModuleWorkFlow]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_ModuleWorkFlow_TypeLookUp_OrderSubTypeLookUpID] FOREIGN KEY([OrderSubTypeLookUpID])
REFERENCES [dbo].[TypeLookUp] ([TypeLookUpID])
GO
ALTER TABLE [dbo].[ModuleWorkFlow] CHECK CONSTRAINT [FK_ameruat_ModuleWorkFlow_TypeLookUp_OrderSubTypeLookUpID]
GO
ALTER TABLE [dbo].[ModuleWorkFlow]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_ModuleWorkFlow_TypeLookUp_OrderTypeLookUpID] FOREIGN KEY([OrderTypeLookUpID])
REFERENCES [dbo].[TypeLookUp] ([TypeLookUpID])
GO
ALTER TABLE [dbo].[ModuleWorkFlow] CHECK CONSTRAINT [FK_ameruat_ModuleWorkFlow_TypeLookUp_OrderTypeLookUpID]
GO
ALTER TABLE [dbo].[ModuleWorkFlow]  WITH NOCHECK ADD  CONSTRAINT [FK_ModuleWorkFlow_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[ModuleWorkFlow] CHECK CONSTRAINT [FK_ModuleWorkFlow_Users_CreatedBy]
GO
ALTER TABLE [dbo].[ModuleWorkFlow]  WITH NOCHECK ADD  CONSTRAINT [FK_ModuleWorkFlow_Users_ModifyBy] FOREIGN KEY([ModifyBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[ModuleWorkFlow] CHECK CONSTRAINT [FK_ModuleWorkFlow_Users_ModifyBy]
GO
ALTER TABLE [dbo].[ModuleWorkFlowDetail]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_ModuleWorkFlowDetail_ModuleActionMap_ModuleActionMapID] FOREIGN KEY([ModuleActionMapID])
REFERENCES [dbo].[ModuleActionMap] ([ModuleActionMapID])
GO
ALTER TABLE [dbo].[ModuleWorkFlowDetail] CHECK CONSTRAINT [FK_ameruat_ModuleWorkFlowDetail_ModuleActionMap_ModuleActionMapID]
GO
ALTER TABLE [dbo].[ModuleWorkFlowDetail]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_ModuleWorkFlowDetail_ModuleStatusMap_CurrentModuleStatusMapID] FOREIGN KEY([CurrentModuleStatusMapID])
REFERENCES [dbo].[ModuleStatusMap] ([ModuleStatusMapID])
GO
ALTER TABLE [dbo].[ModuleWorkFlowDetail] CHECK CONSTRAINT [FK_ameruat_ModuleWorkFlowDetail_ModuleStatusMap_CurrentModuleStatusMapID]
GO
ALTER TABLE [dbo].[ModuleWorkFlowDetail]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_ModuleWorkFlowDetail_ModuleStatusMap_NextModuleStatusMapID] FOREIGN KEY([NextModuleStatusMapID])
REFERENCES [dbo].[ModuleStatusMap] ([ModuleStatusMapID])
GO
ALTER TABLE [dbo].[ModuleWorkFlowDetail] CHECK CONSTRAINT [FK_ameruat_ModuleWorkFlowDetail_ModuleStatusMap_NextModuleStatusMapID]
GO
ALTER TABLE [dbo].[ModuleWorkFlowDetail]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_ModuleWorkFlowDetail_ModuleWorkFlow_ModuleWorkFlowID] FOREIGN KEY([ModuleWorkFlowID])
REFERENCES [dbo].[ModuleWorkFlow] ([ModuleWorkFlowID])
GO
ALTER TABLE [dbo].[ModuleWorkFlowDetail] CHECK CONSTRAINT [FK_ameruat_ModuleWorkFlowDetail_ModuleWorkFlow_ModuleWorkFlowID]
GO
ALTER TABLE [dbo].[ModuleWorkFlowDetail]  WITH NOCHECK ADD  CONSTRAINT [FK_ModuleWorkFlowDetail_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[ModuleWorkFlowDetail] CHECK CONSTRAINT [FK_ModuleWorkFlowDetail_Users_CreatedBy]
GO
ALTER TABLE [dbo].[ModuleWorkFlowDetail]  WITH NOCHECK ADD  CONSTRAINT [FK_ModuleWorkFlowDetail_Users_ModifyBy] FOREIGN KEY([ModifyBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[ModuleWorkFlowDetail] CHECK CONSTRAINT [FK_ModuleWorkFlowDetail_Users_ModifyBy]
GO
ALTER TABLE [dbo].[NotificationSchedule]  WITH CHECK ADD  CONSTRAINT [FK_amer_NotificationSchedule_NotificationTemplate_NotificationTemplateID] FOREIGN KEY([NotificationTemplateID])
REFERENCES [dbo].[NotificationTemplate] ([ID])
GO
ALTER TABLE [dbo].[NotificationSchedule] CHECK CONSTRAINT [FK_amer_NotificationSchedule_NotificationTemplate_NotificationTemplateID]
GO
ALTER TABLE [dbo].[NotificationSchedule]  WITH CHECK ADD  CONSTRAINT [FK_amer_NotificationSchedule_TypeLookUp_SchdeuleDayTypeLookUpID1] FOREIGN KEY([SchdeuleDayTypeLookUpID1])
REFERENCES [dbo].[TypeLookUp] ([TypeLookUpID])
GO
ALTER TABLE [dbo].[NotificationSchedule] CHECK CONSTRAINT [FK_amer_NotificationSchedule_TypeLookUp_SchdeuleDayTypeLookUpID1]
GO
ALTER TABLE [dbo].[NotificationSchedule]  WITH CHECK ADD  CONSTRAINT [FK_amer_NotificationSchedule_TypeLookUp_SchdeuleDayTypeLookUpID2] FOREIGN KEY([SchdeuleDayTypeLookUpID2])
REFERENCES [dbo].[TypeLookUp] ([TypeLookUpID])
GO
ALTER TABLE [dbo].[NotificationSchedule] CHECK CONSTRAINT [FK_amer_NotificationSchedule_TypeLookUp_SchdeuleDayTypeLookUpID2]
GO
ALTER TABLE [dbo].[NotificationSchedule]  WITH CHECK ADD  CONSTRAINT [FK_amer_NotificationSchedule_TypeLookUp_SchdeuleDayTypeLookUpID3] FOREIGN KEY([SchdeuleDayTypeLookUpID3])
REFERENCES [dbo].[TypeLookUp] ([TypeLookUpID])
GO
ALTER TABLE [dbo].[NotificationSchedule] CHECK CONSTRAINT [FK_amer_NotificationSchedule_TypeLookUp_SchdeuleDayTypeLookUpID3]
GO
ALTER TABLE [dbo].[NotificationSchedule]  WITH NOCHECK ADD  CONSTRAINT [FK_NotificationSchedule_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[NotificationSchedule] CHECK CONSTRAINT [FK_NotificationSchedule_Users_CreatedBy]
GO
ALTER TABLE [dbo].[NotificationSchedule]  WITH NOCHECK ADD  CONSTRAINT [FK_NotificationSchedule_Users_ModifyBy] FOREIGN KEY([ModifyBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[NotificationSchedule] CHECK CONSTRAINT [FK_NotificationSchedule_Users_ModifyBy]
GO
ALTER TABLE [dbo].[NotificationTemplate]  WITH NOCHECK ADD  CONSTRAINT [FK_NotificationTemplate_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[NotificationTemplate] CHECK CONSTRAINT [FK_NotificationTemplate_Users_CreatedBy]
GO
ALTER TABLE [dbo].[NotificationTemplate]  WITH NOCHECK ADD  CONSTRAINT [FK_NotificationTemplate_Users_ModifyBy] FOREIGN KEY([ModifyBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[NotificationTemplate] CHECK CONSTRAINT [FK_NotificationTemplate_Users_ModifyBy]
GO
ALTER TABLE [dbo].[NotificationTemplateKey]  WITH CHECK ADD  CONSTRAINT [FK_amer_NotificationTemplateKey_NotificationTemplate_NotificationTemplateID] FOREIGN KEY([NotificationTemplateID])
REFERENCES [dbo].[NotificationTemplate] ([ID])
GO
ALTER TABLE [dbo].[NotificationTemplateKey] CHECK CONSTRAINT [FK_amer_NotificationTemplateKey_NotificationTemplate_NotificationTemplateID]
GO
ALTER TABLE [dbo].[oauth_access_tokens]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_oauth_access_tokens_oauth_clients_client_id] FOREIGN KEY([client_id])
REFERENCES [dbo].[oauth_clients] ([id])
ON UPDATE CASCADE
ON DELETE SET NULL
GO
ALTER TABLE [dbo].[oauth_access_tokens] CHECK CONSTRAINT [FK_ameruat_oauth_access_tokens_oauth_clients_client_id]
GO
ALTER TABLE [dbo].[oauth_authorization_codes]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_oauth_authorization_codes_oauth_clients_client_id] FOREIGN KEY([client_id])
REFERENCES [dbo].[oauth_clients] ([id])
ON UPDATE CASCADE
ON DELETE SET NULL
GO
ALTER TABLE [dbo].[oauth_authorization_codes] CHECK CONSTRAINT [FK_ameruat_oauth_authorization_codes_oauth_clients_client_id]
GO
ALTER TABLE [dbo].[oauth_refresh_tokens]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_oauth_refresh_tokens_oauth_clients_client_id] FOREIGN KEY([client_id])
REFERENCES [dbo].[oauth_clients] ([id])
ON UPDATE CASCADE
ON DELETE SET NULL
GO
ALTER TABLE [dbo].[oauth_refresh_tokens] CHECK CONSTRAINT [FK_ameruat_oauth_refresh_tokens_oauth_clients_client_id]
GO
ALTER TABLE [dbo].[outbound_log]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_outbound_log_TypeLookUp_status_id] FOREIGN KEY([status_id])
REFERENCES [dbo].[TypeLookUp] ([TypeLookUpID])
GO
ALTER TABLE [dbo].[outbound_log] CHECK CONSTRAINT [FK_ameruat_outbound_log_TypeLookUp_status_id]
GO
ALTER TABLE [dbo].[PartnerAddressMap]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_PartnerAddressMap_Partners_PartnerID] FOREIGN KEY([PartnerID])
REFERENCES [dbo].[Partners] ([PartnerID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[PartnerAddressMap] CHECK CONSTRAINT [FK_ameruat_PartnerAddressMap_Partners_PartnerID]
GO
ALTER TABLE [dbo].[PartnerAddressMap]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_PartnerAddressMap_TypeLookUp_AddressTypeID] FOREIGN KEY([AddressTypeID])
REFERENCES [dbo].[TypeLookUp] ([TypeLookUpID])
GO
ALTER TABLE [dbo].[PartnerAddressMap] CHECK CONSTRAINT [FK_ameruat_PartnerAddressMap_TypeLookUp_AddressTypeID]
GO
ALTER TABLE [dbo].[PartnerAddressMap]  WITH NOCHECK ADD  CONSTRAINT [FK_PartnerAddressMap_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[PartnerAddressMap] CHECK CONSTRAINT [FK_PartnerAddressMap_Users_CreatedBy]
GO
ALTER TABLE [dbo].[PartnerAddressMap]  WITH NOCHECK ADD  CONSTRAINT [FK_PartnerAddressMap_Users_ModifyBy] FOREIGN KEY([ModifyBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[PartnerAddressMap] CHECK CONSTRAINT [FK_PartnerAddressMap_Users_ModifyBy]
GO
ALTER TABLE [dbo].[PartnerConfigMap]  WITH CHECK ADD  CONSTRAINT [FK_amer_PartnerConfigMap_Partners_PartnerID] FOREIGN KEY([PartnerID])
REFERENCES [dbo].[Partners] ([PartnerID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[PartnerConfigMap] CHECK CONSTRAINT [FK_amer_PartnerConfigMap_Partners_PartnerID]
GO
ALTER TABLE [dbo].[PartnerConfigMap]  WITH CHECK ADD  CONSTRAINT [FK_amer_PartnerConfigMap_TypeLookUp_ConfigID] FOREIGN KEY([ConfigID])
REFERENCES [dbo].[TypeLookUp] ([TypeLookUpID])
GO
ALTER TABLE [dbo].[PartnerConfigMap] CHECK CONSTRAINT [FK_amer_PartnerConfigMap_TypeLookUp_ConfigID]
GO
ALTER TABLE [dbo].[PartnerConfigMap]  WITH NOCHECK ADD  CONSTRAINT [FK_PartnerConfigMap_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[PartnerConfigMap] CHECK CONSTRAINT [FK_PartnerConfigMap_Users_CreatedBy]
GO
ALTER TABLE [dbo].[PartnerConfigMap]  WITH NOCHECK ADD  CONSTRAINT [FK_PartnerConfigMap_Users_ModifyBy] FOREIGN KEY([ModifyBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[PartnerConfigMap] CHECK CONSTRAINT [FK_PartnerConfigMap_Users_ModifyBy]
GO
ALTER TABLE [dbo].[PartnerFacilityMap]  WITH CHECK ADD  CONSTRAINT [FK_amer_PartnerFacilityMap_Facility_FacilityID] FOREIGN KEY([FacilityID])
REFERENCES [dbo].[Facility] ([FacilityID])
GO
ALTER TABLE [dbo].[PartnerFacilityMap] CHECK CONSTRAINT [FK_amer_PartnerFacilityMap_Facility_FacilityID]
GO
ALTER TABLE [dbo].[PartnerFacilityMap]  WITH CHECK ADD  CONSTRAINT [FK_amer_PartnerFacilityMap_Partners_PartnerID] FOREIGN KEY([PartnerID])
REFERENCES [dbo].[Partners] ([PartnerID])
GO
ALTER TABLE [dbo].[PartnerFacilityMap] CHECK CONSTRAINT [FK_amer_PartnerFacilityMap_Partners_PartnerID]
GO
ALTER TABLE [dbo].[PartnerFacilityMap]  WITH NOCHECK ADD  CONSTRAINT [FK_PartnerFacilityMap_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[PartnerFacilityMap] CHECK CONSTRAINT [FK_PartnerFacilityMap_Users_CreatedBy]
GO
ALTER TABLE [dbo].[PartnerFacilityMap]  WITH NOCHECK ADD  CONSTRAINT [FK_PartnerFacilityMap_Users_ModifyBy] FOREIGN KEY([ModifyBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[PartnerFacilityMap] CHECK CONSTRAINT [FK_PartnerFacilityMap_Users_ModifyBy]
GO
ALTER TABLE [dbo].[PartnerMultiLingualNavigationURLs]  WITH CHECK ADD  CONSTRAINT [FK_PartnerMultiLingualNavigationURLs_Language] FOREIGN KEY([LanguageID])
REFERENCES [dbo].[Language] ([LanguageID])
GO
ALTER TABLE [dbo].[PartnerMultiLingualNavigationURLs] CHECK CONSTRAINT [FK_PartnerMultiLingualNavigationURLs_Language]
GO
ALTER TABLE [dbo].[PartnerMultiLingualNavigationURLs]  WITH CHECK ADD  CONSTRAINT [FK_PartnerMultiLingualNavigationURLs_Partners] FOREIGN KEY([PartnerID])
REFERENCES [dbo].[Partners] ([PartnerID])
GO
ALTER TABLE [dbo].[PartnerMultiLingualNavigationURLs] CHECK CONSTRAINT [FK_PartnerMultiLingualNavigationURLs_Partners]
GO
ALTER TABLE [dbo].[PartnerReturnReasonMap]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_PartnerReturnReasonMap_Partners_PartnerID] FOREIGN KEY([PartnerID])
REFERENCES [dbo].[Partners] ([PartnerID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[PartnerReturnReasonMap] CHECK CONSTRAINT [FK_ameruat_PartnerReturnReasonMap_Partners_PartnerID]
GO
ALTER TABLE [dbo].[PartnerReturnReasonMap]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_PartnerReturnReasonMap_RMAActionCode_RMAActionCodeID] FOREIGN KEY([RMAActionCodeID])
REFERENCES [dbo].[RMAActionCode] ([RMAActionCodeID])
GO
ALTER TABLE [dbo].[PartnerReturnReasonMap] CHECK CONSTRAINT [FK_ameruat_PartnerReturnReasonMap_RMAActionCode_RMAActionCodeID]
GO
ALTER TABLE [dbo].[PartnerReturnReasonMap]  WITH NOCHECK ADD  CONSTRAINT [FK_PartnerReturnReasonMap_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[PartnerReturnReasonMap] CHECK CONSTRAINT [FK_PartnerReturnReasonMap_Users_CreatedBy]
GO
ALTER TABLE [dbo].[PartnerReturnReasonMap]  WITH NOCHECK ADD  CONSTRAINT [FK_PartnerReturnReasonMap_Users_ModifyBy] FOREIGN KEY([ModifyBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[PartnerReturnReasonMap] CHECK CONSTRAINT [FK_PartnerReturnReasonMap_Users_ModifyBy]
GO
ALTER TABLE [dbo].[PartnerReturnReasonRuleMap]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_PartnerReturnReasonRuleMap_PartnerReturnReasonMap_PartnerReturnReasonMapID] FOREIGN KEY([PartnerReturnReasonMapID])
REFERENCES [dbo].[PartnerReturnReasonMap] ([PartnerReturnReasonMapID])
GO
ALTER TABLE [dbo].[PartnerReturnReasonRuleMap] CHECK CONSTRAINT [FK_ameruat_PartnerReturnReasonRuleMap_PartnerReturnReasonMap_PartnerReturnReasonMapID]
GO
ALTER TABLE [dbo].[PartnerReturnReasonRuleMap]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_PartnerReturnReasonRuleMap_ReturnReasonRuleMap_ReturnReasonRuleMapID] FOREIGN KEY([ReturnReasonRuleMapID])
REFERENCES [dbo].[ReturnReasonRuleMap] ([ReturnReasonRuleMapID])
GO
ALTER TABLE [dbo].[PartnerReturnReasonRuleMap] CHECK CONSTRAINT [FK_ameruat_PartnerReturnReasonRuleMap_ReturnReasonRuleMap_ReturnReasonRuleMapID]
GO
ALTER TABLE [dbo].[PartnerReturnReasonRuleMap]  WITH NOCHECK ADD  CONSTRAINT [FK_PartnerReturnReasonRuleMap_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[PartnerReturnReasonRuleMap] CHECK CONSTRAINT [FK_PartnerReturnReasonRuleMap_Users_CreatedBy]
GO
ALTER TABLE [dbo].[PartnerReturnReasonRuleMap]  WITH NOCHECK ADD  CONSTRAINT [FK_PartnerReturnReasonRuleMap_Users_ModifyBy] FOREIGN KEY([ModifyBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[PartnerReturnReasonRuleMap] CHECK CONSTRAINT [FK_PartnerReturnReasonRuleMap_Users_ModifyBy]
GO
ALTER TABLE [dbo].[Partners]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_Partners_Partners_PartnerParentID] FOREIGN KEY([PartnerParentID])
REFERENCES [dbo].[Partners] ([PartnerID])
GO
ALTER TABLE [dbo].[Partners] CHECK CONSTRAINT [FK_ameruat_Partners_Partners_PartnerParentID]
GO
ALTER TABLE [dbo].[Partners]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_Partners_Partners_ReturnFacilityID] FOREIGN KEY([ReturnFacilityID])
REFERENCES [dbo].[Partners] ([PartnerID])
GO
ALTER TABLE [dbo].[Partners] CHECK CONSTRAINT [FK_ameruat_Partners_Partners_ReturnFacilityID]
GO
ALTER TABLE [dbo].[Partners]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_Partners_Region_RegionID] FOREIGN KEY([RegionID])
REFERENCES [dbo].[Region] ([RegionID])
ON DELETE SET NULL
GO
ALTER TABLE [dbo].[Partners] CHECK CONSTRAINT [FK_ameruat_Partners_Region_RegionID]
GO
ALTER TABLE [dbo].[Partners]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_Partners_TypeLookUp_OrgSubTypeID] FOREIGN KEY([OrgSubTypeID])
REFERENCES [dbo].[TypeLookUp] ([TypeLookUpID])
GO
ALTER TABLE [dbo].[Partners] CHECK CONSTRAINT [FK_ameruat_Partners_TypeLookUp_OrgSubTypeID]
GO
ALTER TABLE [dbo].[Partners]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_Partners_TypeLookUp_PartnerTypeID] FOREIGN KEY([PartnerTypeID])
REFERENCES [dbo].[TypeLookUp] ([TypeLookUpID])
GO
ALTER TABLE [dbo].[Partners] CHECK CONSTRAINT [FK_ameruat_Partners_TypeLookUp_PartnerTypeID]
GO
ALTER TABLE [dbo].[partners_faq]  WITH CHECK ADD FOREIGN KEY([LanguageID])
REFERENCES [dbo].[Language] ([LanguageID])
GO
ALTER TABLE [dbo].[partners_faq]  WITH CHECK ADD FOREIGN KEY([LanguageID])
REFERENCES [dbo].[Language] ([LanguageID])
GO
ALTER TABLE [dbo].[partners_faq]  WITH CHECK ADD FOREIGN KEY([LanguageID])
REFERENCES [dbo].[Language] ([LanguageID])
GO
ALTER TABLE [dbo].[partners_faq]  WITH CHECK ADD FOREIGN KEY([LanguageID])
REFERENCES [dbo].[Language] ([LanguageID])
GO
ALTER TABLE [dbo].[partners_faq]  WITH CHECK ADD FOREIGN KEY([LanguageID])
REFERENCES [dbo].[Language] ([LanguageID])
GO
ALTER TABLE [dbo].[partners_faq]  WITH CHECK ADD FOREIGN KEY([LanguageID])
REFERENCES [dbo].[Language] ([LanguageID])
GO
ALTER TABLE [dbo].[partners_faq]  WITH CHECK ADD FOREIGN KEY([LanguageID])
REFERENCES [dbo].[Language] ([LanguageID])
GO
ALTER TABLE [dbo].[partners_faq]  WITH CHECK ADD FOREIGN KEY([LanguageID])
REFERENCES [dbo].[Language] ([LanguageID])
GO
ALTER TABLE [dbo].[partners_faq]  WITH CHECK ADD FOREIGN KEY([LanguageID])
REFERENCES [dbo].[Language] ([LanguageID])
GO
ALTER TABLE [dbo].[partners_faq]  WITH CHECK ADD FOREIGN KEY([LanguageID])
REFERENCES [dbo].[Language] ([LanguageID])
GO
ALTER TABLE [dbo].[partners_faq]  WITH CHECK ADD FOREIGN KEY([LanguageID])
REFERENCES [dbo].[Language] ([LanguageID])
GO
ALTER TABLE [dbo].[partners_faq]  WITH CHECK ADD FOREIGN KEY([LanguageID])
REFERENCES [dbo].[Language] ([LanguageID])
GO
ALTER TABLE [dbo].[partners_faq]  WITH CHECK ADD FOREIGN KEY([PartnerID])
REFERENCES [dbo].[Partners] ([PartnerID])
GO
ALTER TABLE [dbo].[partners_faq]  WITH CHECK ADD FOREIGN KEY([PartnerID])
REFERENCES [dbo].[Partners] ([PartnerID])
GO
ALTER TABLE [dbo].[partners_faq]  WITH CHECK ADD FOREIGN KEY([PartnerID])
REFERENCES [dbo].[Partners] ([PartnerID])
GO
ALTER TABLE [dbo].[partners_faq]  WITH CHECK ADD FOREIGN KEY([PartnerID])
REFERENCES [dbo].[Partners] ([PartnerID])
GO
ALTER TABLE [dbo].[partners_faq]  WITH CHECK ADD FOREIGN KEY([PartnerID])
REFERENCES [dbo].[Partners] ([PartnerID])
GO
ALTER TABLE [dbo].[partners_faq]  WITH CHECK ADD FOREIGN KEY([PartnerID])
REFERENCES [dbo].[Partners] ([PartnerID])
GO
ALTER TABLE [dbo].[partners_faq]  WITH CHECK ADD FOREIGN KEY([PartnerID])
REFERENCES [dbo].[Partners] ([PartnerID])
GO
ALTER TABLE [dbo].[partners_faq]  WITH CHECK ADD FOREIGN KEY([PartnerID])
REFERENCES [dbo].[Partners] ([PartnerID])
GO
ALTER TABLE [dbo].[partners_faq]  WITH CHECK ADD FOREIGN KEY([PartnerID])
REFERENCES [dbo].[Partners] ([PartnerID])
GO
ALTER TABLE [dbo].[partners_faq]  WITH CHECK ADD FOREIGN KEY([PartnerID])
REFERENCES [dbo].[Partners] ([PartnerID])
GO
ALTER TABLE [dbo].[partners_faq]  WITH CHECK ADD FOREIGN KEY([PartnerID])
REFERENCES [dbo].[Partners] ([PartnerID])
GO
ALTER TABLE [dbo].[partners_faq]  WITH CHECK ADD FOREIGN KEY([PartnerID])
REFERENCES [dbo].[Partners] ([PartnerID])
GO
ALTER TABLE [dbo].[partners_faq]  WITH CHECK ADD FOREIGN KEY([PartnerID])
REFERENCES [dbo].[Partners] ([PartnerID])
GO
ALTER TABLE [dbo].[partners_faq]  WITH CHECK ADD FOREIGN KEY([PartnerID])
REFERENCES [dbo].[Partners] ([PartnerID])
GO
ALTER TABLE [dbo].[PartnerUserRoleMap]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_PartnerUserRoleMap_Partners_PartnerID] FOREIGN KEY([PartnerID])
REFERENCES [dbo].[Partners] ([PartnerID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[PartnerUserRoleMap] CHECK CONSTRAINT [FK_ameruat_PartnerUserRoleMap_Partners_PartnerID]
GO
ALTER TABLE [dbo].[PartnerUserRoleMap]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_PartnerUserRoleMap_UserRoleMap_UserRoleMapID] FOREIGN KEY([UserRoleMapID])
REFERENCES [dbo].[UserRoleMap] ([UserRoleMapID])
GO
ALTER TABLE [dbo].[PartnerUserRoleMap] CHECK CONSTRAINT [FK_ameruat_PartnerUserRoleMap_UserRoleMap_UserRoleMapID]
GO
ALTER TABLE [dbo].[PartnerUserRoleMap]  WITH NOCHECK ADD  CONSTRAINT [FK_PartnerUserRoleMap_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[PartnerUserRoleMap] CHECK CONSTRAINT [FK_PartnerUserRoleMap_Users_CreatedBy]
GO
ALTER TABLE [dbo].[PartnerUserRoleMap]  WITH NOCHECK ADD  CONSTRAINT [FK_PartnerUserRoleMap_Users_ModifyBy] FOREIGN KEY([ModifyBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[PartnerUserRoleMap] CHECK CONSTRAINT [FK_PartnerUserRoleMap_Users_ModifyBy]
GO
ALTER TABLE [dbo].[Region]  WITH NOCHECK ADD  CONSTRAINT [FK_Region_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[Region] CHECK CONSTRAINT [FK_Region_Users_CreatedBy]
GO
ALTER TABLE [dbo].[Region]  WITH NOCHECK ADD  CONSTRAINT [FK_Region_Users_ModifyBy] FOREIGN KEY([ModifyBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[Region] CHECK CONSTRAINT [FK_Region_Users_ModifyBy]
GO
ALTER TABLE [dbo].[RegionConfigMap]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_RegionConfigMap_Region_RegionID] FOREIGN KEY([RegionID])
REFERENCES [dbo].[Region] ([RegionID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[RegionConfigMap] CHECK CONSTRAINT [FK_ameruat_RegionConfigMap_Region_RegionID]
GO
ALTER TABLE [dbo].[RegionConfigMap]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_RegionConfigMap_TypeLookUp_TypeLookupID] FOREIGN KEY([TypeLookupID])
REFERENCES [dbo].[TypeLookUp] ([TypeLookUpID])
GO
ALTER TABLE [dbo].[RegionConfigMap] CHECK CONSTRAINT [FK_ameruat_RegionConfigMap_TypeLookUp_TypeLookupID]
GO
ALTER TABLE [dbo].[RegionConfigMap]  WITH NOCHECK ADD  CONSTRAINT [FK_RegionConfigMap_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[RegionConfigMap] CHECK CONSTRAINT [FK_RegionConfigMap_Users_CreatedBy]
GO
ALTER TABLE [dbo].[RegionConfigMap]  WITH NOCHECK ADD  CONSTRAINT [FK_RegionConfigMap_Users_ModifyBy] FOREIGN KEY([ModifyBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[RegionConfigMap] CHECK CONSTRAINT [FK_RegionConfigMap_Users_ModifyBy]
GO
ALTER TABLE [dbo].[repair_charges]  WITH NOCHECK ADD  CONSTRAINT [FK_Repair_charges_created_by_users_UserID] FOREIGN KEY([created_by])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[repair_charges] CHECK CONSTRAINT [FK_Repair_charges_created_by_users_UserID]
GO
ALTER TABLE [dbo].[repair_charges]  WITH NOCHECK ADD  CONSTRAINT [FK_Repair_charges_updated_by_users_UserID] FOREIGN KEY([updated_by])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[repair_charges] CHECK CONSTRAINT [FK_Repair_charges_updated_by_users_UserID]
GO
ALTER TABLE [dbo].[repair_resolution]  WITH NOCHECK ADD  CONSTRAINT [FK_repair_resolution_created_by_users_UserID] FOREIGN KEY([created_by])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[repair_resolution] CHECK CONSTRAINT [FK_repair_resolution_created_by_users_UserID]
GO
ALTER TABLE [dbo].[repair_resolution]  WITH NOCHECK ADD  CONSTRAINT [FK_repair_resolution_updated_by_users_UserID] FOREIGN KEY([updated_by])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[repair_resolution] CHECK CONSTRAINT [FK_repair_resolution_updated_by_users_UserID]
GO
ALTER TABLE [dbo].[return_detail]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_return_detail_return_header_return_header_id] FOREIGN KEY([return_header_id])
REFERENCES [dbo].[return_header] ([return_header_id])
GO
ALTER TABLE [dbo].[return_detail] CHECK CONSTRAINT [FK_ameruat_return_detail_return_header_return_header_id]
GO
ALTER TABLE [dbo].[return_detail]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_return_detail_RMAActionCode_return_reason_id] FOREIGN KEY([return_reason_id])
REFERENCES [dbo].[RMAActionCode] ([RMAActionCodeID])
GO
ALTER TABLE [dbo].[return_detail] CHECK CONSTRAINT [FK_ameruat_return_detail_RMAActionCode_return_reason_id]
GO
ALTER TABLE [dbo].[return_detail]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_return_detail_TypeLookUp_status_id] FOREIGN KEY([status_id])
REFERENCES [dbo].[TypeLookUp] ([TypeLookUpID])
GO
ALTER TABLE [dbo].[return_detail] CHECK CONSTRAINT [FK_ameruat_return_detail_TypeLookUp_status_id]
GO
ALTER TABLE [dbo].[return_detail]  WITH NOCHECK ADD  CONSTRAINT [FK_return_detail_Users_created_by] FOREIGN KEY([created_by])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[return_detail] CHECK CONSTRAINT [FK_return_detail_Users_created_by]
GO
ALTER TABLE [dbo].[return_detail]  WITH NOCHECK ADD  CONSTRAINT [FK_return_detail_Users_modify_by] FOREIGN KEY([modify_by])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[return_detail] CHECK CONSTRAINT [FK_return_detail_Users_modify_by]
GO
ALTER TABLE [dbo].[return_event]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_return_event_return_detail_return_detail_id] FOREIGN KEY([return_detail_id])
REFERENCES [dbo].[return_detail] ([return_detail_id])
GO
ALTER TABLE [dbo].[return_event] CHECK CONSTRAINT [FK_ameruat_return_event_return_detail_return_detail_id]
GO
ALTER TABLE [dbo].[return_event]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_return_event_TypeLookUp_event] FOREIGN KEY([event])
REFERENCES [dbo].[TypeLookUp] ([TypeLookUpID])
GO
ALTER TABLE [dbo].[return_event] CHECK CONSTRAINT [FK_ameruat_return_event_TypeLookUp_event]
GO
ALTER TABLE [dbo].[return_event]  WITH NOCHECK ADD  CONSTRAINT [FK_return_event_Users_created_by] FOREIGN KEY([created_by])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[return_event] CHECK CONSTRAINT [FK_return_event_Users_created_by]
GO
ALTER TABLE [dbo].[return_freight]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_return_freight_Country_destination] FOREIGN KEY([destination])
REFERENCES [dbo].[Country] ([CountryID])
GO
ALTER TABLE [dbo].[return_freight] CHECK CONSTRAINT [FK_ameruat_return_freight_Country_destination]
GO
ALTER TABLE [dbo].[return_freight]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_return_freight_Country_origin] FOREIGN KEY([origin])
REFERENCES [dbo].[Country] ([CountryID])
GO
ALTER TABLE [dbo].[return_freight] CHECK CONSTRAINT [FK_ameruat_return_freight_Country_origin]
GO
ALTER TABLE [dbo].[return_freight]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_return_freight_Partners_brand] FOREIGN KEY([brand])
REFERENCES [dbo].[Partners] ([PartnerID])
GO
ALTER TABLE [dbo].[return_freight] CHECK CONSTRAINT [FK_ameruat_return_freight_Partners_brand]
GO
ALTER TABLE [dbo].[return_freight]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_return_freight_Users_created_by] FOREIGN KEY([created_by])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[return_freight] CHECK CONSTRAINT [FK_ameruat_return_freight_Users_created_by]
GO
ALTER TABLE [dbo].[return_freight]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_return_freight_Users_modify_by] FOREIGN KEY([modify_by])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[return_freight] CHECK CONSTRAINT [FK_ameruat_return_freight_Users_modify_by]
GO
ALTER TABLE [dbo].[return_header]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_return_header_customer_info_customer_id] FOREIGN KEY([customer_id])
REFERENCES [dbo].[customer_info] ([id])
GO
ALTER TABLE [dbo].[return_header] CHECK CONSTRAINT [FK_ameruat_return_header_customer_info_customer_id]
GO
ALTER TABLE [dbo].[return_header]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_return_header_inbound_log_inbound_log_id] FOREIGN KEY([inbound_log_id])
REFERENCES [dbo].[inbound_log] ([id])
GO
ALTER TABLE [dbo].[return_header] CHECK CONSTRAINT [FK_ameruat_return_header_inbound_log_inbound_log_id]
GO
ALTER TABLE [dbo].[return_header]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_return_header_Partners_brand_id] FOREIGN KEY([brand_id])
REFERENCES [dbo].[Partners] ([PartnerID])
GO
ALTER TABLE [dbo].[return_header] CHECK CONSTRAINT [FK_ameruat_return_header_Partners_brand_id]
GO
ALTER TABLE [dbo].[return_header]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_return_header_TypeLookUp_status_id] FOREIGN KEY([status_id])
REFERENCES [dbo].[TypeLookUp] ([TypeLookUpID])
GO
ALTER TABLE [dbo].[return_header] CHECK CONSTRAINT [FK_ameruat_return_header_TypeLookUp_status_id]
GO
ALTER TABLE [dbo].[return_header]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_return_header_Users_created_by] FOREIGN KEY([created_by])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[return_header] CHECK CONSTRAINT [FK_ameruat_return_header_Users_created_by]
GO
ALTER TABLE [dbo].[return_header]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_return_header_Users_modify_by] FOREIGN KEY([modify_by])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[return_header] CHECK CONSTRAINT [FK_ameruat_return_header_Users_modify_by]
GO
ALTER TABLE [dbo].[return_parcel]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_return_parcel_return_header_return_header_id] FOREIGN KEY([return_header_id])
REFERENCES [dbo].[return_header] ([return_header_id])
GO
ALTER TABLE [dbo].[return_parcel] CHECK CONSTRAINT [FK_ameruat_return_parcel_return_header_return_header_id]
GO
ALTER TABLE [dbo].[ReturnReasonRuleMap]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_ReturnReasonRuleMap_RMAActionCode_RMAActionCodeID] FOREIGN KEY([RMAActionCodeID])
REFERENCES [dbo].[RMAActionCode] ([RMAActionCodeID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[ReturnReasonRuleMap] CHECK CONSTRAINT [FK_ameruat_ReturnReasonRuleMap_RMAActionCode_RMAActionCodeID]
GO
ALTER TABLE [dbo].[ReturnReasonRuleMap]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_ReturnReasonRuleMap_TypeLookUp_RuleControlTypeID] FOREIGN KEY([RuleControlTypeID])
REFERENCES [dbo].[TypeLookUp] ([TypeLookUpID])
GO
ALTER TABLE [dbo].[ReturnReasonRuleMap] CHECK CONSTRAINT [FK_ameruat_ReturnReasonRuleMap_TypeLookUp_RuleControlTypeID]
GO
ALTER TABLE [dbo].[ReturnReasonRuleMap]  WITH NOCHECK ADD  CONSTRAINT [FK_ReturnReasonRuleMap_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[ReturnReasonRuleMap] CHECK CONSTRAINT [FK_ReturnReasonRuleMap_Users_CreatedBy]
GO
ALTER TABLE [dbo].[ReturnReasonRuleMap]  WITH NOCHECK ADD  CONSTRAINT [FK_ReturnReasonRuleMap_Users_ModifyBy] FOREIGN KEY([ModifyBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[ReturnReasonRuleMap] CHECK CONSTRAINT [FK_ReturnReasonRuleMap_Users_ModifyBy]
GO
ALTER TABLE [dbo].[returns_note]  WITH CHECK ADD  CONSTRAINT [FK__returns_n__retur__6207F6A1] FOREIGN KEY([return_header_id])
REFERENCES [dbo].[return_header] ([return_header_id])
GO
ALTER TABLE [dbo].[returns_note] CHECK CONSTRAINT [FK__returns_n__retur__6207F6A1]
GO
ALTER TABLE [dbo].[RMAActionCode]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_RMAActionCode_TypeLookUp_RMAActionTypeID] FOREIGN KEY([RMAActionTypeID])
REFERENCES [dbo].[TypeLookUp] ([TypeLookUpID])
GO
ALTER TABLE [dbo].[RMAActionCode] CHECK CONSTRAINT [FK_ameruat_RMAActionCode_TypeLookUp_RMAActionTypeID]
GO
ALTER TABLE [dbo].[RMAActionCodeMap]  WITH CHECK ADD  CONSTRAINT [FK_amer_RMAActionCodeMap_RMAActionCode_RMAActionCodeID] FOREIGN KEY([RMAActionCodeID])
REFERENCES [dbo].[RMAActionCode] ([RMAActionCodeID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[RMAActionCodeMap] CHECK CONSTRAINT [FK_amer_RMAActionCodeMap_RMAActionCode_RMAActionCodeID]
GO
ALTER TABLE [dbo].[RMAActionModelMap]  WITH CHECK ADD  CONSTRAINT [FK_amer_RMAActionModelMap_ItemMaster_SKUItemMasterID] FOREIGN KEY([SKUItemMasterID])
REFERENCES [dbo].[ItemMaster] ([ItemMasterID])
GO
ALTER TABLE [dbo].[RMAActionModelMap] CHECK CONSTRAINT [FK_amer_RMAActionModelMap_ItemMaster_SKUItemMasterID]
GO
ALTER TABLE [dbo].[RMAActionModelMap]  WITH CHECK ADD  CONSTRAINT [FK_amer_RMAActionModelMap_RMAActionCode_RMAActionCodeID] FOREIGN KEY([RMAActionCodeID])
REFERENCES [dbo].[RMAActionCode] ([RMAActionCodeID])
GO
ALTER TABLE [dbo].[RMAActionModelMap] CHECK CONSTRAINT [FK_amer_RMAActionModelMap_RMAActionCode_RMAActionCodeID]
GO
ALTER TABLE [dbo].[RoleModuleFunction]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_RoleModuleFunction_RoleType_RoleTypeId] FOREIGN KEY([RoleTypeId])
REFERENCES [dbo].[RoleType] ([RoleID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[RoleModuleFunction] CHECK CONSTRAINT [FK_ameruat_RoleModuleFunction_RoleType_RoleTypeId]
GO
ALTER TABLE [dbo].[RoleModuleFunction]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_RoleModuleFunction_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[RoleModuleFunction] CHECK CONSTRAINT [FK_ameruat_RoleModuleFunction_Users_CreatedBy]
GO
ALTER TABLE [dbo].[RoleModuleFunction]  WITH CHECK ADD  CONSTRAINT [FK_ameruat_RoleModuleFunction_Users_UpdatedBy] FOREIGN KEY([UpdatedBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[RoleModuleFunction] CHECK CONSTRAINT [FK_ameruat_RoleModuleFunction_Users_UpdatedBy]
GO
ALTER TABLE [dbo].[RoleModuleFunction]  WITH NOCHECK ADD  CONSTRAINT [FK_RoleModuleFunction_ModuleFunctionID_ModuleFunction_ModuleFunctionID] FOREIGN KEY([ModuleFunctionID])
REFERENCES [dbo].[ModuleFunction] ([ModuleFunctionId])
GO
ALTER TABLE [dbo].[RoleModuleFunction] CHECK CONSTRAINT [FK_RoleModuleFunction_ModuleFunctionID_ModuleFunction_ModuleFunctionID]
GO
ALTER TABLE [dbo].[Rules]  WITH CHECK ADD  CONSTRAINT [FK_amer_Rules_TypeLookUp_ControlTypeID] FOREIGN KEY([ControlTypeID])
REFERENCES [dbo].[TypeLookUp] ([TypeLookUpID])
GO
ALTER TABLE [dbo].[Rules] CHECK CONSTRAINT [FK_amer_Rules_TypeLookUp_ControlTypeID]
GO
ALTER TABLE [dbo].[Rules]  WITH CHECK ADD  CONSTRAINT [FK_amer_Rules_TypeLookUp_RuleTypeID] FOREIGN KEY([RuleTypeID])
REFERENCES [dbo].[TypeLookUp] ([TypeLookUpID])
GO
ALTER TABLE [dbo].[Rules] CHECK CONSTRAINT [FK_amer_Rules_TypeLookUp_RuleTypeID]
GO
ALTER TABLE [dbo].[SalePlanModule]  WITH CHECK ADD  CONSTRAINT [FK_SalePlanModule_SalePlan] FOREIGN KEY([SalePlanID])
REFERENCES [dbo].[SalePlan] ([ID])
GO
ALTER TABLE [dbo].[SalePlanModule] CHECK CONSTRAINT [FK_SalePlanModule_SalePlan]
GO
ALTER TABLE [dbo].[SeasonalConfig]  WITH CHECK ADD  CONSTRAINT [FK_amer_SeasonalConfig_Partners_PartnerId] FOREIGN KEY([PartnerId])
REFERENCES [dbo].[Partners] ([PartnerID])
GO
ALTER TABLE [dbo].[SeasonalConfig] CHECK CONSTRAINT [FK_amer_SeasonalConfig_Partners_PartnerId]
GO
ALTER TABLE [dbo].[State]  WITH CHECK ADD  CONSTRAINT [FK_state_created_by_users_UserID] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[State] CHECK CONSTRAINT [FK_state_created_by_users_UserID]
GO
ALTER TABLE [dbo].[State]  WITH CHECK ADD  CONSTRAINT [FK_state_CurrencyID_Currency_CurrencyID] FOREIGN KEY([CurrencyID])
REFERENCES [dbo].[Currency] ([CurrencyID])
GO
ALTER TABLE [dbo].[State] CHECK CONSTRAINT [FK_state_CurrencyID_Currency_CurrencyID]
GO
ALTER TABLE [dbo].[State]  WITH CHECK ADD  CONSTRAINT [FK_state_LanguageID_Language_LanguageID] FOREIGN KEY([LanguageID])
REFERENCES [dbo].[Language] ([LanguageID])
GO
ALTER TABLE [dbo].[State] CHECK CONSTRAINT [FK_state_LanguageID_Language_LanguageID]
GO
ALTER TABLE [dbo].[State]  WITH CHECK ADD  CONSTRAINT [FK_state_TimeZoneID_TimeZone_TimeZoneId] FOREIGN KEY([TimeZoneID])
REFERENCES [dbo].[TimeZone] ([TimeZoneId])
GO
ALTER TABLE [dbo].[State] CHECK CONSTRAINT [FK_state_TimeZoneID_TimeZone_TimeZoneId]
GO
ALTER TABLE [dbo].[State]  WITH CHECK ADD  CONSTRAINT [FK_state_updated_by_users_UserID] FOREIGN KEY([ModifyBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[State] CHECK CONSTRAINT [FK_state_updated_by_users_UserID]
GO
ALTER TABLE [dbo].[State]  WITH NOCHECK ADD  CONSTRAINT [FK_States_Country] FOREIGN KEY([CountryID])
REFERENCES [dbo].[Country] ([CountryID])
GO
ALTER TABLE [dbo].[State] CHECK CONSTRAINT [FK_States_Country]
GO
ALTER TABLE [dbo].[SubCategory]  WITH CHECK ADD  CONSTRAINT [FK_subCategory_CreatedBy_users_UserID] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[SubCategory] CHECK CONSTRAINT [FK_subCategory_CreatedBy_users_UserID]
GO
ALTER TABLE [dbo].[SubCategory]  WITH CHECK ADD  CONSTRAINT [FK_subCategory_ModifiedBy_users_UserID] FOREIGN KEY([ModifiedBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[SubCategory] CHECK CONSTRAINT [FK_subCategory_ModifiedBy_users_UserID]
GO
ALTER TABLE [dbo].[TenantSalePlanMap]  WITH CHECK ADD  CONSTRAINT [FK_TenantSalePlanMap_SalePlan] FOREIGN KEY([SalePlanID])
REFERENCES [dbo].[SalePlan] ([ID])
GO
ALTER TABLE [dbo].[TenantSalePlanMap] CHECK CONSTRAINT [FK_TenantSalePlanMap_SalePlan]
GO
ALTER TABLE [dbo].[TenantSalePlanMap]  WITH CHECK ADD  CONSTRAINT [FK_TenantSalePlanMap_TENANT] FOREIGN KEY([TenantID])
REFERENCES [dbo].[Tenant] ([TenantID])
GO
ALTER TABLE [dbo].[TenantSalePlanMap] CHECK CONSTRAINT [FK_TenantSalePlanMap_TENANT]
GO
ALTER TABLE [dbo].[Users]  WITH NOCHECK ADD  CONSTRAINT [FK_User_LanguageID_Language_LanguageID] FOREIGN KEY([LanguageID])
REFERENCES [dbo].[Language] ([LanguageID])
GO
ALTER TABLE [dbo].[Users] CHECK CONSTRAINT [FK_User_LanguageID_Language_LanguageID]
GO
