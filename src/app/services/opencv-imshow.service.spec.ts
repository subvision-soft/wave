import { TestBed } from '@angular/core/testing';

import { OpencvImshowService } from './opencv-imshow.service';

describe('OpencvImshowService', () => {
  let service: OpencvImshowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpencvImshowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
