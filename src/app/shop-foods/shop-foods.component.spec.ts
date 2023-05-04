import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopFoodsComponent } from './shop-foods.component';

describe('ShopFoodsComponent', () => {
  let component: ShopFoodsComponent;
  let fixture: ComponentFixture<ShopFoodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopFoodsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopFoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
