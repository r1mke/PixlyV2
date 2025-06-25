import { Component } from '@angular/core';
import { UploadPreviewComponent } from "../../shared/components/upload-preview/upload-preview.component";
import { NavBarComponent } from "../../shared/components/nav-bar/nav-bar.component";
import { UploadSubmitComponent } from "../../shared/components/upload-submit/upload-submit.component";
@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [NavBarComponent, UploadSubmitComponent, ],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css'
})
export class UploadComponent {

}
