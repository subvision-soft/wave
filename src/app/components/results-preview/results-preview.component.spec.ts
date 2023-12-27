import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsPreviewComponent } from './results-preview.component';

describe('ResultsPreviewComponent', () => {
  let component: ResultsPreviewComponent;
  let fixture: ComponentFixture<ResultsPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultsPreviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResultsPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
