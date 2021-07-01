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
            this.agregarUsuario(data.name, data.job)

          }
        }
      ]
    });

    await alert.present();
  }

  agregarUsuario(name: string, job: string) {
    let usuario = {
      'name': name,
      'job': job
    }
    console.log(usuario)
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
