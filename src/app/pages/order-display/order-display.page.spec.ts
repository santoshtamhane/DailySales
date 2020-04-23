import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDisplayPage } from './order-display.page';

describe('OrderDisplayPage', () => {
  let component: OrderDisplayPage;
  let fixture: ComponentFixture<OrderDisplayPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderDisplayPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDisplayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
