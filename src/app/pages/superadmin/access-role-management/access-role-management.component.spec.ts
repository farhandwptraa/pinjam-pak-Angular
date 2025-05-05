import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessRoleManagementComponent } from './access-role-management.component';

describe('AccessRoleManagementComponent', () => {
  let component: AccessRoleManagementComponent;
  let fixture: ComponentFixture<AccessRoleManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessRoleManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessRoleManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
