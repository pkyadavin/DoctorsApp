import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { _returnsObject, _OrderObject } from './returns.model';

@Injectable()
export class ReturnDataService {
  private rDataSource = new BehaviorSubject(null);
  returnDataSource = this.rDataSource.asObservable();

  private oDataSource = new BehaviorSubject(null);
  orderDataSource = this.oDataSource.asObservable();

  // private statusSource = new BehaviorSubject('');
  // statusMessage = this.statusSource.asObservable();

  // private rReaosnDataSource = new BehaviorSubject(null);
  // returnReasonDataSource = this.rReaosnDataSource.asObservable();

  changeReturnObjectData(_data: any) {
    this.rDataSource.next(_data);
  }

  changeOrderObjectData(_data: any) {
    this.oDataSource.next(_data);
  }

  // changeStatus(status: string) {
  //     this.statusSource.next(status);
  //   }

  // changeReturnReaosns(returnReasons: any) {
  //   this.rReaosnDataSource.next(returnReasons);
  // }

}