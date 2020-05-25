import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "src/app/auth.guard";
import { GaReturnsComponent } from "./ga-returns.component";

const routes: Routes = [
  {
    path: "",
    component: GaReturnsComponent,
    children: [
      {
        path: "gaqueue",
        loadChildren: "./gaqueue/queue.module#GaQueueModule",
        canActivateChild: [AuthGuard]
      },
      {
        path: "gaqueue",
        loadChildren: "./gaeditor/gaeditor.module#GaeditorModule",
        canActivateChild: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GaReturnsRoutingModule {}
