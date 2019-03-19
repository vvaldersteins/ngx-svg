/**
 * Import Angular libraries.
 */
import { Component, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';

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
export class SvgContainerComponent implements AfterViewInit {
  /**
   * Globally used variables within the component.
   */
  private _svg: SVG.Container;
  public pointXCoordinate: number;
  public pointYCoordinate: number;
  public mouseInContainer = false;

  /**
   * Input variables used within the component.
   */
  @Input() containerId: string; // Container id which will be used to create the container.
  @Input() height = 200; // Height of the container.
  @Input() showGrid = false; // Indicator if grid image should be shown in the background of svg container.
  @Input() hoverable = false; // Indicator if user should be able to see dot on hover, to capture coordinates.

  /**
   * Output variables used within the component.
   */
  @Output() clickEvent: EventEmitter<MouseEvent> = new EventEmitter(); // Event handler for retrieving coordinates at clicked position

  /**
   * Create SVG Container component instance.
   */
  constructor() { }

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
    this.pointXCoordinate = event.x - 5;
    this.pointYCoordinate = event.y - 5;
  }

  /**
   * Sets a container instance.
   * @param id - ID of the container.
   */
  setContainer(id: string) {
    this._svg = svgFunc(id);
  }

  /**
   * Retrieves container instance.
   * @returns SVG Container instance.
   */
  getContainer(): SVG.Container {
    return this._svg;
  }
}