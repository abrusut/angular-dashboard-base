import { NgModule } from '@angular/core';
import { ImagenPipe } from './imagen.pipe';
import { DateCustomPipe } from './date.custom.pipe';

@NgModule({
  imports: [
  ],
  declarations: [
    ImagenPipe,
    DateCustomPipe
  ],
  exports: [
    ImagenPipe,
    DateCustomPipe
  ]
})
export class PipesModule { }
