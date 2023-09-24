import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetItemComponent } from './target-item.component';

describe('TargetItemComponent', () => {
  let component: TargetItemComponent;
  let fixture: ComponentFixture<TargetItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TargetItemComponent]
    });
    fixture = TestBed.createComponent(TargetItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
