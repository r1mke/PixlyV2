import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoOverviewComponent } from './photo-overview.component';

describe('PhotoOverviewComponent', () => {
  let component: PhotoOverviewComponent;
  let fixture: ComponentFixture<PhotoOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhotoOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
