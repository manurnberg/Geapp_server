import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPassConfirmComponent } from './reset-pass-confirm.component';

describe('ResetPassConfirmComponent', () => {
  let component: ResetPassConfirmComponent;
  let fixture: ComponentFixture<ResetPassConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetPassConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPassConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
