import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component'; 
import { SharedModule } from 'src/shared.module';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    HomeComponent, SharedModule
  ],
  exports: [RouterModule]
})
export class LandingRoutingModule {}