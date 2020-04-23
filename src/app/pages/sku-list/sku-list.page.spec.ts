import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SKUListPage } from './sku-list.page';

describe('SKUListPage', () => {
  let component: SKUListPage;
  let fixture: ComponentFixture<SKUListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SKUListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SKUListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
