# Ionic 4 - Ejercicio 2

Paso a paso de la soluci贸n del ejercicio de m贸dulo 2 en curso de entrenamiento de ionic 4 para docentes Duoc UC 2021. Es continuaci贸n del m贸dulo 1

## Comenzando 馃殌

Si descargan este repositorio, no olviden de ejecutar _npm install_

Los commit van en el mismo orden que la ejecuci贸n del ejercicio.

### 1 Continuar con la aplicaci贸n del m贸dulo 1

Pueden continuar desde el c贸digo en ionic4-ejercicio1

### 2 Debugear la aplicaci贸n

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

Importar el cliente http en el m贸dulo de la app:

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

Ahora en el controlador de la p谩gina home no necesitaremos el JSON con el ejemplo, lo inyectaremos desde el servicio

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

Agregamos la inyecci贸n de datos:

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

Y llamamos a esta funci贸n desde el constructor:

```ts
this.listarUsuarios();
```

Como los nombres de los par谩metros han cambiado con respecto al ejemplo, debemos actualizar la interpolaci贸n:

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

### 4 Crear p谩ginas y conexi贸n a servicios para funci贸n agregar

En el servicio, usaremos POST para la funci贸n agregar:

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

En el front, lo mas adecuado pensando en UI/UX m贸vil, es agregar un bot贸n que gatille el "agregar" a traves de un componente tipo aperta. Para eso en el html del home agregamos el boton:

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
          alert(`Se cre贸 correctamente el usuario ${respuesta.name}`);
      },
      (error) => {
        console.error(error);
      }
    );
  };
```

Lo que se debe hacer cuando responde el servicio depende de lo que se quiera hacer. Se puede pushar la respuesta al listado (en esta caso no se puede porque no son los mismos par谩metros) o llamar nuevamente a la funci贸n de listado, entre otras formas.

### 5 Agregar funci贸n para editar

En el servicio, usaremos PUT para la funci贸n editar:

```ts
actualizarUsuario(idUsuario: number, usuario: any): Promise <any> {
    return new Promise ((resolve, reject) => {
        this.httpClient.put(this.urlBase + idUsuario, usuario)
        .subscribe(res => {
            resolve(res);
        }, (err) => {
            reject(err);
        });
    });
  };
```

Para la interfaz de usuario, usaremos el gesto de slide para un item de lista. Con esto podemos poner varios botones deslizando a la derecha (start) o a la izquierda (end). Dejaremos tambi茅n listo el html para el eliminar, por lo que nuestra lista queda ahora asi:

```html
<ion-list *ngIf="listaPersonajes">

    <ion-item-sliding *ngFor='let personaje of listaPersonajes'>
      <ion-item-options side="start">
        <ion-item-option (click)="mostrarAlertaEditar(personaje)">Editar</ion-item-option>
      </ion-item-options>
  
      <ion-item>
        <ion-avatar slot="start">
          <img [src]='personaje.avatar'>
        </ion-avatar>
        <ion-label>
            <h2>{{ personaje.first_name }}</h2>
            <h3>{{ personaje.last_name }}</h3>
        </ion-label>
        <ion-icon class="ff" name="arrow-forward" (click)="gotoDetalles(personaje)"></ion-icon>  
      </ion-item>
  
      <ion-item-options side="end">
        <ion-item-option color="danger" (click)="mostrarAlertaEliminar(personaje)">Eliminar</ion-item-option>
      </ion-item-options>
    </ion-item-sliding>

  </ion-list>
```

Ahora creamos la funci贸n que muestra la alerta pero con lon inputs ya rellenados. A modo de ejemplo, en vez de job, como es un campo que no tenemos, usaremos el last_name

```ts
async mostrarAlertaEditar(persona) {
    const alert = await this.alertController.create({
      header: 'Editar Usuario',
      inputs: [
        {
          name: 'name',
          type: 'text',
          value: persona.first_name,
          placeholder: 'Nombre'
        },
        {
          name: 'job',
          type: 'text',
          value: persona.last_name,
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
          text: 'Editar',
          handler: (data) => {
            console.log('Confirm Ok');
            this.agregarUsuario(data);

          }
        }
      ]
    });

    await alert.present();
  }
```

Y ahora consumir el servicio:

```ts
editarUsuario(usuario) {
      this.usuariosService.actualizarUsuario(usuario.id, usuario)
        .then(respuesta => {
            console.log(respuesta);
            alert(`Se actualiz贸 correctamente el usuario ${respuesta.name}`);
        }, (error) => { console.error(error); }
      );
  }
```

### 6 Agregar funci贸n para eliminar
