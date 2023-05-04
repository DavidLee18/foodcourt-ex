import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerOrdersComponent } from './owner-orders.component';

describe('OwnerOrdersComponent', () => {
  let component: OwnerOrdersComponent;
  let fixture: ComponentFixture<OwnerOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OwnerOrdersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
