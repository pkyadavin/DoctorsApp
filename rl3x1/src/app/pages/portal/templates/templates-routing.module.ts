import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { TemplatesComponent } from "./templates.component";

const routes: Routes = [
  {
    path: "return",
    component: TemplatesComponent,
    children: [
      { path: "t3/:brand", loadChildren: "./t3/t3.module#T3Module" },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TemplatesRoutingModule {}
