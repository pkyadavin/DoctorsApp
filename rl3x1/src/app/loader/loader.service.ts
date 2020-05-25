import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
declare var $: any;
@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  public status: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {  $(".preloader").fadeOut();}

  display(value: boolean) {
    this.status.next(value);
    if(value){
      $(".preloader").fadeIn();
    }else{
      $(".preloader").fadeOut();
    }
}

}
