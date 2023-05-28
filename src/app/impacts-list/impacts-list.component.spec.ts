import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpactsListComponent } from './impacts-list.component';

describe('ImpactsListComponent', () => {
  let component: ImpactsListComponent;
  let fixture: ComponentFixture<ImpactsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImpactsListComponent]
    });
    fixture = TestBed.createComponent(ImpactsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
