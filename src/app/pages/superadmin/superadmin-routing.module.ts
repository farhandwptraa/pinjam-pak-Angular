import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { UserManagementComponent } from './user-management/user-management.component';
import { EmployeeManagementComponent } from './employee-management/employee-management.component';
import { RoleManagementComponent } from './role-management/role-management.component';

const routes: Routes = [
    {
      path: 'users',
      loadComponent: () =>
        import('./user-management/user-management.component').then(
          m => m.UserManagementComponent
        ),
    },
    {
      path: 'employee',
      loadComponent: () =>
        import('./employee-management/employee-management.component').then(
          m => m.EmployeeManagementComponent
        ),
    },
    {
      path: 'roles',
      loadComponent: () =>
        import('./role-management/role-management.component').then(
          m => m.RoleManagementComponent
        ),
    },
    {
      path: 'branch',
      loadComponent: () =>
        import('./branch-management/branch-management.component').then(
          m => m.BranchManagementComponent
        ),
    },
  ];  

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperadminRoutingModule {}