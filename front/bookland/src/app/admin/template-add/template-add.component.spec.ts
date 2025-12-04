import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateAddComponent } from './template-add.component';

describe('TemplateAddComponent', () => {
  let component: TemplateAddComponent;
  let fixture: ComponentFixture<TemplateAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TemplateAddComponent]
    });
    fixture = TestBed.createComponent(TemplateAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
