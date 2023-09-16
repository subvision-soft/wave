import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuActionComponent } from './menu-action.component';

describe('MenuActionComponent', () => {
  let component: MenuActionComponent;
  let fixture: ComponentFixture<MenuActionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenuActionComponent]
    });
    fixture = TestBed.createComponent(MenuActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
