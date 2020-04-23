import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSKUsPage } from './order-skus.page';

describe('OrderSKUsPage', () => {
  let component: OrderSKUsPage;
  let fixture: ComponentFixture<OrderSKUsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderSKUsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderSKUsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
