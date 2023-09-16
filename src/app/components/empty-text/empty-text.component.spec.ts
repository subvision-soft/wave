import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyTextComponent } from './empty-text.component';

describe('EmptyTextComponent', () => {
  let component: EmptyTextComponent;
  let fixture: ComponentFixture<EmptyTextComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmptyTextComponent]
    });
    fixture = TestBed.createComponent(EmptyTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
