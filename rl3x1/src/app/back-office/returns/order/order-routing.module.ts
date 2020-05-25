import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { OrderComponent } from "./order.component";
import { AuthGuard } from "src/app/auth.guard";

const routes: Routes = [
  // {path:':order', pathMatch:'full', component:OrderComponent},
  {
    path: ":queue/:brandCode/:order/:coTrackingNo",
    pathMatch: "full",
    component: OrderComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule {}
