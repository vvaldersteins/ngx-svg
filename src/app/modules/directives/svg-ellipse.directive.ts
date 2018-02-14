/**
 * Import Angular libraries.
 */
import { Directive, Input, Output, AfterViewChecked, EventEmitter } from '@angular/core';

/**
 * Import third-party libraries.
 */
import * as SVG from 'svgjs';

/**
 * Import custom components.
 */
import { SvgContainerComponent } from '../components/svg-container/svg-container.component';

@Directive({
  selector: 'svg-ellipse'
})
export class SvgEllipseDirective implements AfterViewChecked {
  /**
   * Globally used variables within the directive.
   */
  private _ellipse: SVG.Ellipse;

  /**
   * Import variables for the ellipse directive.
   */
  @Input() height: number; // Height of the ellipse.
  @Input() width: number; // Width of the ellipse.
  @Input() color = '#000'; // Color of the ellipse background
  @Input() x = 0; // Starting point on x axis.
  @Input() y = 0; // Starting point on y axis.
  /**
   * Output variables for the ellipse directive.
   */
  @Output() clickEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() doubleClickEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() mouseOverEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() mouseOutEvent: EventEmitter<MouseEvent> = new EventEmitter();

  /**
   * Create SVG Ellipse directive.
   * @param _svgContainer - Host SVG Container Component object instance.
   */
  constructor(
    private _svgContainer: SvgContainerComponent
  ) { }

  /**
   * Creates or updates the ellipse object within the container
   */
  ngAfterViewChecked() {
    // Check if container is creatted and no ellipse object is created
    if (this._svgContainer.getContainer() && !this._ellipse) {
      this.createEllipse();
    } else if (this._ellipse) {
      // If we have already created the object, update it.
      this.updateEllipse();
    }
  }

  /**
   * Update ellipse object within the SVG container.
   */
  updateEllipse() {
    this._ellipse
      .size(this.width, this.height) // Update the width and height
      .fill(this.color) // Update the color
      .attr('cx', +this.x + +this.width) // Set x position
      .attr('cy', +this.y + +this.height); // Set y position
  }

  /**
   * Create ellipse object within the SVG container.
   */
  createEllipse() {
    this._ellipse = this._svgContainer.getContainer()
      .ellipse(this.width, this.height) // Set height and width of the ellipse
      .fill(this.color) // Set fill color
      .attr('cx', +this.x + +this.width) // Set x position
      .attr('cy', +this.y + +this.height) // Set y position
      .on('click', evt => this.clickEvent.emit(evt)) // Assign click event
      .on('dblclick', evt => this.doubleClickEvent.emit(evt)) // Assign double click event
      .on('mouseover', evt => this.mouseOverEvent.emit(evt)) // Assign mouse over event
      .on('mouseout', evt => this.mouseOutEvent.emit(evt)); // Assign mouse out event
  }
}
