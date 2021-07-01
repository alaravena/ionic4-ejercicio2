import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {

  tituloPagina = 'Detalle';
  personaje = null;

  constructor(private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe(params => {
        this.personaje = JSON.parse(params.personaje);
    });
  }

  ngOnInit() {
    console.log(this.personaje);
    this.tituloPagina = this.personaje.first_name;
  }

}
