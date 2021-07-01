# Ionic 4 - Ejercicio 2

Paso a paso de la solución del ejercicio de módulo 2 en curso de entrenamiento de ionic 4 para docentes Duoc UC 2021. Es continuación del módulo 1

## Comenzando 🚀

Si descargan este repositorio, no olviden de ejecutar _npm install_

Los commit van en el mismo orden que la ejecución del ejercicio.

### 1 Continuar con la aplicación del módulo 1

Pueden continuar desde el código en ionic4-ejercicio1

### 2 Debugear la aplicación

Para usarla en el celular:

```bash
ionic cordava run android --device
```

Para debugear, se puede usar Google Chrome con la ruta:

<chrome://inspect/#devices>

### 3 Consumir servicio para el listado y el detalle

Debemos crear un servicio usando:

```bash
ionic generate service services/usuarios
```

Importar el cliente http en el módulo de la app:

```ts
import { HttpClientModule } from '@angular/common/http';

@NgModule({

  imports: [
    //...
    HttpClientModule
  ],

})
```

Y lo agregamos al typescript del service:

```ts
import { HttpClient } from '@angular/common/http';

//...
export class UsuariosService {

  urlBase = 'https://reqres.in/api/users/';

  constructor(private httpClient: HttpClient) { }
}
```

Fijarse que agregamos la url base para este servicio

Ahora agregamos el GET para el listado de usuarios

```ts
obtenerListadoUsuarios(): Promise <any> {
    return new Promise ((resolve, reject) => {
        this.httpClient.get(this.urlBase)
        .subscribe(res => {
            resolve(res);
        }, (err) => {
            reject(err);
      });
    });
  };
```

Ahora en el controlador de la página home no necesitaremos el JSON con el ejemplo, lo inyectaremos desde el servicio

```ts
import { UsuariosService } from '../../services/usuarios.service';
//...
export class HomePage {

  tituloPagina = 'Listado';
  listaPersonajes: any;

  constructor(
    public navCtrl: NavController,
    private usuariosService: UsuariosService,
    ) { }
}

```

Agregamos la inyección de datos:

```ts
listarUsuarios() {
      this.usuariosService.obtenerListadoUsuarios()
        .then(respuesta => {
            console.log(respuesta);
            this.listaPersonajes = respuesta.data;
          },
          (error) => {
            console.error(error);
          }
      );
  }
```

Y llamamos a esta función desde el constructor:

```ts
this.listarUsuarios();
```

Como los nombres de los parámetros han cambiado con respecto al ejemplo, debemos actualizar la interpolación:

```html
<ion-list *ngIf="listaPersonajes">
    <ion-item *ngFor='let personaje of listaPersonajes'>
      <ion-avatar slot="start">
        <img [src]='personaje.avatar'>
      </ion-avatar>
      <ion-label>
          <h2>{{ personaje.first_name }}</h2>
          <h3>{{ personaje.last_name }}</h3>
      </ion-label>
      <ion-icon class="ff" name="arrow-forward" (click)="gotoDetalles(personaje)"></ion-icon>
    </ion-item>
  </ion-list>
```

### 4 Crear páginas y conexión a servicios para función agregar

En el servicio, usaremos POST para la función agregar:

```ts
crearUsuario(usuario: any): Promise <any> {
    return new Promise ((resolve, reject) => {
        this.httpClient.post(this.urlBase, usuario)
        .subscribe(respuesta => {
            resolve(respuesta);
        }, (error) => {
            reject(error);
        });
    });
  };
```

En el front, lo mas adecuado pensando en UI/UX móvil, es agregar un botón que gatille el "agregar" a traves de un componente tipo aperta. Para eso en el html del home agregamos el boton:

```html
  <ion-fab vertical="bottom" horizontal="end" slot="fixed">
    <ion-fab-button color="success" (click)="mostrarAlertaAgregar()">
      <ion-icon name="add"></ion-icon>
    </ion-fab-button>
  </ion-fab>
```

Por lo que debemos agregarla en el controlador:

```ts
import { AlertController } from '@ionic/angular';

//...
constructor(
   //...
    public alertController: AlertController
    )}
```

Y construir la alerta desde el controlador:

```ts
async mostrarAlertaAgregar() {
    const alert = await this.alertController.create({
      header: 'Crear Usuario',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Nombre'
        },
        {
          name: 'job',
          type: 'text',
          placeholder: 'Trabajo'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Agregar',
          handler: (data) => {
            console.log('Confirm Ok');
            this.agregarUsuario(data)
          }
        }
      ]
    });
```

Finalmente el, agregamos el usuario con el servicio:

```ts
agregarUsuario(usuario) {
    this.usuariosService.crearUsuario(usuario)
      .then(respuesta => {
        console.log(respuesta);
          alert(`Se creó correctamente el usuario ${respuesta.name}`);
      },
      (error) => {
        console.error(error);
      }
    );
  };
```

Lo que se debe hacer cuando responde el servicio depende de lo que se quiera hacer. Se puede pushar la respuesta al listado (en esta caso no se puede porque no son los mismos parámetros) o llamar nuevamente a la función de listado, entre otras formas.

### 5 Agregar función para editar

### 6 Agregar función para eliminar
