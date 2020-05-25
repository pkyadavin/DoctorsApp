import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { QueueComponent } from "./queue.component";
import { AuthGuard } from "src/app/auth.guard";

const routes: Routes = [
  {
    path: ":Code/:brand",
    pathMatch: "full",
    component: QueueComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: "always" 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QueueRoutingModule {}
