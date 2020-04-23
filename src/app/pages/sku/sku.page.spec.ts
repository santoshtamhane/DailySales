import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SKUPage } from './sku.page';

describe('SKUPage', () => {
  let component: SKUPage;
  let fixture: ComponentFixture<SKUPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SKUPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SKUPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
