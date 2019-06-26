import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaDialogComponent } from './agenda-dialog.component';

describe('AgendaDialogComponent', () => {
  let component: AgendaDialogComponent;
  let fixture: ComponentFixture<AgendaDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgendaDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
