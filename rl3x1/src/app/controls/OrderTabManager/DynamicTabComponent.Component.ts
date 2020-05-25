import { NgModule, Type, Component, Compiler, ViewContainerRef, ViewChild, Input, ComponentRef, ComponentFactory, ComponentFactoryResolver, ChangeDetectorRef } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule } from '@angular/forms'
//import { LineItems } from './LineItem/LineItem.Component'
//import { OrderLog } from './OrderLog/OrderLog.Component'
@Component({
    selector: 'DynamicTabComponent',
    template: `<div #target></div>`,
    //entryComponents: [LineItems, OrderLog]
})
export class DynamicTabComponent {
    @ViewChild('target', { read: ViewContainerRef }) target;
    @Input() type;
    @Input() ModuleName;
    @Input() Source;
    cmpRef: ComponentRef<any>;
    private isViewInitialized: boolean = false;
    constructor(private componentFactoryResolver: ComponentFactoryResolver, private compiler: Compiler,
        private cdRef: ChangeDetectorRef) { }

    updateComponent() {
        if (!this.isViewInitialized) {
            return;
        }
        if (this.cmpRef) {
            this.cmpRef.destroy();
        }

        var factories = Array.from(this.componentFactoryResolver['_factories'].keys());
        var factoryClass = <Type<any>>factories.find((x: any) => x.name === this.type);
        let factory = this.componentFactoryResolver.resolveComponentFactory(factoryClass);
        this.cmpRef = this.target.createComponent(factory)
        // to access the created instance use
        this.cmpRef.instance.Source = this.Source;
        this.cmpRef.instance.ModuleName = this.ModuleName;
        // this.compRef.instance.someOutput.subscribe(val => doSomething());
        this.cdRef.detectChanges();
    }

    ngOnChanges() {
        this.updateComponent();
    }

    ngAfterViewInit() {
        this.isViewInitialized = true;
        this.updateComponent();
    }

    ngOnDestroy() {
        if (this.cmpRef) {
            this.cmpRef.destroy();
        }
    }
}
