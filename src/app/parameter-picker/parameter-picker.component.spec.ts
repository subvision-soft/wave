import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterPickerComponent } from './parameter-picker.component';

describe('ParameterPickerComponent', () => {
  let component: ParameterPickerComponent;
  let fixture: ComponentFixture<ParameterPickerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParameterPickerComponent]
    });
    fixture = TestBed.createComponent(ParameterPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
