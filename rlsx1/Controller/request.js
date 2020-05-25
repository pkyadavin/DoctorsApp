var express = require('express');
var router = express.Router();
var sql = require('mssql');
var db = require('../shared/DBAccess');
var settings = require('../shared/Settings');
var helper = require('../UtilityLib/BlobHelper');
var multer = require('multer');
var upload = multer({ dest: '../Uploads/' })
var Error = require('../shared/ErrorLog');
router.get('/:PartnerID/:OrderStatus/:StartIndex/:PageSize/:SortColumn/:SortDirection/:FilterValue/:OrderDayWise', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    var OrderDayWise = req.params.OrderDayWise;
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input("OrderStatus", sql.VarChar(4), req.params.OrderStatus);
        request.input('StartIndex', sql.Int, req.params.StartIndex);
        request.input('PageSize', sql.Int, req.params.PageSize);
        request.input("SortColumn", sql.VarChar(50), req.params.SortColumn);
        request.input("SortDirection", sql.VarChar(4), req.params.SortDirection);
        request.input("FilterValue", sql.VarChar(1000), req.params.FilterValue);
        request.input('PartnerID', sql.Int, req.params.PartnerID);
        request.output('TotalCount', sql.Int);
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.input('LanguageID', sql.Int, req.userlogininfo.languageid);
        request.input('OrderDayWise', sql.VarChar(3), OrderDayWise);
        request.execute('usp_ServiceRequest_All', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_RmaOrder_All", JSON.stringify(request.parameters), req);
                res.send({ error: err });
            }
            else {
                res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });
            }
            connection.close();
        })
    });
});

router.get('ServiceRequest/:ID/:PID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('ID', sql.Int, req.params.ID);
        request.input('PartnerID', sql.Int, req.params.PID);
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.input('LanguageID', sql.Int, req.userlogininfo.languageid);
        request.execute('usp_ServiceRequest', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_ServiceRequest", JSON.stringify(request.parameters), req);
                res.send({ error: err });
            }
            else {
                res.send({ recordsets: recordsets[0][0] });
            }
            connection.close();
        })
    });
});

        request.input('LanguageID', sql.Int, req.userlogininfo.languageid);

router.get('/line/:ID/:PID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('ID', sql.Int, req.params.ID);
        request.input('PartnerID', sql.Int, req.params.PID);
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.input('LanguageID', sql.Int, req.userlogininfo.languageid);
        request.execute('usp_RmaOrderLine', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_RmaOrderLine", JSON.stringify(request.parameters), req);
                res.send({ error: err });
            }
            else {
                res.send({ recordsets: recordsets });
            }
            connection.close();
        })
    });
});

router.get('/TransferRMA/:ID/:PID/:CPID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('ID', sql.Int, req.params.ID);
        request.input('PartnerID', sql.Int, req.params.PID);
        request.input('CurrentPartnerID', sql.Int, req.params.CPID);
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.input('LanguageID', sql.Int, req.userlogininfo.languageid);
        request.execute('usp_TransferRMA', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_TransferRMA", JSON.stringify(request.parameters), req);
                res.send({ error: err });
            }
            else {
                res.send({ recordsets: recordsets });
            }
            connection.close();
        })
    });
});

router.get('/payments/:ID', function (req, res) {
    db.executeSql(req, `SELECT RMAOrderDetailPaymentID, d.RMANumber, pd.ReceiptNumber, format(pd.CreatedDate,'MMM dd, yyyy hh:mm') AS CreatedDate, ac.RMAActionName as PaymentReason, tl.TypeName as Mode, pd.Remarks, pd.Amount, dbo.Currency_ToWords(pd.Amount) AmountInWords, u.FirstName +' '+ u.LastName as Agent, format(pd.CreatedDate,'MMM dd, yyyy hh:mm') as ReceivedOn,
                cu.FirstName+' '+cu.LastName AS Customer, ISNULL(a.Address1,'') + ISNULL('<br />'+a.Address2 ,'')+ ISNULL('<br />'+a.City,'')+' ZIP-'+ISNULL(A.ZipCode,'')+ ISNULL(', '+s.StateName,'')+' '+ISNULL(', '+C.CountryName,'') AS CustomerAddress
                FROM RMAOrderDetailPayment pd
                INNER JOIN RMAOrderDetail d ON d.RMAOrderDetailID = pd.RMAOrderDetailID
                INNER JOIN ItemInfo i ON i.ItemInfoID = d.ItemInfoID
                INNER JOIN Customer cu ON cu.CustomerID = i.ConsumerID
                INNER JOIN CustomerAddressMap cam ON cam.CustomerID = cu.CustomerID
                INNER JOIN [Address] a ON a.AddressID = cam.AddressID
                --INNER JOIN TypeLookUp t ON t.TypeLookUpID = cam.AddressTypeID
                INNER JOIN [State] s ON s.StateID = a.StateID
                INNER JOIN Country c ON c.CountryID = s.CountryID

                INNER JOIN RMAActionCode ac ON ac.RMAActionCodeID = pd.PaymentReasonID
                INNER JOIN TypeLookUp tl ON tl.TypeLookUpID = pd.PaymentModeTypeID
                INNER JOIN Users u ON u.UserID = pd.CreatedBy
                WHERE pd.RMAOrderDetailID = ${ req.params.ID} --AND t.TypeCode = 'Type-004' AND t.TypeGroup = 'AddressType'`, function (data, err) {
            if (err) {
                Error.ErrorLog(err, `SELECT RMAOrderDetailPaymentID, d.RMANumber, pd.ReceiptNumber, format(pd.CreatedDate,'MMM dd, yyyy hh:mm') AS CreatedDate, ac.RMAActionName as PaymentReason, tl.TypeName as Mode, pd.Remarks, pd.Amount, dbo.Currency_ToWords(pd.Amount) AmountInWords, u.FirstName +' '+ u.LastName as Agent, format(pd.CreatedDate,'MMM dd, yyyy hh:mm') as ReceivedOn,
                cu.FirstName+' '+cu.LastName AS Customer, ISNULL(a.Address1,'') + ISNULL('<br />'+a.Address2 ,'')+ ISNULL('<br />'+a.City,'')+' ZIP-'+ISNULL(A.ZipCode,'')+ ISNULL(', '+s.StateName,'')+' '+ISNULL(', '+C.CountryName,'') AS CustomerAddress
                FROM RMAOrderDetailPayment pd
                INNER JOIN RMAOrderDetail d ON d.RMAOrderDetailID = pd.RMAOrderDetailID
                INNER JOIN ItemInfo i ON i.ItemInfoID = d.ItemInfoID
                INNER JOIN Customer cu ON cu.CustomerID = i.ConsumerID
                INNER JOIN CustomerAddressMap cam ON cam.CustomerID = cu.CustomerID
                INNER JOIN [Address] a ON a.AddressID = cam.AddressID
                INNER JOIN TypeLookUp t ON t.TypeLookUpID = cam.AddressTypeID
                INNER JOIN [State] s ON s.StateID = a.StateID
                INNER JOIN Country c ON c.CountryID = s.CountryID

                INNER JOIN RMAActionCode ac ON ac.RMAActionCodeID = pd.PaymentReasonID
                INNER JOIN TypeLookUp tl ON tl.TypeLookUpID = pd.PaymentModeTypeID
                INNER JOIN Users u ON u.UserID = pd.CreatedBy
                WHERE pd.RMAOrderDetailID = ${ req.params.ID} --AND t.TypeCode = 'Type-004' AND t.TypeGroup = 'AddressType'`, "", req);
                res.send({ error: err });
            }
            else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify(data));
            }
            res.end();

        });
});

router.get('/testlogs/:ID', function (req, res) {
    db.executeSql(req, `SELECT (SELECT DISTINCT Cast(rt.CreatedDate as Date)  AS [group],
            Case when Sum(Case RT.TestResult when 'Fail' then 1 else 0 end) > 0 then 'FAIL' ELSE 'PASS' END AS TestResult, rt.TestNumber,
             (SELECT c.RMAActionName, ISNULL(r.TestValue, '') AS TestValue, r.TestResult 
             FROM RMARepairTestResult r INNER JOIN RMAActionCode c ON c.RMAActionCodeID = r.RMAActionCodeID WHERE r.TestNumber = rt.TestNumber
             FOR JSON PATH) as TestDetail
             FROM RMARepairTestResult rt INNER JOIN RMAActionCode ac ON ac.RMAActionCodeID = rt.RMAActionCodeID
             WHERE rt.RMARepairHistoryID = ${ req.params.ID} GROUP BY rt.TestNumber, Cast(rt.CreatedDate as Date) ORDER BY rt.TestNumber DESC for json path) as recordset`, function (data, err) {
            if (err) {
                Error.ErrorLog(err, `SELECT (SELECT DISTINCT Cast(rt.CreatedDate as Date)  AS [group],
            Case when Sum(Case RT.TestResult when 'Fail' then 1 else 0 end) > 0 then 'FAIL' ELSE 'PASS' END AS TestResult, rt.TestNumber,
             (SELECT c.RMAActionName, ISNULL(r.TestValue, '') AS TestValue, r.TestResult 
             FROM RMARepairTestResult r INNER JOIN RMAActionCode c ON c.RMAActionCodeID = r.RMAActionCodeID WHERE r.TestNumber = rt.TestNumber
             FOR JSON PATH) as TestDetail
             FROM RMARepairTestResult rt INNER JOIN RMAActionCode ac ON ac.RMAActionCodeID = rt.RMAActionCodeID
             WHERE rt.RMARepairHistoryID = ${ req.params.ID} GROUP BY rt.TestNumber, Cast(rt.CreatedDate as Date) ORDER BY rt.TestNumber DESC for json path) as recordset`, "", req);
                res.send({ error: err });
            }
            else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify(data[0].recordset));
            }
            res.end();

        });
});

router.get('/artifacts/:ID', function (req, res) {
    db.executeSql(req, `SELECT  ra.RMAOrderDetailArtifactID, t.TypeName,a.[FileName], a.FileType, a.ArtifactURL, format(RA.CreatedDate,'MMM dd, yyyy hh:mm') AS CreatedDate
                FROM RMAOrderDetailArtifactMap ra INNER JOIN Artifact a ON a.ArtifactID = ra.ArtifactID
                INNER JOIN TypeLookUp t ON t.TypeLookUpID = ra.ArtifactTypeLookMapID
                WHERE RMAOrderDetailID = ${ req.params.ID}`, function (data, err) {
            if (err) {
                Error.ErrorLog(err, `SELECT  ra.RMAOrderDetailArtifactID, t.TypeName,a.[FileName], a.FileType, a.ArtifactURL, format(RA.CreatedDate,'MMM dd, yyyy hh:mm') AS CreatedDate
                FROM RMAOrderDetailArtifactMap ra INNER JOIN Artifact a ON a.ArtifactID = ra.ArtifactID
                INNER JOIN TypeLookUp t ON t.TypeLookUpID = ra.ArtifactTypeLookMapID
                WHERE RMAOrderDetailID = ${ req.params.ID}`, "", req);
                res.send({ error: err });
            }
            else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify(data));
            }
            res.end();

        });
});

router.post('/payment', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        var actionSP = "usp_Repair_Payment";
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.input('LanguageID', sql.Int, req.userlogininfo.languageid);
        request.input('RMAOrderDetailID', sql.Int, req.body[0].RMAOrderDetailID);
        request.input('Amount', sql.Float, req.body[0].Amount);
        request.input('Mode', sql.Int, req.body[0].Mode);
        request.input('Reason', sql.Int, req.body[0].Reason);
        request.input('Remarks', sql.NVarChar, req.body[0].Remarks);
        request.execute(actionSP, function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_Repair_Payment", JSON.stringify(request.parameters), req);
                res.send({ error: err });
            }
            else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(res.statusCode.toString());
            }
            res.end();
            connection.close();
        })
    });
});

router.get('/item/:sr', function (req, res) {
    db.executeSql(req, `select i.*, t.TypeLookUpID AS 'ItemReceiveType.TypeLookUpID', t.TypeName AS 'ItemReceiveType.TypeName', t.TypeCode AS 'ItemReceiveType.TypeCode' 
                from ItemInfo i inner join ItemMaster im on i.ItemMasterID = im.ItemMasterID
				INNER JOIN ItemMasterTypeMap itm ON itm.ItemMasterID = im.ItemMasterID
				INNER JOIN TypeLookUp it ON it.TypeLookUpID = itm.TypeLookUpID				
                inner join TypeLookUp t on t.TypeLookUpID = im.ItemReceiveTypeID
                WHERE it.TypeCode ='ITY002' AND it.TypeGroup ='ItemMaster' AND i.SerialNumber = '${ req.params.sr}'`, function (data, err) {
            if (err) {
                Error.ErrorLog(err, `select i.*, t.TypeLookUpID AS 'ItemReceiveType.TypeLookUpID', t.TypeName AS 'ItemReceiveType.TypeName', t.TypeCode AS 'ItemReceiveType.TypeCode' 
                from ItemInfo i inner join ItemMaster im on i.ItemMasterID = im.ItemMasterID
				INNER JOIN ItemMasterTypeMap itm ON itm.ItemMasterID = im.ItemMasterID
				INNER JOIN TypeLookUp it ON it.TypeLookUpID = itm.TypeLookUpID				
                inner join TypeLookUp t on t.TypeLookUpID = im.ItemReceiveTypeID
                WHERE it.TypeCode ='ITY002' AND it.TypeGroup ='ItemMaster' AND i.SerialNumber = '${ req.params.sr}'`, "", req);
                res.send({ error: err });
            }
            else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify(data));
            }
            res.end();

        });
});

router.get('/component/:sr/:p', function (req, res) {
    db.executeSql(req, `select i.*, t.TypeLookUpID AS 'ItemReceiveType.TypeLookUpID', t.TypeName AS 'ItemReceiveType.TypeName', t.TypeCode AS 'ItemReceiveType.TypeCode' 
                from ItemInfo i inner join ItemMaster im on i.ItemMasterID = im.ItemMasterID
				INNER JOIN ItemMasterTypeMap itm ON itm.ItemMasterID = im.ItemMasterID
				INNER JOIN TypeLookUp it ON it.TypeLookUpID = itm.TypeLookUpID				
                inner join TypeLookUp t on t.TypeLookUpID = im.ItemReceiveTypeID
                INNER JOIN Statuses s ON s.StatusID = i.StatusID AND S.StatusCode <> 'ST001'
                WHERE it.TypeGroup ='ItemMaster' AND i.PartnerID = '${ req.params.p}' AND i.SerialNumber = '${req.params.sr}'`, function (data, err) {
            if (err) {
                Error.ErrorLog(err, `select i.*, t.TypeLookUpID AS 'ItemReceiveType.TypeLookUpID', t.TypeName AS 'ItemReceiveType.TypeName', t.TypeCode AS 'ItemReceiveType.TypeCode' 
                from ItemInfo i inner join ItemMaster im on i.ItemMasterID = im.ItemMasterID
				INNER JOIN ItemMasterTypeMap itm ON itm.ItemMasterID = im.ItemMasterID
				INNER JOIN TypeLookUp it ON it.TypeLookUpID = itm.TypeLookUpID				
                inner join TypeLookUp t on t.TypeLookUpID = im.ItemReceiveTypeID
                INNER JOIN Statuses s ON s.StatusID = i.StatusID AND S.StatusCode <> 'ST001'
                WHERE it.TypeCode ='ITY001' AND it.TypeGroup ='ItemMaster' AND i.PartnerID = '${ req.params.p}' AND i.SerialNumber = '${req.params.sr}'`, "", req);
                res.send({ error: err });
            }
            else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify(data));
            }
            res.end();
        });
});

router.get('/acs/:sr', function (req, res) {
    db.executeSql(req, `SELECT distinct 0 AS Selected, ac.RMAActionCodeID, ac.RMAActionCode, ac.RMAActionName, t.TypeCode, t.TypeName,
                isnull((select ParentActionCodeID AS ID from RMAActionCodeMap where RMAActionCodeID = ac.RMAActionCodeID for json path),'[]') as ParentActionCodes,
				isnull((select RepairLevelID AS ID from RMAActionCodeRepairLevelMap where RMAActionCodeID = ac.RMAActionCodeID for json path),'[]') as RepairLevels
                FROM RMAActionCode ac inner join TypeLookUp t on t.TypeLookUpID = ac.RMAActionTypeID 
                inner join RMAActionModelMap mm on mm.RMAActionCodeID = ac.RMAActionCodeID
                inner join ItemMaster i on i.ItemMasterID = mm.SKUItemMasterID
                where t.TypeGroup = 'RMAActionCommand' and ac.isActive = 1 and i.ItemMasterID = ${req.params.sr}`, function (data, err) {
            if (err) {
                Error.ErrorLog(err, `SELECT distinct 0 AS Selected, ac.RMAActionCodeID, ac.RMAActionCode, ac.RMAActionName, t.TypeCode, t.TypeName,
                isnull((select ParentActionCodeID AS ID from RMAActionCodeMap where RMAActionCodeID = ac.RMAActionCodeID for json path),'[]') as ParentActionCodes,
				isnull((select RepairLevelID AS ID from RMAActionCodeRepairLevelMap where RMAActionCodeID = ac.RMAActionCodeID for json path),'[]') as RepairLevels
                FROM RMAActionCode ac inner join TypeLookUp t on t.TypeLookUpID = ac.RMAActionTypeID 
                inner join RMAActionModelMap mm on mm.RMAActionCodeID = ac.RMAActionCodeID
                inner join ItemMaster i on i.ItemMasterID = mm.SKUItemMasterID
                where t.TypeGroup = 'RMAActionCommand' and ac.isActive = 1 and i.ItemMasterID = ${req.params.sr}`, "", req);
                res.send({ error: err });
            }
            else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify(data));
            }
            res.end();
        });
});

router.get('/paymentReasons/:ID', function (req, res) {
    db.executeSql(req, `SELECT ac.RMAActionCodeID, ac.RMAActionCode, ac.RMAActionName
                    FROM RMAActionCode ac inner join TypeLookUp t on t.TypeLookUpID = ac.RMAActionTypeID 
                    where t.TypeGroup = 'PaymentReason' and ac.isActive = 1`, function (data, err) {
            if (err) {
                Error.ErrorLog(err, `SELECT ac.RMAActionCodeID, ac.RMAActionCode, ac.RMAActionName
                    FROM RMAActionCode ac inner join TypeLookUp t on t.TypeLookUpID = ac.RMAActionTypeID 
                    where t.TypeGroup = 'PaymentReason' and ac.isActive = 1`, "", req);
                res.send({ error: err });
            }
            else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify(data));
            }
            res.end();
        });
});

router.get('/repairparts/:ID/:pID/:aID', function (req, res) {
    db.executeSql(req, `SELECT (SELECT IP.PartnerID,
                I.ItemReceiveTypeID,
                I.ItemReceiveTypeID AS 'ItemReceiveType.ItemReceiveTypeID',
				ItemReceiveType.TypeCode AS 'ItemReceiveType.TypeCode',
				ItemReceiveType.TypeName AS 'ItemReceiveType.TypeName',
                I.ItemMasterID ,
                I.ItemNumber,
                I.ArticleNumber,
                I.ItemName,
                I.ItemDescription,
                IP.SellingPrice AS ItemPrice,
                IP.SellingPriceIW AS ItemPriceIW,
				ISNULL(inv.AvailableQty, 0) Available,
                isnull((select RMAActionCodeID AS ID from ItemMasterActionCodeMap where ItemMasterID = I.ItemMasterID for json path),'[]') as Acs
                FROM RMAOrderDetail RMA 
                INNER JOIN ItemInfo INFO on RMA.iteminfoID=info.iteminfoID
                INNER JOIN ItemMasterBOM IB on Info.itemmasterID=ib.ParentMasterID
                INNER JOIN ItemMaster I on IB.ItemMasterID=I.ItemMasterID      
                INNER JOIN ItemMasterPartnerMap IP ON IP.ItemMasterID = I.ItemMasterID 
                INNER JOIN Partners p ON p.PartnerID = IP.PartnerID
				--INNER JOIN ItemMasterActionCodeMap acm ON acm.ItemMasterID = I.ItemMasterID
                LEFT JOIN vw_ItemInventoryLocationWise inv ON inv.ItemMasterID = I.ItemMasterID AND inv.PartnerID = p.PartnerID 
                            AND inv.NodeID = p.RepairNodeID AND inv.PartnerLocationID = p.RepairLocationID
                left JOIN TypeLookUp ItemReceiveType ON ItemReceiveType.TypeLookUpID = I.ItemReceiveTypeID
               where rma.RMAOrderDetailID = ${req.params.ID} AND p.PartnerID = ${req.params.pID} for json path) AS parts`, function (data, err) {
            if (err) {
                Error.ErrorLog(err, `SELECT (SELECT IP.PartnerID,
                I.ItemReceiveTypeID,
                I.ItemReceiveTypeID AS 'ItemReceiveType.ItemReceiveTypeID',
				ItemReceiveType.TypeCode AS 'ItemReceiveType.TypeCode',
				ItemReceiveType.TypeName AS 'ItemReceiveType.TypeName',
                I.ItemMasterID ,
                I.ItemNumber,
                I.ArticleNumber,
                I.ItemName,
                I.ItemDescription,
                IP.SellingPrice AS ItemPrice,
				ISNULL(inv.AvailableQty, 0) Available
               FROM RMAOrderDetail RMA 
                INNER JOIN ItemInfo INFO on RMA.iteminfoID=info.iteminfoID
                INNER JOIN ItemMasterBOM IB on Info.itemmasterID=ib.ParentMasterID
                INNER JOIN ItemMaster I on IB.ItemMasterID=I.ItemMasterID      
                INNER JOIN ItemMasterPartnerMap IP ON IP.ItemMasterID = I.ItemMasterID 
                INNER JOIN Partners p ON p.PartnerID = IP.PartnerID
                LEFT JOIN vw_ItemInventoryLocationWise inv ON inv.ItemMasterID = I.ItemMasterID AND inv.PartnerID = p.PartnerID 
                            AND inv.NodeID = p.RepairNodeID AND inv.PartnerLocationID = p.RepairLocationID
                left JOIN TypeLookUp ItemReceiveType ON ItemReceiveType.TypeLookUpID = I.ItemReceiveTypeID
               where rma.RMAOrderDetailID = ${req.params.ID} AND p.PartnerID = ${req.params.pID} for json path) AS parts`, "", req);
                res.send({ error: err });
            }
            else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify(data));
            }
            res.end();
        });
});

router.post('/', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        var actionSP = "usp_ServiceRequest_Post";
        request.input('rma', sql.NVarChar(sql.MAX), req.body[0].rmaOrder);
        request.output('Number', sql.NVarChar(sql.MAX));
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.input('LanguageID', sql.Int, req.userlogininfo.languageid);
        
        request.execute(actionSP, function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, actionSP, JSON.stringify(request.parameters), req);
                res.send({ error: err });
            }
            else {
                res.send({ Number: request.parameters.Number.value });
            }
            connection.close();
        })
    });
});

router.post('/repairaction', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        var actionSP = "usp_Repair_Allocate";
        request.input('parts', sql.NVarChar(sql.MAX), req.body[0].parts);
        request.input('consume', sql.Bit, req.body[0].consume == false ? 0 : 1);
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.input('LanguageID', sql.Int, req.userlogininfo.languageid);
        request.input('PartnerID', sql.Int, req.body[0].pid);
        request.input('RMAOrderDetailID', sql.Int, req.body[0].RMAOrderDetailID);
        request.execute(actionSP, function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, actionSP, JSON.stringify(request.parameters), req);
                res.send({ error: err });
            }
            else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(res.statusCode.toString());
            }
            res.end();
            connection.close();
        })
    });
});

router.get('/repairlevels/:partnerID', function (req, res) {
    db.executeSql(req, ` SELECT rl.RepairLevelID, rl.Code,
                        rl.[Name],
                        rl.LaborServiceCost,
                        prl.isActive
                        FROM 
                        RepairLevel rl INNER JOIN PartnerRepairLevelMap prl ON prl.RepairLevelID = rl.RepairLevelID
                        WHERE rl.isActive = 1 AND prl.PartnerID = ${req.params.partnerID}`, function (data, err) {
            if (err) {
                Error.ErrorLog(err, `SELECT rl.RepairLevelID, rl.Code,
                        rl.[Name],
                        rl.LaborServiceCost,
                        prl.isActive
                        FROM 
                        RepairLevel rl INNER JOIN PartnerRepairLevelMap prl ON prl.RepairLevelID = rl.RepairLevelID
                        WHERE rl.isActive = 1 AND prl.PartnerID = ${req.params.partnerID}`, "", req);
                res.send({ error: err });
            }
            else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify(data));
            }
            res.end();
        });
});

router.get('/testcodes/:sr', function (req, res) {
    db.executeSql(req, `SELECT  
	                ac.RMAActionCodeID, ac.RMAActionCode, ac.RMAActionName, t.TypeCode, t.TypeName
                    FROM RMAActionCode ac 
	                left join TypeLookUp t on ac.RMAActionTypeID  = t.TypeLookUpID 
                    left join RMAActionModelMap mm on ac.RMAActionCodeID = mm.RMAActionCodeID
                    left join ItemMaster i on mm.SKUItemMasterID = i.ItemMasterID
	                where t.TypeGroup = 'RepairTest' and ac.isActive = 1 and i.ItemMasterID = ${req.params.sr}`, function (data, err) {
            if (err) {
                Error.ErrorLog(err, `SELECT  
	                ac.RMAActionCodeID, ac.RMAActionCode, ac.RMAActionName, t.TypeCode, t.TypeName
                    FROM RMAActionCode ac 
	                left join TypeLookUp t on ac.RMAActionTypeID  = t.TypeLookUpID 
                    left join RMAActionModelMap mm on ac.RMAActionCodeID = mm.RMAActionCodeID
                    left join ItemMaster i on mm.SKUItemMasterID = i.ItemMasterID
	                where t.TypeGroup = 'RepairTest' and ac.isActive = 1 and i.ItemMasterID = ${req.params.sr}`, "", req);
                res.send({ error: err });
            }
            else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify(data));
            }
            res.end();
        });
});

router.get('/quotation/:RMAOrderDetailID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        var actionSP = "usp_RMACostCalculator";
        request.input('RMAOrderDetailID', sql.Int, req.params.RMAOrderDetailID);
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.execute(actionSP, function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, actionSP, JSON.stringify(request.parameters), req);
                res.send({ error: err });
            }
            else {
                res.send({ recordsets: recordsets[0], TotalCost: recordsets[1][0].TotalCost });
            }
            connection.close();
        })
    });
});

router.get('/raisequotation/:RMAOrderDetailID/:PreApproved/:Amount', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        var actionSP = "usp_RaiseQuote";
        request.input('RMAOrderDetailID', sql.Int, req.params.RMAOrderDetailID);
        request.input('PreApproved', sql.Bit, req.params.PreApproved == "false" ? 0 : 1);
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.input('Amount', sql.Float, req.params.Amount);
        request.execute(actionSP, function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, actionSP, JSON.stringify(request.parameters), req);
                res.send({ error: err });
            }
            else {
                res.send({ recordsets: recordsets[0] });
            }
            connection.close();
        })
    });
});

router.get('/Customerdevices/:CID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        var actionSP = "usp_CustomerDevices";
        request.input('CustomerID', sql.Int, req.params.CID);
        request.execute(actionSP, function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, actionSP, JSON.stringify(request.parameters), req);
                res.send({ error: err });
            }
            else {
                res.send({ recordsets: recordsets[0] });
            }
            res.end();
            connection.close();
        })
    });
});

router.get('/Invoice/:RMAOrderDetailID/:pID/:canClose', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        var actionSP = "usp_Repair_Invoice";
        request.input('RMAOrderDetailID', sql.Int, req.params.RMAOrderDetailID);
        request.input('PartnerId', sql.Int, req.params.pID);
        request.input('CloseRMA', sql.Int, req.params.canClose == "false" ? 0 : 1);
        request.execute(actionSP, function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, actionSP, JSON.stringify(request.parameters), req);
                res.send({ error: err });
            }
            else {
                res.send({ recordsets: recordsets[0] });
            }
            connection.close();
        })
    });
});

router.delete('/:ID', function (req, res) {
    db.executeSql(req, "DELETE FROM ServiceRequestHeader WHERE ServiceRequestHeaderID =" + req.params.ID, function (data, err) {
        if (err) {
            Error.ErrorLog(err, "DELETE FROM ServiceRequestHeader WHERE ServiceRequestHeaderID =" + req.params.ID, "", req);
            res.send({ error: err });
        }
        else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(res.statusCode.toString());
        }
        res.end();
    });
});

var uUpload = upload.fields([{ name: 'RepairDocs', maxCount: 1 }])
router.post('/doc/:ArtifactTypeLookMapID/:RMAOrderDetailID', uUpload, function (req, res) {
    helper.uploadFile('consumer-files', req.files['RepairDocs'][0], function (error1, result1) {
        if (!error1) {
            var connection = new sql.Connection(settings.DBconfig(req));
            connection.connect().then(function () {
                var request = new sql.Request(connection);
                var actionSP = "usp_Repair_artifacts";
                request.input('RMAOrderDetailID', sql.Int, req.params.RMAOrderDetailID);
                request.input('ArtifactTypeLookMapID', sql.Int, req.params.ArtifactTypeLookMapID);
                request.input('SystemGeneratedName', sql.NVarChar, result1.substring(result1.lastIndexOf('/')));
                request.input('FileName', sql.NVarChar, req.files['RepairDocs'][0].originalname);
                request.input('ArtifactURL', sql.NVarChar, result1);
                request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.input('LanguageID', sql.Int, req.userlogininfo.languageid);
                request.execute(actionSP, function (err, recordsets, returnValue) {
                    if (err) {
                        Error.ErrorLog(err, actionSP, JSON.stringify(request.parameters), req);
                        res.send({ error: err });
                    }
                    else {
                        res.send({ result: 'Success' });
                    }
                    res.end();
                    connection.close();
                })
            });
        }
    });
});

var uUpload = upload.fields([{ name: 'DeviceDocs', maxCount: 1 }])
router.post('/ItemInvoice/:ID', uUpload, function (req, res) {
    helper.uploadFile('consumer-files', req.files['DeviceDocs'][0], function (error1, result1) {
        if (!error1) {
            res.send({ Artifact: result1 });
        }
    });
});

router.get('/ExportToExcel/:orderType/:PartnerID/:OrderDayWise', function (req, res) {
    var OrderType = req.params.orderType;
    var nodeExcel = require('excel-export');
    var dateFormat = require('dateformat');
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function (error) {
        var request = new sql.Request(connection);


        request.input('OrderStatus', sql.VarChar(4), req.params.orderType);
        request.input('StartIndex', sql.Int, 0);
        request.input('PageSize', sql.Int, 25000);
        request.input("SortColumn", sql.VarChar(50), 'null');
        request.input("SortDirection", sql.VarChar(4), 'null');
        request.input("FilterValue", sql.VarChar(1000), 'null');
        request.input('PartnerID', sql.Int, req.params.PartnerID);
        request.output('TotalCount', sql.Int);
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.input('LanguageID', sql.Int, req.userlogininfo.languageid);
        request.input('OrderDayWise', sql.VarChar(3), req.params.OrderDayWise);
        request.execute('usp_RmaOrder_All', function (err, recordsets, returnValue) {
            var styles = {
                headerDark: {
                    fill: {
                        fgColor: {
                            rgb: 'FF000000'
                        }
                    },
                    font: {
                        color: {
                            rgb: 'FFFFFFFF'
                        },
                        sz: 14,
                        bold: true,
                        underline: true
                    }
                },
                cellPink: {
                    fill: {
                        fgColor: {
                            rgb: 'FFFFCCFF'
                        }
                    }
                },
                cellGreen: {
                    fill: {
                        fgColor: {
                            rgb: 'FF00FF00'
                        }
                    }
                }
            };
            var rows = recordsets[0];
            var conf = {}

            conf.cols = [{
                caption: 'RMA Number',
                type: 'string',
                width: 20,
                headerStyle: styles.headerDark
            },
            {
                caption: 'Status',
                type: 'string',
                width: 20,
                headerStyle: styles.cellPink
            },
            {
                caption: 'Order Number',
                type: 'string',
                width: 20,
                headerStyle: styles.cellGreen
            },
            {
                headerStyle: styles.headerDark,
                caption: 'Order Date',
                type: 'date',
                width: 15


            },
            {
                caption: 'Serial Number',
                type: 'string',
                width: 20,
                headerStyle: styles.headerDark
            },
            {
                caption: 'Inward Number',
                type: 'string',
                width: 15,
                headerStyle: styles.headerDark
            },

            {
                headerStyle: styles.headerDark,
                caption: 'StandBy Device',
                type: 'string',
                width: 15


            },
            {
                caption: 'Remarks',
                type: 'string',
                width: 20,
                headerStyle: styles.headerDark
            },

            {
                headerStyle: styles.headerDark,
                caption: 'Partner',
                type: 'string',
                width: 15


            },
            {
                caption: 'Inward Type',
                type: 'string',
                width: 20,
                headerStyle: styles.headerDark
            },

            {
                headerStyle: styles.headerDark,
                caption: 'Customer',
                type: 'string',
                width: 15


            },
            {
                caption: 'RMA Type',
                type: 'string',
                width: 30,
                headerStyle: styles.headerDark
            },

            {
                headerStyle: styles.headerDark,
                caption: 'Service Type',
                type: 'string',
                width: 30


            },
            {
                caption: 'Delivery Type',
                type: 'string',
                width: 20,
                headerStyle: styles.headerDark
            },

            {
                headerStyle: styles.headerDark,
                caption: 'Reference Number',
                type: 'string',
                width: 20


            },
            {
                caption: 'Warranty Status',
                type: 'string',
                width: 30,
                headerStyle: styles.headerDark
            },

            {
                headerStyle: styles.headerDark,
                caption: 'Priority',
                type: 'string',
                width: 20


            },
            {
                caption: 'Repair Number',
                type: 'string',
                width: 20,
                headerStyle: styles.headerDark
            },

            {
                headerStyle: styles.headerDark,
                caption: 'Promised Date',
                type: 'date',
                width: 15


            },
            {
                caption: 'Repair Date',
                type: 'date',
                width: 20,
                headerStyle: styles.headerDark
            },

            {
                headerStyle: styles.headerDark,
                caption: 'Expiry Date',
                type: 'date',
                width: 15


            },
            {
                caption: 'Technician Remarks',
                type: 'string',
                width: 20,
                headerStyle: styles.headerDark
            },


            {
                caption: 'Customer Remarks',
                type: 'string',
                width: 20,
                headerStyle: styles.headerDark
            }
            ];

            arr = [];

            for (i = 0; i < rows.length; i++) {
                RMANumber = rows[i].RMANumber;
                Status = rows[i].Status;
                OrderNumber = rows[i].OrderNumber;
                OrderDate = rows[i].OrderDate;
                SerialNumber = rows[i].SerialNumber;
                InwardNumber = rows[i].InwardNumber;
                StandbyDevice = rows[i].StandbyDeviceSerialNumber;

                Remarks = rows[i].Remarks;
                PartnerName = rows[i].PartnerName;
                InwardType = rows[i].InwardTypeName;
                Customer = rows[i].CustomerFirstName;
                RMAType = rows[i].RMAType;
                ServiceType = rows[i].ServiceType;

                DeliveryType = rows[i].DeliveryType;
                ReferenceNumber = rows[i].TenantReferenceNumber;
                WarrantyStatus = rows[i].WarrantyStatus;
                Priority = rows[i].Priority;
                PromisedDate = rows[i].PromisedDate;
                ExpiryDate = rows[i].ExpiryDate;
                RepairNumber = rows[i].RepairNumber;
                RepairDate = rows[i].RepairDate;
                TechnicianRemarks = rows[i].TechnicianRemarks;
                CustomerRemarks = rows[i].CustomerRemarks;

                a = [RMANumber, Status, OrderNumber, (dateFormat(OrderDate, "dd/mm/yyyy")), SerialNumber, InwardNumber, StandbyDevice, Remarks, PartnerName, InwardType, Customer, RMAType, ServiceType, DeliveryType, ReferenceNumber, WarrantyStatus, Priority, (dateFormat(PromisedDate, "dd/mm/yyyy")), (dateFormat(ExpiryDate, "dd/mm/yyyy")), RepairNumber, (dateFormat(RepairDate, "dd/mm/yyyy")), TechnicianRemarks, CustomerRemarks];
                arr.push(a);
            }

            conf.rows = arr;
            var result = nodeExcel.execute(conf);
            res.setHeader("Content-Disposition", "attachment;filename=" + OrderType + "PurchaseOrder.xlsx");
            res.setHeader('Content-Type', 'application/vnd.openxmlformats');
            res.end(result, 'binary');
            connection.close();
        });
    });
});

module.exports = router;