import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedGramTreeComponent } from './saved-gram-tree.component';

describe('SavedGramTreeComponent', () => {
  let component: SavedGramTreeComponent;
  let fixture: ComponentFixture<SavedGramTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavedGramTreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedGramTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
