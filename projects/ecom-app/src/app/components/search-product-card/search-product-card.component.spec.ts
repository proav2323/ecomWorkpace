import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchProductCardComponent } from './search-product-card.component';

describe('SearchProductCardComponent', () => {
  let component: SearchProductCardComponent;
  let fixture: ComponentFixture<SearchProductCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchProductCardComponent]
    });
    fixture = TestBed.createComponent(SearchProductCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
