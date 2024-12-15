import { TestBed } from '@angular/core/testing';

import { GeoservicesService } from './geoservices.service';

describe('GeoservicesService', () => {
  let service: GeoservicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeoservicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
