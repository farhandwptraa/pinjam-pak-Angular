import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// shared module
import { SharedModule } from 'src/shared.module';

const routes: Routes = [
    {
      path: 'main',
      loadComponent: () =>
        import('./main/main.component').then(
          m => m.MainComponent
        ),
    },
  ];  

@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule, SharedModule.forRoot()],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}

