/**
 * Import Angular libraries.
 */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

/**
 * Import custom modules.
 */
import { NgxSvgModule } from './modules/core.module';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    FormsModule,
    NgxSvgModule
  ],
  providers: [],
  bootstrap: []
})
export class AppModule { }
