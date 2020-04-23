import { TestBed } from '@angular/core/testing';

import { SKUServiceService } from './skuservice.service';

describe('SKUServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SKUServiceService = TestBed.get(SKUServiceService);
    expect(service).toBeTruthy();
  });
});
