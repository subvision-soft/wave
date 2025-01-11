import { ComponentFixture, TestBed } from '@angular/core/testing';

import {UsersSessionComponent} from './users.component';

describe('UsersComponent', () => {
  let component: UsersSessionComponent;
  let fixture: ComponentFixture<UsersSessionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsersSessionComponent]
    });
    fixture = TestBed.createComponent(UsersSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
