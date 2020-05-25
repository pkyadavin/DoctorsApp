import { Component, OnInit } from '@angular/core';
import { LoaderService } from './loader.service';
declare var $: any;
@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {
  showLoader: boolean;
  constructor(
    private loaderService: LoaderService) {
}

ngOnInit() {
  $(".preloader").fadeOut();
  this.loaderService.status.subscribe((val: boolean) => {
      this.showLoader = val;
  });
}


}
