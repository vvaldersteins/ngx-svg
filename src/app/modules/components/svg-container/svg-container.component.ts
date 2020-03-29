/**
 * Import Angular libraries.
 */
import { Component, AfterViewInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';

/**
 * Import third-party libraries.
 */
import { SVG, Container } from '@svgdotjs/svg.js';

@Component({
  selector: 'svg-container',
  templateUrl: 'svg-container.component.html',
  styleUrls: ['./svg-container.component.css']
})
export class SvgContainerComponent implements AfterViewInit, OnChanges {
  /**
   * Globally used variables within the component.
   */
  private _svg: Container;
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
  @Output() mouseOverEvent: EventEmitter<MouseEvent> = new EventEmitter(); // Event handler when mouse is moved over the container.
  @Output() mouseOutEvent: EventEmitter<MouseEvent> = new EventEmitter(); // Event handler when the mouse exits the container.
  @Output() mouseMoveEvent: EventEmitter<{ x: number, y: number }> = new EventEmitter();
    // Event handler when the mouse is being moved on the container.

  /**
   * Create SVG Container component instance.
   * @param cdRef - Change Detector Ref object instance.
   */
  constructor(
    private cdRef: ChangeDetectorRef
  ) { }

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

      // Let's update the height
      if (changes.height && changes.height.currentValue !== changes.height.previousValue) {
        this._svg.size('100%', changes.height.currentValue);
      }

      // Check if any other input variables have changed
      if (
        changes.showGrid && changes.showGrid.currentValue !== changes.showGrid.previousValue ||
        changes.hoverable && changes.hoverable.currentValue !== changes.hoverable.previousValue ||
        changes.pointSize && changes.pointSize.currentValue !== changes.pointSize.previousValue
      ) {
        this.cdRef.detectChanges();
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
      this.pointXCoordinate = event.offsetX - this.pointSize / 2;
      this.pointYCoordinate = event.offsetY - this.pointSize / 2;
    }

    // Trigger coordinate change
    this._triggerCoordinateChange = true;
  }

  /**
   * Adjust the mouse move position, and sends out to the user.
   * @param event - Mouse event handler from the DOM.
   */
  adjustMouseMovePosition(event: MouseEvent) {
    if ((this.hoverable && this._triggerCoordinateChange)) {
      this.mouseMoveEvent.emit({
        x: this.pointXCoordinate + this.pointSize / 2,
        y: this.pointYCoordinate + this.pointSize / 2
      });
    } else if (!this.hoverable) {
      this.mouseMoveEvent.emit({
        x: event.offsetX,
        y: event.offsetY
      });
    }
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
    // Let's fire double click event
    this.doubleClickEvent.emit({ x: this.pointXCoordinate + this.pointSize / 2, y: this.pointYCoordinate + this.pointSize / 2 });

    // Let's set that double click has happened
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
      this._svg = SVG()
        .addTo(`#${id}`)
        .size('100%', this.height)
        .viewbox(this.viewBox[0], this.viewBox[1], this.viewBox[2], this.viewBox[3]);
    } else {
      this._svg = SVG()
        .addTo(`#${id}`)
        .size('100%', this.height);
    }
  }

  /**
   * Retrieves container instance.
   * @returns SVG Container instance.
   */
  getContainer(): Container {
    return this._svg;
  }
}
