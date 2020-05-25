export class OrderTabSource {
    LineItems: LineItem = new LineItem();
    Receive: Receive = new Receive();
    Inspect: any = [];
    PutAway: any = [];
    OrderLog: any = [];
}
export class Receive {
    isDisposed: boolean = false;
    OrderItems: any = [];
    RecievedItems: any = [];
}

export class LineItem {
    LineItemList: any = [];
}
