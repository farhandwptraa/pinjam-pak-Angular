import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PengajuanAccComponent } from './pengajuan-acc.component';

describe('PengajuanAccComponent', () => {
  let component: PengajuanAccComponent;
  let fixture: ComponentFixture<PengajuanAccComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PengajuanAccComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PengajuanAccComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
