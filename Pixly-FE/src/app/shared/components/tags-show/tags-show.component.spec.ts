import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsShowComponent } from './tags-show.component';

describe('TagsShowComponent', () => {
  let component: TagsShowComponent;
  let fixture: ComponentFixture<TagsShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagsShowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagsShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
