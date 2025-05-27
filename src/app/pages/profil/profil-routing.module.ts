import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// shared module
import { SharedModule } from 'src/shared.module';

const routes: Routes = [
    {
      path: 'akun',
      loadComponent: () =>
        import('./profil-akun/profil-akun.component').then(
          m => m.ProfilAkunComponent
        ),
    },
  ];  

@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule, SharedModule.forRoot()],
  exports: [RouterModule]
})
export class ProfilRoutingModule {}

