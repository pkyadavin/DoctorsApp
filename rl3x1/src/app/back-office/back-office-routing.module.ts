import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import{BackOfficeComponent} from '../back-office/back-office.component'
import { AuthGuard } from '../auth.guard';

const routes: Routes = [
  {path: 'back-office',
        component: BackOfficeComponent,
        children: [
          { path: 'home', loadChildren: './home/home.module#HomeModule'},
          { path: 'resetpwd', loadChildren: './changepwd/changepwd.module#ChangepwdModule'},
          { path: 'partners', loadChildren: './Partner/partner.module#PartnerModule', canActivateChild:[AuthGuard] },
          { path: 'Configuration', loadChildren: './Configuration/Configuration.module#ConfigurationModule', canActivateChild:[AuthGuard] },
          //{ path: 'accounts', loadChildren: './Partner/partner.module#PartnerModule', canActivateChild:[AuthGuard] },
          //{ path: 'brands', loadChildren: './Partner/partner.module#PartnerModule', canActivateChild:[AuthGuard] },
          //{ path: 'returnreason', loadChildren: './ReturnReason/returnreason.module#ReturnReasonModule', canActivateChild:[AuthGuard] },
          //{ path: 'rules', loadChildren: './Rules/rule.module#RuleModule', canActivateChild:[AuthGuard] },
          { path: 'othersetup', loadChildren: './OtherSetup/OtherSetup.module#OtherSetupModule', canActivateChild:[AuthGuard] },
          { path: 'notificationtemplate', loadChildren: './notificationtemplate/notificationtemplate.module#NotificationTemplateModule', canActivateChild:[AuthGuard] },
          { path: 'modelmaster', loadChildren: './ModelMaster/modelmaster.module#ModelMasterModule', canActivateChild:[AuthGuard] },
          { path: 'role', loadChildren: './Role/role.module#RoleModule', canActivateChild:[AuthGuard] },
          //{ path: 'ReturnReasonCategory/:Scope', loadChildren: './ReturnType/returntype.module#ReturnTypeModule', canActivateChild:[AuthGuard] },
          { path: 'messageSetUp', loadChildren: './MessagingTemplate/messageTemplate.module#MessageTemplateModule', canActivateChild:[AuthGuard] },
          { path: 'fuser/PTR', loadChildren: './user/user.module#UserModule', canActivateChild:[AuthGuard] },
          { path: 'Product', loadChildren: './ProductCatalog/ProductCatalog.module#ProductCatalogModule', canActivateChild:[AuthGuard] },
          { path: 'UserB2B', loadChildren: './UserB2B/B2BUser.module#B2BUserModule', canActivateChild:[AuthGuard] },
          { path: 'PriceList', loadChildren: './ProductPriceList/ProductPriceList.module#ProductPriceListModule', canActivateChild:[AuthGuard] },
          //{ path: 'cpreturns/:ID', loadChildren: './OrderSettings/ordersettings.module#OrderSettingsModule', canActivateChild:[AuthGuard] },
          { path: 'Location', loadChildren: './Location/Location.module#LocationModule', canActivateChild:[AuthGuard] },
          //{ path: 'crma', loadChildren: './SalesReturnOrder/SalesReturnOrder.module#SalesReturnOrderModule', canActivateChild:[AuthGuard] },
          //{ path: 'arma', loadChildren: './AccountSRO/AccountSRO.module#AccountSROModule', canActivateChild:[AuthGuard] },
          //{ path: 'inventoryreport', loadChildren: './Reports/report.module#ReportModule', canActivateChild:[AuthGuard] },
          //{ path: 'shipment', loadChildren: './Shipment/shipment.module#ShipmentModule', canActivateChild:[AuthGuard] },
          { path: 'region', loadChildren: './Region/region.module#RegionModule', canActivateChild:[AuthGuard]},
          { path: 'country', loadChildren: './Country/country.module#CountryModule', canActivateChild:[AuthGuard]},
          { path: 'season', loadChildren: './Season/season.module#SeasonModule', canActivateChild:[AuthGuard]},
          { path: 'color', loadChildren: './Color/color.module#ColorModule', canActivateChild:[AuthGuard]},
          { path: 'Orders', loadChildren: './Orders/Orders.module#OrdersModule', canActivateChild:[AuthGuard]},
          { path: 'Case', loadChildren: './CaseAssessment/CaseAssessment.module#CaseAssessmentModule', canActivateChild: [AuthGuard] },
          { path: 'CaseValidation', loadChildren: './case-validation/case-validation.module#CaseValidationModule', canActivateChild: [AuthGuard] },
          { path: 'state', loadChildren: './State/state.module#StateModule', canActivateChild:[AuthGuard]},
          { path: 'product-category', loadChildren: './product-category/product-category.module#ProductCategoryModule', canActivateChild:[AuthGuard]},
          { path: 'Size', loadChildren: './ProductSize/ProductSize.module#ProductSizeModule', canActivateChild:[AuthGuard]},
          { path: 'product-subcategory', loadChildren: './product-subcategory/product-subcategory.module#ProductSubCategoryModule', canActivateChild:[AuthGuard]},
          { path: 'product-grade', loadChildren: './product-grade/product-grade.module#ProductGradeModule', canActivateChild:[AuthGuard]},
          { path: 'product-grouping', loadChildren: './product-grouping/product-grouping.module#ProductGroupingModule', canActivateChild:[AuthGuard]},
          { path: 'caseCreation', loadChildren: './caseCreation/caseCreation.module#caseCreationModule', canActivateChild:[AuthGuard]},
          { path: 'language', loadChildren: './language/language.module#LanguageModule', canActivateChild:[AuthGuard]},
          { path: 'repair-resolution', loadChildren: './repair-resolution/repair-resolution.module#Repair_ResolutionModule', canActivateChild:[AuthGuard]},
          { path: 'returnReason/rootCause', loadChildren: './ReturnReason/RootCause/RootCause.module#RootCauseModule'},
          { path: 'repair_charges', loadChildren: './repair-charges/repair-charges.module#Repair_ChargesModule', canActivateChild:[AuthGuard]},




          //{ path: 'returns', loadChildren: './returns/returns.module#ReturnsModule', canActivateChild:[AuthGuard]},
          //{ path: 'ga_returns', loadChildren: './ga-returns/ga-returns.module#GaReturnsModule', canActivateChild:[AuthGuard]},
          //{ path: 'con_returns', loadChildren: './consumer-returns/consumer-returns.module#ConsumerReturnsModule', canActivateChild:[AuthGuard]},
          { path: 'reports', loadChildren: './analytics/analytics.module#AnalyticsModule', canActivateChild:[AuthGuard]},
          { path: 'error', loadChildren: './error/error.module#ErrorModule'},
          { path: 'returnReason/issue', loadChildren: './ReturnReason/Issue/issue.module#IssueModule', canActivateChild:[AuthGuard]},
          { path: 'returnReason/location', loadChildren: './ReturnReason/Location/location.module#LocationModule', canActivateChild:[AuthGuard]},
          { path: 'city', loadChildren: './city/city.module#CityModule', canActivateChild:[AuthGuard]},
          { path: 'repairMaterial', loadChildren: './repair-material/repair-material.module#RepairMaterialModule', canActivateChild:[AuthGuard]},
          { path: 'productLocation', loadChildren: './product-location/product-location.module#ProductLocationModule', canActivateChild:[AuthGuard]},
        ]
      }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackOfficeRoutingModule { }
