import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PengajuanListComponent } from './pengajuan-list.component';

describe('PengajuanListComponent', () => {
  let component: PengajuanListComponent;
  let fixture: ComponentFixture<PengajuanListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PengajuanListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PengajuanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
