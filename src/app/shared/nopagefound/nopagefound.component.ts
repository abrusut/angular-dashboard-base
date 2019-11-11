import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';



@Component({
  selector: 'app-nopagefound',
  templateUrl: './nopagefound.component.html',
  styleUrls: ['./nopagefound.css']
})
export class NopagefoundComponent implements OnInit {

  anio: number = new Date().getFullYear();
  constructor(private location: Location) { }

  ngOnInit() {

  }

  goBack() {
    this.location.back();
  }

}
