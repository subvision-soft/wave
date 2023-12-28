import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpencvImshowComponent } from './opencv-imshow.component';

describe('OpencvImshowComponent', () => {
  let component: OpencvImshowComponent;
  let fixture: ComponentFixture<OpencvImshowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpencvImshowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OpencvImshowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
