/**
 * Import Angular libraries.
 */
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

/**
 * Import third-party libraries.
 */
import { NgxSvgModule } from 'ngx-svg';

/**
 * Import custom components.
 */
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';

/**
 * Import custom pages.
 */
import { HomeComponent } from './pages/home/home.component';
import { RectComponent } from './pages/rect/rect.component';
import { CircleComponent } from './pages/circle/circle.component';
import { LineComponent } from './pages/line/line.component';
import { EllipseComponent } from './pages/ellipse/ellipse.component';
import { PolylineComponent } from './pages/polyline/polyline.component';
import { PolygonComponent } from './pages/polygon/polygon.component';
import { ImageComponent } from './pages/image/image.component';
import { PathComponent } from './pages/path/path.component';
import { TextComponent } from './pages/text/text.component';
import { GridComponent } from './pages/grid/grid.component';

/**
 * Define page routes.
 */
const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'rect', component: RectComponent },
  { path: 'circle', component: CircleComponent },
  { path: 'line', component: LineComponent },
  { path: 'ellipse', component: EllipseComponent },
  { path: 'polyline', component: PolylineComponent },
  { path: 'polygon', component: PolygonComponent },
  { path: 'image', component: ImageComponent },
  { path: 'path', component: PathComponent },
  { path: 'text', component: TextComponent },
  { path: 'grid', component: GridComponent },
  { path: '', pathMatch: 'full', redirectTo: '/home' }
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    RectComponent,
    CircleComponent,
    LineComponent,
    EllipseComponent,
    PolylineComponent,
    PolygonComponent,
    ImageComponent,
    PathComponent,
    TextComponent,
    GridComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      routes
    ),
    NgxSvgModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
