import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import { UsuariosService } from '../../services/usuarios.service';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  tituloPagina = 'Listado';
  listaPersonajes: any;

  constructor(
    public navCtrl: NavController,
    private usuariosService: UsuariosService,
    public alertController: AlertController
    ) {
      this.listarUsuarios();
    }

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
            this.agregarUsuario(data);

          }
        }
      ]
    });

    await alert.present();
  }

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

  async mostrarAlertaEditar(usuario) {
    const alert = await this.alertController.create({
      header: 'Editar Usuario',
      inputs: [
        {
          name: 'name',
          type: 'text',
          value: usuario.first_name,
          placeholder: 'Nombre'
        },
        {
          name: 'job',
          type: 'text',
          value: usuario.last_name,
          placeholder: 'Trabajo'
        },
        {
          name: 'id',
          type: 'text',
          value: usuario.id,
          placeholder: 'Id'
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
            this.editarUsuario(data);

          }
        }
      ]
    });

    await alert.present();
  }

  editarUsuario(usuario) {
      this.usuariosService.actualizarUsuario(usuario.id, usuario)
        .then(respuesta => {
            console.log(respuesta);
            alert(`Se actualizó correctamente el usuario ${respuesta.name}`);
        }, (error) => { console.error(error); }
      );
  }


  gotoDetalles(personaje: any) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
          personaje: JSON.stringify(personaje)
      }
    };
  this.navCtrl.navigateForward(['detalle/'], navigationExtras);
  };

}
