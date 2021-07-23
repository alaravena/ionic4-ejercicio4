import { Component } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  images: Array<string> = [];

  opciones: CameraOptions = {
    destinationType: this.camera.DestinationType.DATA_URL,
    targetWidth: 1000,
    targetHeight: 1000,
    quality: 100
  };

  constructor(
    private camera: Camera
  ) {}

  tomarFoto(){
    this.camera.getPicture( this.opciones )
      .then(imageData => {
        this.images.push(`data:image/jpeg;base64,${imageData}`);
      })
      .catch(error => {
        console.error( error );
      });
  }

}
