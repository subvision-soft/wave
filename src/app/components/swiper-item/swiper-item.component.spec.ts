import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwiperItemComponent } from './swiper-item.component';

describe('SwiperItemComponent', () => {
  let component: SwiperItemComponent;
  let fixture: ComponentFixture<SwiperItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwiperItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwiperItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
