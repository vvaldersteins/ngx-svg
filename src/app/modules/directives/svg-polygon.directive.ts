/**
 * Import Angular libraries.
 */
import { Directive, Input, Output, AfterViewChecked, EventEmitter, OnDestroy } from '@angular/core';

/**
 * Import third-party libraries.
 */
import * as SVG from 'svgjs';

/**
 * Import custom components.
 */
import { SvgContainerComponent } from '../components/svg-container/svg-container.component';

@Directive({
  selector: 'svg-polygon'
})
export class SvgPolygonDirective implements AfterViewChecked, OnDestroy {
  /**
   * Globally used variables within the directive.
   */
  private _polygon: SVG.Polygon;

  /**
   * Import variables for the polyline directive.
   */
  @Input() points: SVG.PointArrayAlias; // Array with points in format [[x, y], [x1, y1], [x2, y2], ..., [xn, yn]].
  @Input() borderSize: number; // Size of the border.
  @Input() borderColor = '#000'; // Color of the line.
  @Input() fill = '#000'; // Color of the polygon body.

  /**
   * Output variables for the polyline directive.
   */
  @Output() clickEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() doubleClickEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() mouseOverEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() mouseOutEvent: EventEmitter<MouseEvent> = new EventEmitter();

  /**
   * Create SVG Polygon directive.
   * @param _svgContainer - Host SVG Container Component object instance.
   */
  constructor(
    private _svgContainer: SvgContainerComponent
  ) { }

  /**
   * Creates or updates the polygon object within the container.
   */
  ngAfterViewChecked() {
    // Check if container is creatted and no polygon object is created
    if (this._svgContainer.getContainer() && !this._polygon) {
      this.createPolygon();
    } else if (this._polygon) {
      // If we have already created the object, update it.
      this.updatePolygon();
    }
  }

  /**
   * Update polygon object within the SVG container.
   */
  updatePolygon() {
    this._polygon
      .plot(this.points) // Update the polygon object
      .fill(this.fill) // Fill color of the polygon
      .stroke({ color: this.borderColor, width: this.borderSize }); // Set the border for the polygon
  }

  /**
   * Create polygon object within the SVG container.
   */
  createPolygon() {
    this._polygon = this._svgContainer.getContainer()
      .polygon(this.points) // Create the polygon object
      .fill(this.fill) // Fill color of the polygon
      .stroke({ color: this.borderColor, width: this.borderSize }) // Set the border for the polygon
      .on('click', evt => this.clickEvent.emit(evt)) // Assign click event
      .on('dblclick', evt => this.doubleClickEvent.emit(evt)) // Assign double click event
      .on('mouseover', evt => this.mouseOverEvent.emit(evt)) // Assign mouse over event
      .on('mouseout', evt => this.mouseOutEvent.emit(evt)); // Assign mouse out event
  }

  /**
   * Does all required pre-requisites before destroying the component.
   */
  ngOnDestroy() {
    this._polygon.remove();
  }
}
