import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownPopularityComponent } from './dropdown-popularity.component';

describe('DropdownPopularityComponent', () => {
  let component: DropdownPopularityComponent;
  let fixture: ComponentFixture<DropdownPopularityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownPopularityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropdownPopularityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
