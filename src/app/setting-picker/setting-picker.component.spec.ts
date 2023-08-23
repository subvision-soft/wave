import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingPickerComponent } from './setting-picker.component';

describe('SettingPickerComponent', () => {
  let component: SettingPickerComponent;
  let fixture: ComponentFixture<SettingPickerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SettingPickerComponent]
    });
    fixture = TestBed.createComponent(SettingPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
