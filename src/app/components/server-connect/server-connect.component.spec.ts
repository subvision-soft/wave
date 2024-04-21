import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerConnectComponent } from './server-connect.component';

describe('ServerConnectComponent', () => {
  let component: ServerConnectComponent;
  let fixture: ComponentFixture<ServerConnectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServerConnectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServerConnectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
