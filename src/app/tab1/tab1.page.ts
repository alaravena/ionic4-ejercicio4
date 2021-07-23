import { Component } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  nickname: string;
  bienvenido = 'Bienvenid@';

  constructor(
    private nativeStorage: NativeStorage
  ) {
    this.recuperarNombre();
  }
  guardarNombre(){
    this.nativeStorage.setItem('nickname', this.nickname)
      .then(
        () => {
        this.setBienvenido('Bienvenid@ ');
        console.log(this.nickname);
        },
        error => console.error('Error al guardar item: ', error)
      );
  }

  setBienvenido(mensaje: string = null) {
    this.bienvenido = mensaje + ' ' + this.nickname;
  }

  recuperarNombre() {
    this.nativeStorage.getItem('nickname')
      .then(
      data => {
        this.nickname = data;
        this.setBienvenido('Bienvenid@ nuevamente ');
      console.log(data);
      },
      error => console.error('Error al recuperar item: ', error)
      );
  }

  eliminarNombre() {
    this.nativeStorage.remove('nickname')
    .then(
    () => {
      this.nickname = '';
      this.setBienvenido('Adios!');
      console.log('Item eliminado');
    },
    error => console.error('Error al borrar item: ', error)
    );
  }

}
