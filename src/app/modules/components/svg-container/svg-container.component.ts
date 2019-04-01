/**
 * Import Angular libraries.
 */
import { Component, AfterViewInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

/**
 * Import third-party libraries.
 */
import * as SVG from 'svgjs';
const svgFunc = SVG;

@Component({
  selector: 'svg-container',
  templateUrl: 'svg-container.component.html',
  styleUrls: ['./svg-container.component.css']
})
export class SvgContainerComponent implements AfterViewInit, OnChanges {
  /**
   * Globally used variables within the component.
   */
  private _svg: SVG.Container;
  public pointXCoordinate: number;
  public pointYCoordinate: number;
  public mouseInContainer = false;
  private _triggerCoordinateChange = false;
  private singleClickHappened: boolean;

  /**
   * Input variables used within the component.
   */
  @Input() containerId: string; // Container id which will be used to create the container.
  @Input() height = 200; // Height of the container.
  @Input() showGrid = false; // Indicator if grid image should be shown in the background of svg container.
  @Input() hoverable = false; // Indicator if user should be able to see dot on hover, to capture coordinates.
  @Input() pointSize = 10; // Numeric value in pixels, to indicate how large should the point be.
  @Input() viewBox: number[] = []; // Viewbox of the container, must be an array consisting of 4 integers [x, y, width, height].

  /**
   * Output variables used within the component.
   */
  @Output() clickEvent: EventEmitter<{ x: number, y: number }>
    = new EventEmitter(); // Event handler for retrieving coordinates at clicked position
  @Output() doubleClickEvent: EventEmitter<{ x: number, y: number }>
    = new EventEmitter(); // Event handler for retrieving coordinates at position where you double-click.

  /**
   * Create SVG Container component instance.
   */
  constructor() { }

  /**
   * Does all required pre-requisites when input variables changes.
   * @param changes - Changes object containing input variable changes for the container.
   */
  ngOnChanges(changes: SimpleChanges) {
    // Check if svg container is defined
    if (this._svg) {
      // Check if viewbox has changed
      if (changes.viewBox && changes.viewBox.currentValue !== changes.viewBox.previousValue) {
        // Check if we are still using viewbox
        if (changes.viewBox.currentValue.length === 4) {
          // Get viewbox value
          const viewbox = changes.viewBox.currentValue;

          // Set viewbox
          this._svg.viewbox(viewbox[0], viewbox[1], viewbox[2], viewbox[3]);
        } else {
          // Remove viewbox
          this._svg.viewbox();
        }
      }
    }
  }

  /**
   * Does all required pre-requisites before initializing the component.
   */
  ngAfterViewInit() {
    this.setContainer(this.containerId);
  }

  /**
   * Does all required pre-requisites and adjusts hoverable point position.
   * @param event - Mouse event handler from the DOM.
   */
  adjustPointPosition(event: MouseEvent) {
    // Return if we don't have hoverable enabled
    if (!this.hoverable) {
      return;
    }

    // Set correct point coordinates
    if (this._triggerCoordinateChange) {
      this.pointXCoordinate = event.layerX - this.pointSize / 2;
      this.pointYCoordinate = event.layerY - this.pointSize / 2;
    }

    // Trigger coordinate change
    this._triggerCoordinateChange = true;
  }

  /**
   * Does all required pre-requisites when hovered point is clicked.
   */
  onPointClick() {
    // Indicate that single click has happened.
    this.singleClickHappened = true;

    // Assign coordinates
    const x = this.pointXCoordinate + this.pointSize / 2;
    const y = this.pointYCoordinate + this.pointSize / 2;

    // Set timeout, to make sure we cancel it if double-click happens.
    setTimeout(() => {
      if (this.singleClickHappened) {
        this.clickEvent.emit({ x, y });
      }
    }, 250);
  }

  /**
   * Does all required pre-requisites when hovered point is double clicked.
   */
  onPointDoubleClick() {
    // Now let's fire double click event
    this.doubleClickEvent.emit({ x: this.pointXCoordinate + this.pointSize / 2, y: this.pointYCoordinate + this.pointSize / 2 });

    // First let's set that double click has happened
    this.singleClickHappened = false;
  }

  /**
   * Make sure that we don't trigger coordinate change, if we hover point.
   */
  onPointHover() {
    this._triggerCoordinateChange = false;
  }

  /**
   * Sets a container instance.
   * @param id - ID of the container.
   */
  setContainer(id: string) {
    // Assign viewbox only if it's defined
    if (this.viewBox && this.viewBox.length === 4) {
      this._svg = svgFunc(id)
        .viewbox(this.viewBox[0], this.viewBox[1], this.viewBox[2], this.viewBox[3]);
    } else {
      this._svg = svgFunc(id);
    }
  }

  /**
   * Retrieves container instance.
   * @returns SVG Container instance.
   */
  getContainer(): SVG.Container {
    return this._svg;
  }
}
