/**
 * Import Angular Libraries.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Import custom components.
 */
import { SvgContainerComponent } from './components/svg-container/svg-container.component';

/**
 * Import custom directives.
 */
import { SvgRectDirective } from './directives/svg-rect.directive';
import { SvgCircleDirective } from './directives/svg-circle.directive';
import { SvgEllipseDirective } from './directives/svg-ellipse.directive';
import { SvgLineDirective } from './directives/svg-line.directive';
import { SvgPolylineDirective } from './directives/svg-polyline.directive';
import { SvgPolygonDirective } from './directives/svg-polygon.directive';
import { SvgImageDirective } from './directives/svg-image.directive';
import { SvgPathDirective } from './directives/svg-path.directive';
import { SvgTextDirective } from './directives/svg-text.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    SvgContainerComponent,
    SvgRectDirective,
    SvgCircleDirective,
    SvgEllipseDirective,
    SvgLineDirective,
    SvgPolylineDirective,
    SvgPolygonDirective,
    SvgImageDirective,
    SvgPathDirective,
    SvgTextDirective
  ],
  declarations: [
    SvgContainerComponent,
    SvgRectDirective,
    SvgCircleDirective,
    SvgEllipseDirective,
    SvgLineDirective,
    SvgPolylineDirective,
    SvgPolygonDirective,
    SvgImageDirective,
    SvgPathDirective,
    SvgTextDirective
  ],
  providers: [],
})
export class NgxSvgModule { }
