import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalPreviewComponent } from './total-preview.component';

describe('TotalPreviewComponent', () => {
  let component: TotalPreviewComponent;
  let fixture: ComponentFixture<TotalPreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TotalPreviewComponent]
    });
    fixture = TestBed.createComponent(TotalPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
