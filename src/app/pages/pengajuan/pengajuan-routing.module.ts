import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PengajuanListComponent } from './pengajuan-list/pengajuan-list.component';


const routes: Routes = [
    {
      path: 'list',
      loadComponent: () =>
        import('./pengajuan-list/pengajuan-list.component').then(
          m => m.PengajuanListComponent
        ),
    },
    {
      path: 'approval',
      loadComponent: () =>
        import('./pengajuan-approval/pengajuan-approval.component').then(
          m => m.PengajuanApprovalComponent
        ),
    },
    {
      path: 'acc',
      loadComponent: () =>
        import('./pengajuan-acc/pengajuan-acc.component').then(
          m => m.PengajuanAccComponent
        ),
    },
    {
      path: 'disburse',
      loadComponent: () =>
        import('./pengajuan-disburse/pengajuan-disburse.component').then(
          m => m.PengajuanDisburseComponent
        ),
    },
  ];  

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PengajuanRoutingModule {}