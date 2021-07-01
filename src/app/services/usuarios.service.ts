import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  urlBase = 'https://reqres.in/api/users/';

  constructor(private httpClient: HttpClient) { }

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

  eliminarUsuario(idUsuario: number): Promise <any> {
    return new Promise ((resolve, reject) => {
        this.httpClient.delete(this.urlBase + idUsuario)
        .subscribe(res => {
            resolve(res);
        }, (err) => {
            reject(err);
        });
    });
  };





}
