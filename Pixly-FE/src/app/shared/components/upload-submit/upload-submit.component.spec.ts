import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadSubmitComponent } from './upload-submit.component';

describe('UploadSubmitComponent', () => {
  let component: UploadSubmitComponent;
  let fixture: ComponentFixture<UploadSubmitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadSubmitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
