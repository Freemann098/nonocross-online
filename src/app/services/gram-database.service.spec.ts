import { TestBed } from '@angular/core/testing';

import { GramDatabaseService } from './gram-database.service';

describe('GramDatabaseService', () => {
  let service: GramDatabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GramDatabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
