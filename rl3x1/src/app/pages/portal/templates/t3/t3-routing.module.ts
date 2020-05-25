import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { T3Component } from "./t3.component";

const routes: Routes = [
  {
    path: ":domain",
    component: T3Component,
    children: [
      {
        path: "search/:language",
        loadChildren: "./t3-search/t3-search.module#T3SearchModule"
      },
      {
        path: "step1/:language/:order",
        loadChildren: "./t3-step1/t3-step1.module#T3Step1Module"
      },
      {
        path: "step2/:language/:order",
        loadChildren: "./t3-step2/t3-step2.module#T3Step2Module"
      },
      {
        path: "step3/:language/:order",
        loadChildren: "./t3-step3/t3-step3.module#T3Step3Module"
      },
      {
        path: "track/:language/:order",
        loadChildren: "./t3-track/t3-track.module#T3TrackModule"
      },
      {
        path: "track-all/:language",
        loadChildren: "./t3-track-all/t3-track-all.module#T3TrackAllModule"
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class T3RoutingModule {}
