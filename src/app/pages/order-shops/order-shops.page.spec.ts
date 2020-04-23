import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderShopsPage } from './order-shops.page';

describe('OrderShopsPage', () => {
  let component: OrderShopsPage;
  let fixture: ComponentFixture<OrderShopsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderShopsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderShopsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
