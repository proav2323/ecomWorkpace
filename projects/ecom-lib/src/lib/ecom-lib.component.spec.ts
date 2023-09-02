import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcomLibComponent } from './ecom-lib.component';

describe('EcomLibComponent', () => {
  let component: EcomLibComponent;
  let fixture: ComponentFixture<EcomLibComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EcomLibComponent]
    });
    fixture = TestBed.createComponent(EcomLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
