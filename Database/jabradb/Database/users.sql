/****** Object:  User [ajitsp]    Script Date: 25-05-2020 09:15:17 ******/
CREATE USER [ajitsp] WITH DEFAULT_SCHEMA=[dbo]
GO
/****** Object:  User [amrendras]    Script Date: 25-05-2020 09:15:17 ******/
CREATE USER [amrendras] WITH DEFAULT_SCHEMA=[dbo]
GO
/****** Object:  User [ankurg]    Script Date: 25-05-2020 09:15:17 ******/
CREATE USER [ankurg] WITH DEFAULT_SCHEMA=[dbo]
GO
/****** Object:  User [praveeny]    Script Date: 25-05-2020 09:15:17 ******/
CREATE USER [praveeny] WITH DEFAULT_SCHEMA=[dbo]
GO
/****** Object:  User [vikasc]    Script Date: 25-05-2020 09:15:17 ******/
CREATE USER [vikasc] WITH DEFAULT_SCHEMA=[dbo]
GO
sys.sp_addrolemember @rolename = N'db_owner', @membername = N'ajitsp'
GO
sys.sp_addrolemember @rolename = N'db_owner', @membername = N'amrendras'
GO
sys.sp_addrolemember @rolename = N'db_owner', @membername = N'ankurg'
GO
sys.sp_addrolemember @rolename = N'db_owner', @membername = N'praveeny'
GO
sys.sp_addrolemember @rolename = N'db_owner', @membername = N'vikasc'
GO
