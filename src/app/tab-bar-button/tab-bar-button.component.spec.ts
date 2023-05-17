import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabBarButtonComponent } from './tab-bar-button.component';

describe('TabBarButtonComponent', () => {
  let component: TabBarButtonComponent;
  let fixture: ComponentFixture<TabBarButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TabBarButtonComponent]
    });
    fixture = TestBed.createComponent(TabBarButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
