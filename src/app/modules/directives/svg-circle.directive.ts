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
  selector: 'svg-circle'
})
export class SvgCircleDirective implements AfterViewChecked, OnDestroy {
  /**
   * Globally used variables within the directive.
   */
  private _circle: SVG.Circle;

  /**
   * Import variables for the circle directive.
   */
  @Input() radius: number; // Radius of the circle
  @Input() color = '#000'; // Color of the circle background
  @Input() x = 0; // Starting point on x axis.
  @Input() y = 0; // Starting point on y axis.

  /**
   * Output variables for the circle directive.
   */
  @Output() clickEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() doubleClickEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() mouseOverEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() mouseOutEvent: EventEmitter<MouseEvent> = new EventEmitter();

  /**
   * Create SVG Circle directive.
   * @param _svgContainer - Host SVG Container Component object instance.
   */
  constructor(
    private _svgContainer: SvgContainerComponent
  ) { }

  /**
   * Creates or updates the circle object within the container.
   */
  ngAfterViewChecked() {
    // Check if container is creatted and no circle object is created
    if (this._svgContainer.getContainer() && !this._circle) {
      this.createCircle();
    } else if (this._circle) {
      // If we have already created the object, update it.
      this.updateCircle();
    }
  }

  /**
   * Update circle object within the SVG container.
   */
  updateCircle() {
    this._circle
      .radius(this.radius) // Set the radius
      .fill(this.color) // Set the fill color
      .attr('cx', +this.x + +this.radius) // Set x position
      .attr('cy', +this.y + +this.radius); // Set y position
  }

  /**
   * Create circle object within the SVG container.
   */
  createCircle() {
    this._circle = this._svgContainer.getContainer()
      .circle(this.radius) // Create the circle with radius
      .fill(this.color) // Set the fill color
      .attr('cx', +this.x + +this.radius) // Set x position
      .attr('cy', +this.y + +this.radius) // Set y position
      .on('click', evt => this.clickEvent.emit(evt)) // Assign click event
      .on('dblclick', evt => this.doubleClickEvent.emit(evt)) // Assign double click event
      .on('mouseover', evt => this.mouseOverEvent.emit(evt)) // Assign mouse over event
      .on('mouseout', evt => this.mouseOutEvent.emit(evt)); // Assign mouse out event
  }

  /**
   * Does all required pre-requisites before destroying the component.
   */
  ngOnDestroy() {
    this._circle.remove();
  }
}
