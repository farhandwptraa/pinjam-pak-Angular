import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PengajuanDisburseComponent } from './pengajuan-disburse.component';

describe('PengajuanDisburseComponent', () => {
  let component: PengajuanDisburseComponent;
  let fixture: ComponentFixture<PengajuanDisburseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PengajuanDisburseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PengajuanDisburseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
