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
  selector: 'svg-line'
})
export class SvgLineDirective implements AfterViewChecked {
  /**
   * Globally used variables within the directive.
   */
  private _line: SVG.Line;

  /**
   * Import variables for the line directive.
   */
  @Input() borderSize: number; // Size of the border.
  @Input() borderColor = '#000'; // Color of the line.
  @Input() x0 = 0; // Starting point on x axis.
  @Input() y0 = 0; // Starting point on y axis.
  @Input() x1 = 1; // Ending point on x axis.
  @Input() y1 = 1; // Ending point on y axis.
  /**
   * Output variables for the line directive.
   */
  @Output() clickEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() doubleClickEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() mouseOverEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() mouseOutEvent: EventEmitter<MouseEvent> = new EventEmitter();

  /**
   * Create SVG Line directive.
   * @param _svgContainer - Host SVG Container Component object instance.
   */
  constructor(
    private _svgContainer: SvgContainerComponent
  ) { }

  /**
   * Creates or updates the line object within the container.
   */
  ngAfterViewChecked() {
    // Check if container is creatted and no line object is created
    if (this._svgContainer.getContainer() && !this._line) {
      this.createLine();
    } else if (this._line) {
      // If we have already created the object, update it.
      this.updateLine();
    }
  }

  /**
   * Update line object within the SVG container.
   */
  updateLine() {
    this._line
      .plot(this.x0, this.y0, this.x1, this.y1) // Create the line at specific position
      .stroke({ color: this.borderColor, width: this.borderSize }); // Set the border for the line
  }

  /**
   * Create line object within the SVG container.
   */
  createLine() {
    this._line = this._svgContainer.getContainer()
      .line(this.x0, this.y0, this.x1, this.y1) // Create the line at specific position
      .stroke({ color: this.borderColor, width: this.borderSize }) // Set the border for the line
      .on('click', evt => this.clickEvent.emit(evt)) // Assign click event
      .on('dblclick', evt => this.doubleClickEvent.emit(evt)) // Assign double click event
      .on('mouseover', evt => this.mouseOverEvent.emit(evt)) // Assign mouse over event
      .on('mouseout', evt => this.mouseOutEvent.emit(evt)); // Assign mouse out event
  }
}
