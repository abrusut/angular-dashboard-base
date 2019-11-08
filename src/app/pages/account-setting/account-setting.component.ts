import { Component, OnInit, Inject } from '@angular/core';
import { SettingsService } from '../../services/service.index';


@Component({
  selector: 'app-account-setting',
  templateUrl: './account-setting.component.html',
  styles: []
})
export class AccountSettingComponent implements OnInit {

  constructor( private settingsService: SettingsService ) { }

  ngOnInit() {
    this.colocarCheck();
  }

  cambiarTema(tema: string, link: any) {
    console.log(tema, link);
    this.aplicarCheck(link);
    this.settingsService.aplicarTema(tema);
  }

  aplicarCheck(link: any)
  {
    const selectores: any = document.getElementsByClassName('selector');

    for (const ref of selectores)
    {
      ref.classList.remove('working');
    }

    link.classList.add('working');
  }

  colocarCheck()
  {
    const selectores: any = document.getElementsByClassName('selector');
    const tema: string = this.settingsService.ajustes.tema;

    for (const ref of selectores)
    {
      ref.classList.remove('working');
      if ( ref.getAttribute('data-theme') === tema )
      {
        ref.classList.add('working');
        break;
      }
    }
  }
}
