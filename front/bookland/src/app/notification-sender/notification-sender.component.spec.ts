import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationSenderComponent } from './notification-sender.component';

describe('NotificationSenderComponent', () => {
  let component: NotificationSenderComponent;
  let fixture: ComponentFixture<NotificationSenderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationSenderComponent]
    });
    fixture = TestBed.createComponent(NotificationSenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
