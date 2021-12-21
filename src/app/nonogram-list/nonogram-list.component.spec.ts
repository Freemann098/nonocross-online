import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonogramListComponent } from './nonogram-list.component';

describe('NonogramListComponent', () => {
  let component: NonogramListComponent;
  let fixture: ComponentFixture<NonogramListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonogramListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NonogramListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
