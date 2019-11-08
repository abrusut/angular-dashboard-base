import { Component, OnInit } from '@angular/core';

// Esto esta en common.js y son metodos de jquerycl
declare function init_plugins();

@Component({
  selector: 'app-nopagefound',
  templateUrl: './nopagefound.component.html',
  styleUrls: ['./nopagefound.css']
})
export class NopagefoundComponent implements OnInit {

  anio:number = new Date().getFullYear();
  constructor() { }

  ngOnInit() {
    init_plugins();
  }

}
