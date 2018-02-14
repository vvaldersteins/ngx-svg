/**
 * Import Angular Libraries.
 */
import { NgModule } from '@angular/core';

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

@NgModule({
  imports: [],
  exports: [
    SvgContainerComponent,
    SvgRectDirective,
    SvgCircleDirective,
    SvgEllipseDirective,
    SvgLineDirective,
    SvgPolylineDirective,
    SvgPolygonDirective
  ],
  declarations: [
    SvgContainerComponent,
    SvgRectDirective,
    SvgCircleDirective,
    SvgEllipseDirective,
    SvgLineDirective,
    SvgPolylineDirective,
    SvgPolygonDirective
  ],
  providers: [],
})
export class NgxSvgModule { }
