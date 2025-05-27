import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component'; 
import { SharedModule } from 'src/shared.module';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    LoginComponent, SharedModule
  ],
  exports: [RouterModule]
})
export class AuthRoutingModule {}