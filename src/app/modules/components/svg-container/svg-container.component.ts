/**
 * Import Angular libraries.
 */
import { Component, AfterViewInit, Input } from '@angular/core';

/**
 * Import third-party libraries.
 */
import * as SVG from 'svgjs';
const svgFunc = SVG;

@Component({
  selector: 'svg-container',
  templateUrl: 'svg-container.component.html'
})
export class SvgContainerComponent implements AfterViewInit {
  /**
   * Globally used variables within the component.
   */
  private _svg: SVG.Container;

  /**
   * Input variables used within the component.
   */
  @Input() containerId: string; // Container id which will be used to create the container.

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
