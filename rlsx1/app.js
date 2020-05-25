var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var oauthserver = require('./oauth2-rl');
var config = require('./config.js');
var index = require('./routes/index');
var authenticate = require('./OAuth/authenticate');
var cors = require('cors');
require('dotenv').config();
var helmet = require('helmet');
var manager = require('./AdminController/rlmanage');
var users = require('./Controller/users');
var timezone = require('./Controller/timezone');
var productcatalog = require('./CPController/productcatalog');
var _authenticate = require('./Controller/authentication');
var role = require('./Controller/role');
var facilities = require('./Controller/facilities');
var modelmaster = require('./Controller/modelmaster');
var nodemaster = require('./Controller/nodemaster');
var notificationtemplates = require('./Controller/notificationtemplate');
var menu = require('./Controller/menu');
var countries = require('./Controller/countries');
var metadataconfig = require('./Controller/metadata-config');
var receiving = require('./Controller/receiving');
var region = require('./Controller/region');
var partners = require('./Controller/partners');
var ordersetting = require('./Controller/ordersettings');
var model = require('./Controller/category');
var MessageTemplate = require('./Controller/MessageTemplate');
var othersetup = require('./Controller/othersetup');
var common = require('./Controller/common');
var lookup = require('./Controller/lookup');
var modulemaster = require('./Controller/module-master');
var address = require('./Controller/address');
var states = require('./Controller/states');
var state = require('./Controller/State');
var color = require('./Controller/color');
var season = require('./Controller/season');
var uomMaster = require('./Controller/uomMaster');
var itemmaster = require('./Controller/itemmaster');
var soOrder = require('./Controller/soOrder');
var itemcategories = require('./Controller/itemcategory');
var ordertaskflow = require('./Controller/OrderTaskFlow');
var location = require('./Controller/Location');
var reports = require('./Controller/reports');
var returnreason = require('./Controller/returnreason');
var returntype = require('./Controller/returntype');
var Country = require('./Controller/Country');
var SROrder = require('./Controller/salesreturnorder');
var Shipment = require('./Controller/shipmentorder');
var rule = require('./Controller/rule');
var admin_Tenant = require('./AdminController/Tenant');
var tenantadmins = require('./AdminController/tenantadmin');
var manufacturer = require('./Controller/manufacturer');
var returns = require('./Controller/return');
var upload = require('./Controller/upload');
var analytics = require('./Controller/analytics');
var language = require('./localization/language');
var amer = require('./integration/amer');
var gareturns = require('./Controller/ga_return');
var bpreturns = require('./Controller/bp_return');
var consumerreturns = require('./Controller/consumer_return');
var productCategory=require('./Controller/productCategory');
var productSubCategory=require('./Controller/productSubCategory') ;
var productGrade=require('./Controller/productGrade');
var productGrouping=require('./Controller/productGrouping');
var B2BUser=require('./Controller/B2BUser');
var ProductCatalog=require('./Controller/ProductCatalog');
var ProductSize=require('./Controller/ProductSize');
var Orders=require('./Controller/Orders');
var CaseAssessment=require('./Controller/CaseAssessment');
var ProductPriceList=require('./Controller/ProductPriceList');
var caseCreation=require('./Controller/caseCreation');
var repair_resolution=require('./Controller/repair_resolution');
var returnReasonRootCause=require('./Controller/returnReasonRootCause');
var returnReasonIssue=require('./Controller/returnReasonIssue');
var returnReasonLocation=require('./Controller/returnReasonLocation');
var repair_charges=require('./Controller/repair_charges');

var CaseValidation = require('./Controller/CaseValidation');

var caseCreationCP=require('./Controller/caseCreationCP');
var city=require('./Controller/city');
var Configuration=require('./Controller/Configuration');
var repairMaterial=require('./Controller/repairMaterial');
var productLocation=require('./Controller/productLocation');


var app = express();

const appInsights = require("applicationinsights");
appInsights.setup("9719b4d5-02d1-4d0c-892d-b6b33260e9da");
appInsights.start();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
app.set('view engine', 'ejs');

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(helmet());

/** Public Area **/
app.use(function (req, res, next) {
  req.scope = "dbo";
  req.requser = process.env.RL_USER;
  next();
});

app.use('/', index);
app.use('/portal/tenantadmins', tenantadmins);
app.use('/authenticate', _authenticate);
app.use('/countries', countries);
app.use('/states', states);
app.use('/lookup', lookup);
app.use('/connect/amer', amer);
app.use('/portal/return', returns);
app.use('/portal/ga_return', gareturns);
app.use('/portal/bp_return',bpreturns);
app.use('/portal/consumer_return',consumerreturns);
app.use('/portal/uploads', upload);
/** Public Area **/

require('./OAuth')(app)

/** Control Private through OAuth **/
app.get('/secure', authenticate(), function (req, res) {
  res.json({ message: 'Secure data' })
});
app.use('/uploads', authenticate(), upload);
app.use('/manage', authenticate(), manager);
app.use('/menu', authenticate(), menu);
app.use('/role', authenticate(), role);
app.use('/users', authenticate(), users);
app.use('/common', authenticate(), common);
app.use('/country', authenticate(), Country);
app.use('/module', authenticate(), modulemaster);
app.use('/partners', authenticate(), partners);
app.use('/typelookup', authenticate(), metadataconfig);
app.use('/nodemaster', authenticate(), nodemaster);
app.use('/othersetup', authenticate(), othersetup);
app.use('/notificationtemplates', authenticate(), notificationtemplates);
app.use('/ModelMasters', authenticate(), modelmaster);
app.use('/Models', authenticate(), model);
app.use('/address', authenticate(), address);
app.use('/region', authenticate(), region);
app.use('/returnreason', authenticate(), returnreason);
app.use('/rule', authenticate(), rule);
app.use('/returntype', authenticate(), returntype);
app.use('/messagetemplate', authenticate(), MessageTemplate);
app.use('/OrderSettings', authenticate(), ordersetting);
app.use('/ordertaskflow', authenticate(), ordertaskflow);
app.use('/location', authenticate(), location);
app.use('/manage/tenant', authenticate(), admin_Tenant);
app.use('/soOrder', authenticate(), soOrder);
app.use('/uomMaster', authenticate(), uomMaster);
app.use('/itemmaster', authenticate(), itemmaster);
app.use('/itemcategories', authenticate(), itemcategories);
app.use('/manufacturer', authenticate(), manufacturer);
app.use('/salesreturnorder', authenticate(), SROrder);
app.use('/receiving', authenticate(), receiving);
app.use('/shipmentorder', authenticate(), Shipment);
app.use('/reports', authenticate(), reports);
app.use('/TimeZones', authenticate(), timezone);
app.use('/productcatalog', authenticate(), productcatalog);
app.use('/return', authenticate(), returns);
app.use('/language', authenticate(), language);
app.use('/report', authenticate(), analytics);
app.use('/ga_return', authenticate(), gareturns);
app.use('/bp_return', authenticate(), bpreturns);
app.use('/consumer_return', authenticate(), consumerreturns);
app.use('/productCategory',authenticate(),productCategory);
app.use('/productSubCategory',authenticate(),productSubCategory);
app.use('/productGrade',authenticate(),productGrade);
app.use('/productGrouping',authenticate(),productGrouping);
app.use('/B2BUser',authenticate(),B2BUser);
app.use('/ProductCatalog',authenticate(),ProductCatalog);
app.use('/caseCreation',caseCreation);
app.use('/ProductSize',authenticate(),ProductSize);
app.use('/ProductPriceList',authenticate(),ProductPriceList);
app.use('/caseCreation',authenticate(),caseCreation);
app.use('/state', authenticate(), state);
app.use('/color', authenticate(), color);
app.use('/Orders', authenticate(), Orders);
app.use('/CaseAssessment', authenticate(), CaseAssessment);
app.use('/season', authenticate(), season);
app.use('/repair_resolution',authenticate(),repair_resolution);
app.use('/returnReasonRootCause',authenticate(),returnReasonRootCause);
app.use('/returnReasonIssue',authenticate(),returnReasonIssue);
app.use('/returnReasonLocation',authenticate(),returnReasonLocation);
app.use('/repair_charges',authenticate(),repair_charges);

app.use('/CaseValidation', authenticate(),CaseValidation);

app.use('/caseCreationCP',caseCreationCP);
app.use('/city',authenticate(),city);
app.use('/Configuration',authenticate(),Configuration);
app.use('/repairMaterial',authenticate(),repairMaterial);
app.use('/productLocation',authenticate(),productLocation);


/** Control Private through OAuth **/

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', reason.stack || reason)
});

process.on('uncaughtException', (err, origin) => {
  console.log(`Caught exception: ${err}\n` +
    `Exception origin: ${origin}`);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

process.on('uncaughtException', (err, origin) => {
  console.log(process.stderr.fd, `Caught exception: ${err}\n` + `Exception origin: ${origin}`);
});

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', reason.stack || reason);
})


module.exports = app;
