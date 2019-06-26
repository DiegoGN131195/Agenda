import { TestBed } from '@angular/core/testing';

import { FileAgendaService } from './file-agenda.service';

describe('FileAgendaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FileAgendaService = TestBed.get(FileAgendaService);
    expect(service).toBeTruthy();
  });
});
