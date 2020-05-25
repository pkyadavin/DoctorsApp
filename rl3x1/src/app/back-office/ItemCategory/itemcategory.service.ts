import { Injectable, Inject } from "@angular/core" 
import { Observable } from "rxjs"; 
import { Itemcategory } from "./itemcategory.model"
import { ConfigurationConstants } from '../../shared/constants'
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ItemCategoryService {   
  //  private _notificationTemplates: BehaviorSubject<KeyFieldAutoGenRule[]>;
    private baseUrl: string;
  
    constructor(private http: HttpClient) {
        this.baseUrl = ConfigurationConstants.BASEURL;
       
    }
 
    loadAll(): Observable<any> {       
        return this.http.get(`${this.baseUrl}itemcategories`);//.map(this.extractData);
    }
  
    save(item: Itemcategory): Observable<any> {
        return this.http.post(`${this.baseUrl}itemcategories`, JSON.stringify(item));//.map(this.extractData);
    }

    remove(ID: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}itemcategories/${ID}`);//.map(this.extractData);
    }
}

