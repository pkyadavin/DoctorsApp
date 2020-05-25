import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { caseCreationService } from './caseCreation.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../shared/common.service'
import { Property, Util } from '../../app.util';
import { CaseCreationModel,intakeOrdersModel,ProductInfoModel,ReturnShipingModel,PersonalInfoModel,CountryStateCityColor } from './caseCreation.model.js';
import { GlobalVariableService } from '../../shared/globalvariable.service';
import { SidebarService } from '../sidebar/sidebar.service';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { LoaderService } from '../../loader/loader.service';
declare var $: any;
@Component({
    selector: 'CaseCreation',
    providers: [caseCreationService],
    templateUrl: './caseCreation.html'
})

export class caseCreation extends Property {
    //IsGridLoaded: boolean = false;
    //@Input() GridType: string;
  //  @Input('PartnerId') PartnerId: number;
    //@Output() notifyBillingCode: EventEmitter<any> = new EventEmitter<any>();
    //Countrylist: any
    //filterText: string;
    loading: boolean;
    //dataSource: any;
    //gridOptions: GridOptions;
    errorMessage: string;
    //countries: CaseCreationModel[];
    IsLoaded: boolean = false;
    ListView: boolean = false;
    partnerID: number;
    isEditConfigSetup$ = false;
    isAddConfigSetup$ = true;
    isDeleteConfigSetup$ = false;
    isCancel$ = false;
    RegionList: any;
    UserID: number;
   isSaveClick: any;
    searchreasult:any;
    CurrentCaseCreationObj: CaseCreationModel = new CaseCreationModel();
    _intakeOrdersModel:intakeOrdersModel [];
    _SelectedIntakeOrdersModel:intakeOrdersModel [];
    _ProductInfoModel:ProductInfoModel=new ProductInfoModel();
    _ReturnShipingModel:ReturnShipingModel [];//=new ReturnShipingModel();
    _PersonalInfoModel:PersonalInfoModel [];//=new PersonalInfoModel();
    _SelectedReturnShipingModel:ReturnShipingModel ;//=new ReturnShipingModel();
    _SelectedPersonalInfoModel:PersonalInfoModel ;//=new PersonalInfoModel();
    ProductInfo:boolean=false;
    personalInfo:boolean=false;
    returnShipingInfo:boolean=false ;
    PreviewData:boolean=false;
    _Country:CountryStateCityColor [];
    _State:CountryStateCityColor [];
    _City:CountryStateCityColor [];
    _Color:CountryStateCityColor [];
    _Size:CountryStateCityColor [];
    _Issue:CountryStateCityColor [];
    _Language:CountryStateCityColor [];
    _SelectedLanguage:CountryStateCityColor [];
    _IssueMainArray:CountryStateCityColor [];
    _IssueParent:CountryStateCityColor [];
    _RootCause:CountryStateCityColor [];
    _Location:CountryStateCityColor [];
    _MasterLocation:CountryStateCityColor [];
    _SelectedRootCause:CountryStateCityColor[] ;//[];
    _SelectedLocation:CountryStateCityColor[];// [];
    _SelectedIssue:CountryStateCityColor[];//[]
    _SelectedParentIssue:CountryStateCityColor[];
    PersonalInfoSearch:string;
    DialogDisplay:string="none";
    DdlSettings = {};
    DdlMultiSelSettings={}
    _DialogSetting:CountryStateCityColor=new CountryStateCityColor();
    isItemSelected:any={value:true};
    SavedCaseNo:string;
    DialogCaseNo:string="none";
    invalidPhone:boolean=true;
    showShiping:boolean=true
    GuidedSearch:boolean=true;
    constructor(
        private _util: Util,private _menu: SidebarService, private _router: Router,
        private caseService: caseCreationService, public commonService: CommonService, private _globalService: GlobalVariableService, 
        private activateRoute: ActivatedRoute, private loaderService: LoaderService) {
        super();
        this.moduleTitle = this._menu.menus.filter(f => f.routeKey === this._router.url)[0].title;
        var partnerinfo = _globalService.getItem('partnerinfo');
        this.partnerID = partnerinfo[0].LogInUserPartnerID;
        this.UserID=partnerinfo[0].UserId;
        this._intakeOrdersModel = [];
        this._SelectedIntakeOrdersModel=[];
        this._Country=[];
        this._State=[];
        this._City=[];
        this._Color=[];
        this._Size=[];
        this._Issue=[];
        this._IssueMainArray=[];
        this._IssueParent=[];
        this._RootCause=[];
        this._Location=[];
        this._MasterLocation=[]
        this._SelectedRootCause=[];// new CountryStateCityColor();
        this._SelectedLocation=[];// new CountryStateCityColor();
        this._SelectedIssue=[];//new CountryStateCityColor();
        this._SelectedParentIssue=[];
        this._PersonalInfoModel=[];
        this._ReturnShipingModel=[];
        this._SelectedReturnShipingModel=new ReturnShipingModel();
        this._SelectedPersonalInfoModel=new PersonalInfoModel
        this._Language=[];
        this._SelectedLanguage=[];
    }
    ngOnInit() {
       // this.loadPermissionByModule(this.moduleTitle);
         this.GetRegions();
        //this.filterText = null;
        //this.Countrylist = [];

        this.loading = false;
        this.DdlSettings = {
            "singleSelection": true,
            "idField": 'id',
            "textField": 'name',
            //selectAllText: 'Select All',
            //unSelectAllText: 'UnSelect All',
            "itemsShowLimit": 2,
            "allowSearchFilter": true,
            "closeDropDownOnSelection":true,
            "enableCheckAll":false
          };
          this.DdlMultiSelSettings = {
            "singleSelection": false,
            "idField": 'id',
            "textField": 'name',
            //selectAllText: 'Select All',
            //unSelectAllText: 'UnSelect All',
            "itemsShowLimit": 2,
            "allowSearchFilter": true,
            "closeDropDownOnSelection":true,
            "enableCheckAll":false
          };
        this.GetColorSizeIssueCountry();
        // this._Issue.push(new CountryStateCityColor({id:1,code:'dm',name:'Damaged'}),
        //                     new CountryStateCityColor({id:2,code:'re',name:'Replace'}));
    }

    GetColorSizeIssueCountry(){
        this.caseService.GetColorSizeIssueCountry()
        .subscribe(Result => {
            var color=Result["data"][0];
            var size=Result["data"][1];
            var country=Result["data"][2];
            var rootcause=Result["data"][3];
            var issue=Result["data"][4];
            var location=Result["data"][5];
            var language=Result["data"][6];

            this._Color.length=0;
            this._Size.length=0;
            this._Issue.length=0;
            this._IssueMainArray.length=0;
            this._IssueParent.length=0;
            this._Country.length=0;
            this._RootCause.length=0;
            //this._Location.length=0;
            this._MasterLocation.length=0;
            for(let i=0;i<color.length;i++){
                this._Color.push(new CountryStateCityColor(color[i]));
            }
            for(let i=0;i<size.length;i++){
                this._Size.push(new CountryStateCityColor(size[i]));
            }
            for(let i=0;i<issue.length;i++){
                this._IssueMainArray.push(new CountryStateCityColor(issue[i]));
            }
            for(let i=0;i<country.length;i++){
                this._Country.push(new CountryStateCityColor(country[i]));
            }
            for(let i=0;i<rootcause.length;i++){
                this._RootCause.push(new CountryStateCityColor(rootcause[i]));
            }
            for(let i=0;i<location.length;i++){
                this._MasterLocation.push(new CountryStateCityColor(location[i]));
            }
            this._IssueParent=this._IssueMainArray
                                    .filter(x=>x.ParentID==0)
                                    .sort(function(a, b){return a.id - b.id});
            for(let i=0;i<language.length;i++){
                this._Language.push(new CountryStateCityColor(language[i]));
            }
        },
        error => this.errorMessage = <any>error);
    }

    searchPoWoNo(){
        this.loaderService.display(true);
        this.caseService.searchPOWoNo(this.CurrentCaseCreationObj.PoWoNo)
        .subscribe(Result => {
            this.loaderService.display(false);
            var result = Result[result];
            if (Result["result"] == "No record found.") {
                this._util.info(Result["result"],'Info');
                return;
            }
            else{
                this._intakeOrdersModel.length=0;
                for(var i=0;i<Result["data"][0].length;i++){
                    var tempData:intakeOrdersModel=new intakeOrdersModel(Result["data"][0][i])
                    this._intakeOrdersModel.push(tempData);
                }
                this.ListView=true;
                this.ProductInfo=true;
            }
        },
        error => {
            this.loaderService.display(false);
            this.errorMessage = <any>error;
        });
        //error => this.errorMessage = <any>error);
    }

    GetRegions() {
        this.caseService.getRegions().
            subscribe(
           region => {

                this.RegionList =region;
               // alert(JSON.stringify(this.RegionList));
            },
            Error => this.errorMessage = <any>Error
            );
    }

    SaveData() {
        this.CurrentCaseCreationObj.CreatedBy = this.UserID
        this.CurrentCaseCreationObj._intakeOrderData=this._SelectedIntakeOrdersModel;
        this.CurrentCaseCreationObj._PersonalInfoData=this._SelectedPersonalInfoModel;
        this.CurrentCaseCreationObj._ReturnShipinData=this._SelectedReturnShipingModel;
        if (this.CurrentCaseCreationObj.CaseID == undefined) {
            this.CurrentCaseCreationObj.CaseID = 0;
        }
        this.loaderService.display(true);
        this.caseService.Save(this.CurrentCaseCreationObj)
            .subscribe(returnvalue => {
                this.loaderService.display(false);
                var result = returnvalue.data;
                if (result == "Added") {
                    this._util.success('Record has been saved successfully.', 'Alert');
                    this.isEditConfigSetup$ = false;
                    this.CurrentCaseCreationObj = new CaseCreationModel();
                    this.Cancel();
                    this.SavedCaseNo='Generated Case No : '+returnvalue.caseNo[0][0][""];
                    this.openCaseNoDialog();
                    return;
                }
                else if (result == "Updated") {
                    this._util.success('Record has been updated successfully.', 'Alert');
                    this.isEditConfigSetup$ = false;
                    this.CurrentCaseCreationObj = new CaseCreationModel();
                    this.Cancel();
                    return;
                }
                else {
                    this._util.error('Could not be saved. Something went wrong.','Alert');
                    return;
                }
            },
            error => {
                this.loaderService.display(false);
                this.errorMessage = <any>error;
            });
            //error => this.errorMessage = <any>error);
    }

    loadPermissionByModule(Module: string) {
        var partnerinfo = this._globalService.getItem('partnerinfo')[0];
     
        this.commonService.loadPermissionByModule(partnerinfo.UserId, partnerinfo.LogInUserPartnerID, this.moduleTitle).subscribe(
            returnvalue => {
                var localpermission = returnvalue[0] || [];
                this.LocalAccess = localpermission.map(function (item) {
                    return item['FunctionName'];
                });
                //if (this.IsGridLoaded) {
                //    this.gridOptions.api.setDatasource(this.dataSource);
                //}
            }
        )
    }
    // onCheckboxChange(e) {
    //     if (e.target.checked) {
    //       console.log(e.target.value);
    //     } else {
    //        const index = this.searchreasult.findIndex(x => x.value === e.target.value);
    //        console.log(index);
    //     }
    
    //   }

      fileChange(e: any, sourceData,isItemSelected) {
    
        let files = e.target.files;

        if (this.validateImages(files, isItemSelected)) {
        //   //==========For Upload Api============//
           let _formData: FormData = new FormData();
        //   //===================upload with Image Compressor functionality========================
        //   let images: Array<IImage> = [];
        //   let processedImages: any = [];
        //   let compressedImages:any=[];
        //   ImageCompressService.filesToCompressedImageSource(files).then(observableImages => {
        //   observableImages.subscribe((image) => {
        //       images.push(image);
        //     }, (error) => {
        //       console.log("Error while converting");
        //     }, () => {
        //         processedImages = images;
        //         var ss:string;
        //         for (let i = 0; i < processedImages.length; i++) {
        //           ss=processedImages[i].compressedImage.imageDataUrl.split('base64,')[1];
        //           processedImages[i].compressedImage.imageDataUrl=ss;
        //           compressedImages.push(processedImages[i].compressedImage);
        //           const imageBlob = this.dataURItoBlob(processedImages[i].compressedImage.imageDataUrl,processedImages[i].type);
        //           _formData.append("UserImage",imageBlob,processedImages[i].fileName);
        //         }
        //         this._InspectionlotService.uploadImages(_formData).subscribe(data => {
        //             for (let index = 0; index < data.files.length; index++) {
        //               this.inspectionLotObj.files.push({ type: data.files[index].split("/").pop(), url: data.files[index],detailid: parseInt(detail_id),attachmentid: 0});
        //             }
        //             this.uploadLoader=false;
        //         },
        //         errors => console.log(errors));  
        //         this.uploadLoader=true;    
        //     });
        //   });
          //======================upload without compress functionality====================================
          for (let i = 0; i < files.length; i++) {
             _formData.append('UserImage', files[i]);
          }
          this.loaderService.display(true);
          this.caseService.uploadImages(_formData).subscribe(data => {
            this.loaderService.display(false);
            for (let index = 0; index < data.files.length; index++) {
                for(let i=0;i<this._intakeOrdersModel.length;i++){
                    if(this._intakeOrdersModel[i].order_id==sourceData.order_id)
                        this._intakeOrdersModel[i].files.push({ type: data.files[index].split("/").pop(), url: data.files[index],order_id: parseInt(sourceData.order_id),attachmentid: 0});
                }
            }
          },
          error => {
            this.loaderService.display(false);
            this.errorMessage = <any>error;
            });
            // errors => console.log(errors));
            // this.uploadLoader=false;
        }
        //fileupload.value = "";
        
      }
      validateImages(files, isItemSelected): boolean {
        let _totalSize = 0;
        if (isItemSelected) {
          if (files.length == 0) {
            //this._util.error('Please upload atleast one file.', "Error");
            return false;
          }
          if (files.length <= 10) {
            // if (files.length > 0) {
              var pattern = /image-*/;
              for (let index = 0; index < files.length; index++) {
                if (!files[index].type.match(pattern)) {
                  this._util.error('Please upload images only.', "Alert");
                  return false;
                }
                _totalSize += files[index].size;
              }
              if (_totalSize > 20000000) {
                this._util.error('Total file size should be less than 20MB.', "Error");
                return false;
              }
            // }
            // else {
            //   this._util.error('Please upload atleast one file.', "Error");
            //   return false;
            // }
          }
          else {
            this._util.error('You cannot upload more than 10 files.', "Error");
            return false;
          }
        }
        else {
          this._util.error('Please select this item first.', "Error");
          return false;
        }
        return true;
      }
      GoToShiping(type:string){
          var issue=0,rootcause=0,location=0;
        if(type=='next'){
            for(let i=0;i<this._intakeOrdersModel.length;i++){
                for(let j=0;j<this._SelectedIntakeOrdersModel.length;j++){
                    if(this._intakeOrdersModel[i].order_id==this._SelectedIntakeOrdersModel[j].order_id)
                    {
                        this._SelectedIntakeOrdersModel[j].SelectedIssue=this._intakeOrdersModel[i].SelectedIssue;
                        issue=this._intakeOrdersModel[i].SelectedIssue.length==0?1:0;
                        this._SelectedIntakeOrdersModel[j].SelectedRootCause=this._intakeOrdersModel[i].SelectedRootCause;
                        rootcause=this._intakeOrdersModel[i].SelectedRootCause.id==0?1:0;
                        this._SelectedIntakeOrdersModel[j].SelectedLocation=this._intakeOrdersModel[i].SelectedLocation;
                        location=this._intakeOrdersModel[i].SelectedLocation.length==0?1:0;
                        this._SelectedIntakeOrdersModel[j].ReferenceNo=this._intakeOrdersModel[i].ReferenceNo;
                        this._SelectedIntakeOrdersModel[j].files=this._intakeOrdersModel[i].files;
                        this._SelectedIntakeOrdersModel[j].SelectedParentIssue=this._intakeOrdersModel[i].SelectedParentIssue;
                    }
                }
            }
        }
        if(this._SelectedIntakeOrdersModel.length==0){
            this._util.warning("Select at least one order to proceed","Warning");
            return;
        }
        if(issue==1 || rootcause==1 || location==1){
            this._util.warning("Please provide RootCause,Issue and Location for selected Item.","Warning");
            return;
        }
        this.ProductInfo=false;
        this.personalInfo=true;
        this.returnShipingInfo=true;
        this.PreviewData=false
      }
      GoToProduct(){
        this.ProductInfo=true;
        this.personalInfo=false;
        this.returnShipingInfo=false;
        this.PreviewData=false
      }
      GoToPreview(){
        if(this._SelectedLanguage.length>0)
            this._SelectedPersonalInfoModel.PreferredLanguage=this._SelectedLanguage[0].id;
        if(this._SelectedPersonalInfoModel.AccountNo=='' || this._SelectedReturnShipingModel.ShipToNo==''){
            this._util.warning("Select personal and shipping information to proceed","Warning");
            return;
        }
        if(this._SelectedPersonalInfoModel.PersonalMail!=''){
            if(!this.validateEmail(this._SelectedPersonalInfoModel.PersonalMail)){
                this._util.error("Please enter valid email.","Warning");
                return;
            }
        }
        if(this._SelectedPersonalInfoModel.PreferredLanguage==0){
            this._util.warning("Select Service Language to proceed.","Warning");
            return;
        }
        this.ProductInfo=false;
        this.personalInfo=false;
        this.returnShipingInfo=false;
        this.PreviewData=true
      }
      dialogSetting(type:string,index:any){
         this._SelectedIssue=[];//.length=0;
         this._SelectedParentIssue=[];//.length=0;
         this._SelectedRootCause=[];//.length=0;
         this._SelectedLocation=[];//.length=0;
         
        this._DialogSetting=new CountryStateCityColor();
        this._DialogSetting.code=type;
        this._DialogSetting.id=index;
        for(var i=0;i<this._intakeOrdersModel.length;i++){
            if(i==this._DialogSetting.id){
                switch(this._DialogSetting.code) { 
                    // case 'issue': { 
                    //         this._SelectedIssue.push(new CountryStateCityColor(this._intakeOrdersModel[i].SelectedIssue[0]));
                    //    break; 
                    // } 
                    // case 'RootCause': { 
                    //          this._SelectedRootCause.push(new CountryStateCityColor(this._intakeOrdersModel[i].SelectedRootCause));
                    //    break; 
                    // } 
                    case 'Location': { 
                            this._Location=this._MasterLocation.filter(x=>x.CategoryCode=this._intakeOrdersModel[i].category_code_id);;
                            //this._SelectedLocation.push(new CountryStateCityColor(this._intakeOrdersModel[i].SelectedLocation));
                        break; 
                     } 
                 }
            }
        }
      }
      getLocation(catcd:string){
        this.loaderService.display(true);
        this.caseService.getLocationFromCategory(catcd)
        .subscribe(Result => {
            this.loaderService.display(false);
            var result = Result[result];
            this._Location.length=0;
            if (Result["data"][0].length == 0) {
                this._util.info("No record found.",'Info');
                return;
            }
            else{
                for(let i=0;i<Result["data"][0].length;i++){
                    this._Location.push(new CountryStateCityColor(Result["data"][0][i]));
                }
            }
        },
        error => {
            this.loaderService.display(false);
            this.errorMessage = <any>error;
        });
      }
      onItemSelect(item: any) {
        console.log(item);
        for(var i=0;i<this._intakeOrdersModel.length;i++){
            if(i==this._DialogSetting.id){
                switch(this._DialogSetting.code) { 
                    case 'issue': { 
                        //this._intakeOrdersModel[i].SelectedIssue.push(item) 
                        this._intakeOrdersModel[i].SelectedIssue.push(item);
                       break; 
                    } 
                    case 'RootCause': { 
                        //this._intakeOrdersModel[i].SelectedRootCause.push(item)
                        this._intakeOrdersModel[i].SelectedRootCause=item;
                       break; 
                    } 
                    case 'Location': { 
                        //this._intakeOrdersModel[i].SelectedLocation.push(item)
                        this._intakeOrdersModel[i].SelectedLocation.push(item);
                        break; 
                     } 
                 }
            }
        }
        //item.length=0;
        this._SelectedIssue.length=0;//new CountryStateCityColor();
        this._SelectedRootCause.length=0;//new CountryStateCityColor();
        this._SelectedLocation.length=0;//new CountryStateCityColor();//
      }
      onSelectAll(items: any) {
        console.log(items);
      }
      SearchPersonInfo(SearchType){
        // if(this._PersonalInfoModel.length>0 && this._ReturnShipingModel.length>0)
        //   return;
        this.loaderService.display(true);
        this.caseService.GetPersonalInfoByNo(this.PersonalInfoSearch)
        .subscribe(Result => {
            this.loaderService.display(false);
            var result = Result[result];
            if (Result["data"][0].length == 0) {
                this._util.info("No record found.",'Info');
                return;
            }
            else{
                this._ReturnShipingModel.length=0;
                this._PersonalInfoModel.length=0;
                for(var i=0;i<Result["data"][0].length;i++){
                    this._PersonalInfoModel.push(new PersonalInfoModel(Result["data"][0][i]));
                }
                for(var i=0;i<Result["data"][1].length;i++){
                    this._ReturnShipingModel.push(new ReturnShipingModel(Result["data"][1][i]));
                }
                if(Result["data"][0].length>1){
                    this._DialogSetting.code='PersonalInfo'

                    this.openModalDialog();
                }
                this.showShiping=false;
            }
        },
        error => {
            this.loaderService.display(false);
            this.errorMessage = <any>error;
        });
      }
      openModalDialog(){
        this.DialogDisplay="block";
     }
    
     closeModalDialog(){
      this.DialogDisplay='none'; //set none css after close dialog
     }
     SelectPersonalShipingData(selectedData){
        if(this._DialogSetting.code=='PersonalInfo')
            this._SelectedPersonalInfoModel=new PersonalInfoModel(selectedData) ;//=new PersonalInfoModel();
        else if(this._DialogSetting.code=='ShippingInfo')
            this._SelectedReturnShipingModel=new ReturnShipingModel(selectedData) ;
        this.closeModalDialog();
     }
     SearchShippingInfo(){
        this._DialogSetting.code='ShippingInfo'
        this.openModalDialog();
     }
     toggleChange(e,selecteddata,index){
         if(e.target.checked){
            this._SelectedIntakeOrdersModel.push(new intakeOrdersModel(selecteddata));
         }
         else{
            for(var i=0;i<this._SelectedIntakeOrdersModel.length;i++){
                if(this._SelectedIntakeOrdersModel[i].order_id==selecteddata.order_id){
                    this._SelectedIntakeOrdersModel.splice (i,1);
                }
            }
        }
     }
     validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    Cancel(){
        this._intakeOrdersModel.length=0;
        this.ListView=false;
        this.ProductInfo=false;
        this.PreviewData=false;
        this.personalInfo=false;
        this._SelectedIntakeOrdersModel.length=0;
        this._PersonalInfoModel.length=0;
        this._ReturnShipingModel.length=0;
        this._SelectedPersonalInfoModel=new PersonalInfoModel();
        this._SelectedReturnShipingModel=new ReturnShipingModel();
    }
    openCaseNoDialog(){
        this.DialogCaseNo="block";
     }
    
    closeCaseNoDialog(){
        this.DialogCaseNo='none'; //set none css after close dialog
        this.SavedCaseNo='';
    }
    checkPhonelength(){
        //this._SelectedPersonalInfoModel.PersonalPhoneNo?.length
        if(this._SelectedPersonalInfoModel.PersonalPhoneNo.length!=0 ){
            if(this._SelectedPersonalInfoModel.PersonalPhoneNo.length<10 || this._SelectedPersonalInfoModel.PersonalPhoneNo.length>13)
                this.invalidPhone=false;
        }
    }
    SearchPO(event){
        //alert("You entered: po wo"+ event.target.value);
        this.searchPoWoNo();
    }
    SearchPerInfo(event){
        //alert("You entered: Personal info"+ event.target.value);
        this.SearchPersonInfo('PersonalInfo');
    }
    onIssueSelect(e){

        this._Issue=this._IssueMainArray
                    .filter(x=>x.ParentID==e.id)
                    .sort(function(a,b){return a.id-b.id});

        for(var i=0;i<this._intakeOrdersModel.length;i++){
            if(i==this._DialogSetting.id){
                //this._intakeOrdersModel[i].SelectedIssue.push(item) 
                this._intakeOrdersModel[i].SelectedParentIssue=e;
            }
        }
    }
    onLanguageSelect(e){
        this._SelectedPersonalInfoModel.PreferredLanguage=e.id;
    }
}