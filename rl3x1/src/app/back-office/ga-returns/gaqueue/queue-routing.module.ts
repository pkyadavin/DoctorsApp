import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "src/app/auth.guard";
import { GaQueueComponent } from "./queue.component";

const routes: Routes = [
  {
    path: ":Code/:brand",
    pathMatch: "full",
    component: GaQueueComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QueueRoutingModule {}
