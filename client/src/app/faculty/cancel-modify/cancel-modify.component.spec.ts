import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelModifyComponent } from './cancel-modify.component';

describe('CancelModifyComponent', () => {
  let component: CancelModifyComponent;
  let fixture: ComponentFixture<CancelModifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelModifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
