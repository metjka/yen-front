import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {GalleryComponent} from './gallery/gallery.component';
import {RouterModule} from '@angular/router';
import { YenComponent } from './sketches/yen/yen.component';
import { WaveSquareComponent } from './sketches/wave-square/wave-square.component';

const routes = [
  {path: 'gallery', component: GalleryComponent},
  {path: 'wave-square', component: WaveSquareComponent},
  {path: '', redirectTo: 'gallery', pathMatch: 'full'},
];

@NgModule({
  declarations: [
    AppComponent,
    GalleryComponent,
    YenComponent,
    WaveSquareComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(
      routes,
      {})
  ],
  providers: [HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule {
}
