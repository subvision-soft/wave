import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Camera, CameraResultType, CameraSource} from "@capacitor/camera";

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
  }
  image = '';
  async captureImage(){
    const image = await Camera.getPhoto({
      quality : 100,
      allowEditing:false,
      source: CameraSource.Prompt,
      resultType:CameraResultType.Base64
    })
  }
}
