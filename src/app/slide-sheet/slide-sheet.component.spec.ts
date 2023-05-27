import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideSheetComponent } from './slide-sheet.component';

describe('SlideSheetComponent', () => {
  let component: SlideSheetComponent;
  let fixture: ComponentFixture<SlideSheetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SlideSheetComponent]
    });
    fixture = TestBed.createComponent(SlideSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
