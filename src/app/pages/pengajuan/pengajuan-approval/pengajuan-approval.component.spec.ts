import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PengajuanApprovalComponent } from './pengajuan-approval.component';

describe('PengajuanApprovalComponent', () => {
  let component: PengajuanApprovalComponent;
  let fixture: ComponentFixture<PengajuanApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PengajuanApprovalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PengajuanApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
