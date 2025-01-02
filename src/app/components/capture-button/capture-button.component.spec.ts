import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaptureButton} from './capture-button.component';

describe('LoaderComponent', () => {
  let component: CaptureButton;
  let fixture: ComponentFixture<CaptureButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaptureButton]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CaptureButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
