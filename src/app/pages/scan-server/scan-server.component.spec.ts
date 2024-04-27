import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanServerComponent } from './scan-server.component';

describe('ServerConnectComponent', () => {
  let component: ScanServerComponent;
  let fixture: ComponentFixture<ScanServerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScanServerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ScanServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
