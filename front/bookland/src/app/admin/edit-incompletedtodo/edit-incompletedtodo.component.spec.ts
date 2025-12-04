import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditIncompletedtodoComponent } from './edit-incompletedtodo.component';

describe('EditIncompletedtodoComponent', () => {
  let component: EditIncompletedtodoComponent;
  let fixture: ComponentFixture<EditIncompletedtodoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditIncompletedtodoComponent]
    });
    fixture = TestBed.createComponent(EditIncompletedtodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
