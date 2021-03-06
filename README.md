# Ionic 4 - Ejercicio 1

Paso a paso de la soluci贸n del ejercicio de m贸dulo 1 en curso de entrenamiento de ionic 4 para docentes Duoc UC 2021

## Comenzando 馃殌

Si descargan este repositorio, no olviden de ejecutar _npm install_

Los commit van en el mismo orden que la ejecuci贸n del ejercicio

### 1. Crear una aplicaci贸n con tabs

```bash
ionic start ionic4-ejercicio4 tabs --type=angular --cordova
```

Configurar con la id, el nombre y la descripci贸n en **config.xml**

```xml
<widget id="cl.duoc.cursoionic.ejercicio4" ...>
    <name>Ionic Native</name>
    <description>Ejercicio 4 del taller de Ionic</description>
```

### 2. Crear una p谩gina de perfil. Usar storage para manejar el nickname

Para cambiar el nombre del tab, el componente que maneja el menu-tab esta en **src/app/tabs**. Ahi podemos manejar tanto el html como el controlador ts. Entonces podemos dejar el primer tab como:

```html
  <ion-tab-button tab="tab1">
      <ion-icon name="person-circle-outline"></ion-icon>
      <ion-label>Perfil</ion-label>
    </ion-tab-button>
```

Como es el primer plugin que usaremos en el proyecto, debemos instalar el core de ionic native (1 sola vez por proyecto):

```bash
npm install @ionic-native/core
```

Y ahora instalar Cordova Native Storage y su respectivo wrapper de ionic:

```bash
ionic cordova plugin add cordova-plugin-nativestorage
npm install @ionic-native/native-storage
```

En el m贸dulo de la app **app.module.ts** importamos el paquete:

```ts
import { NativeStorage } from '@ionic-native/native-storage/ngx';
```

Y lo agregamos a la lista de proveiders:

```ts
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    NativeStorage
  ],
```

Para usarlo en el componente del primer tab, llamado **tab1**, podemos estructurar su html de manera tal que tengamos un input para el ingreso del nombre, un bot贸n para guardarlo, un boton para borrarlo y modificamos el t铆tulo de la cabecera para mostrar que es lo qu茅 se ha guardado:

```html
<ion-header>
  <ion-toolbar>
    <ion-title>
      {{bienvenido}}
    </ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>

  <ion-item>
    <ion-label position="stacked">Ingresar Nickname</ion-label>
    <ion-input clearInput value="clear me" placeholder="Nickname" [(ngModel)]="nickname"></ion-input>
  </ion-item>

    <ion-button expand="block" (click)="guardarNombre()"><ion-icon name="person-circle-outline"></ion-icon> Guardar</ion-button>
    <ion-button expand="block" (click)="eliminarNombre()" color="danger"><ion-icon name="trash-outline"></ion-icon> Borrar</ion-button>

</ion-content>
```

Y configuraremos el controlador primero para activar el funcionamiento del plugin:

```ts
import { NativeStorage } from '@ionic-native/native-storage/ngx';
//... decoradores
export class Tab1Page {

  constructor(
    private nativeStorage: NativeStorage
  ) {}
```

Crearemos `nickname: string;` justo antes del constructor para almacenar el valor del nickname mientras est茅 abierta la aplicaci贸n. Para guardarlo en storage nativo, de manera que se pueda recuperar al siguiente uso de la app, creamos:

```ts
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
```

Esto se gatillar谩 al precionar el bot贸n *Guardar*

Debemos crear `bienvenido = 'Bienvenid@';` para almacenar el mensaje a mostrar en el t铆tulo del tab. Luego, la funci贸n que nos permitir谩 mostrar el mensaje dependiendo del nickname almacenado:

```ts
  setBienvenido(mensaje: string = null) {
    this.bienvenido = mensaje + ' ' + this.nickname;
  }
```

Para recuperar el nickname la siguiente vez que se utilice la app, creamos la funci贸n:

```ts
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
```

La cual invocaremos en el constructor:

```ts
constructor(
    private nativeStorage: NativeStorage
  ) {
    this.recuperarNombre();
  }
```

Finalmente, el borrar los datos almacenados, que ser谩 gatillado desde un bot贸n en la vista, usaremos:

```ts
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
```

### 3. Crear una p谩gina que permita tomar fotograf铆as

Cambiamos el html que maneja el menu-tab:

```html
  <ion-tab-button tab="tab2">
      <ion-icon name="camera-outline"></ion-icon>
      <ion-label>C谩mara</ion-label>
  </ion-tab-button>
```

Instalamos el plugin:

```bash
ionic cordova plugin add cordova-plugin-camera
npm install @ionic-native/camera
```

Lo agregamos al m贸dilo de la app:

```ts
import { Camera } from '@ionic-native/camera/ngx';
//...
providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    NativeStorage,
    Camera
  ],
//...
```

Ahora lo agregamos importamos al controlador de **tab2**, incluyendo el objeto para las opciones que debemos configurar.

```ts
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
//..
constructor(
    private camera: Camera
  ) {}
```

Debemos iniciarlizar, antes del constructor, el array donde iremos guardando las im谩genes y las opciones para la c谩mara:

```ts
  images: Array<string> = [];

  opciones: CameraOptions = {
    destinationType: this.camera.DestinationType.DATA_URL,
    targetWidth: 1000,
    targetHeight: 1000,
    quality: 100
  };
```

Agregamos la funci贸n que, al tomar la foto, agregar谩 la imagen, como texto base64, a nuestro array:

```ts
tomarFoto(){
    this.camera.getPicture( this.opciones )
      .then(imageData => {
        this.images.push(`data:image/jpeg;base64,${imageData}`);
      })
      .catch(error => {
        console.error( error );
      });
  }
```

Finalmente agregamos a la vista, un boton para tomar la foto y una lista de cards con im谩genes para mostrar las fotos como galer铆a:

```html
<ion-button color="medium" expand="full" (click)="tomarFoto()"><ion-icon name="camera-outline"></ion-icon> Tomar Fotograf铆a </ion-button>

  <ion-list *ngIf="images">
    <ion-card *ngFor="let img of images.reverse()" class="col-6">
      <ion-img [src]="img"></ion-img>
    </ion-card>
  </ion-list>
```

Un bonito desaf铆o puede ser guardar el array de im谩genes (que no son mas que un string) a trav茅s de native storage que ya tenemos instalado y rescatarlo al volver a abrir la aplicaci贸n.

### 4. Agregar una nueva p谩gina que muestre la geolocalizaci贸n actual y en tiempo real

### 5. Mostrar la direcci贸n de la ubicaci贸n
