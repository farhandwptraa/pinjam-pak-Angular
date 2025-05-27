import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilAkunComponent } from './profil-akun.component';

describe('ProfilAkunComponent', () => {
  let component: ProfilAkunComponent;
  let fixture: ComponentFixture<ProfilAkunComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilAkunComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilAkunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
