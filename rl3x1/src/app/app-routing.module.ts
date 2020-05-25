import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthenticationComponent } from "./authentication/authentication.component";
import { BackOfficeComponent } from "./back-office/back-office.component";
import { AuthGuard } from "./auth.guard";

const routes: Routes = [
  { path: "portal", loadChildren: "./pages/portal/portal.module#PortalModule" },
  { path: "register", loadChildren: "./leads/leads.module#LeadsModule" },
  {
    path: "login",
    loadChildren: "./authentication/login/login.module#LoginModule"
  },
  {
    path: "auth",
    loadChildren: "./authentication/authentication.module#AuthenticationModule"
  },
  {
    path: "verifyaccount",
    loadChildren:
      "./leadVerification/leadVerification.module#LeadVerificationModule"
  },
  {
    path: "manage",
    loadChildren: "./rl-manager/rl-manager.module#RlManagerModule",
    canActivate: [AuthGuard]
  },
  {
    path: "",
    loadChildren: "./back-office/back-office.module#BackOfficeModule"
     ,canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
