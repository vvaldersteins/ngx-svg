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
  selector: 'svg-polyline'
})
export class SvgPolylineDirective implements AfterViewChecked, OnDestroy {
  /**
   * Globally used variables within the directive.
   */
  private _polyline: SVG.PolyLine;

  /**
   * Input variables for the polyline directive.
   */
  @Input() points: SVG.PointArrayAlias; // Array with points in format [[x, y], [x1, y1], [x2, y2], ..., [xn, yn]].
  @Input() borderSize: number; // Size of the border.
  @Input() borderColor = '#000'; // Color of the line.
  @Input() fill = '#000'; // Color of the polyline body

  /**
   * Output variables for the polyline directive.
   */
  @Output() clickEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() doubleClickEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() mouseOverEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() mouseOutEvent: EventEmitter<MouseEvent> = new EventEmitter();

  /**
   * Create SVG Polyline directive.
   * @param _svgContainer - Host SVG Container Component object instance.
   */
  constructor(
    private _svgContainer: SvgContainerComponent
  ) { }

  /**
   * Creates or updates the polyline object within the container.
   */
  ngAfterViewChecked() {
    // Check if container is creatted and no polyline object is created
    if (this._svgContainer.getContainer() && !this._polyline) {
      this.createPolyline();
    } else if (this._polyline) {
      // If we have already created the object, update it.
      this.updatePolyline();
    }
  }

  /**
   * Update polyline object within the SVG container.
   */
  updatePolyline() {
    this._polyline
      .plot(this.points) // Update the polyline object
      .stroke({ color: this.borderColor, width: this.borderSize }); // Set the border for the polyline
  }

  /**
   * Create polyline object within the SVG container.
   */
  createPolyline() {
    this._polyline = this._svgContainer.getContainer()
      .polyline(this.points) // Create the polyline object
      .fill(this.fill) // Fill color of the polyline
      .stroke({ color: this.borderColor, width: this.borderSize }) // Set the border for the polyline
      .on('click', evt => this.clickEvent.emit(evt)) // Assign click event
      .on('dblclick', evt => this.doubleClickEvent.emit(evt)) // Assign double click event
      .on('mouseover', evt => this.mouseOverEvent.emit(evt)) // Assign mouse over event
      .on('mouseout', evt => this.mouseOutEvent.emit(evt)); // Assign mouse out event
  }

  /**
   * Does all required pre-requisites before destroying the component.
   */
  ngOnDestroy() {
    this._polyline.remove();
  }
}
