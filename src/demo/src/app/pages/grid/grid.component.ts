/**
 * Import Angular libraries.
 */
import { Component } from '@angular/core';

interface Grid {
  width: number;
  height: number;
  strokeColor: string;
}

@Component({
  templateUrl: 'grid.component.html'
})
export class GridComponent {
  /**
   * Globally used variables within the component.
   */
  public showGrid = true;
  public grid: Grid = {
    width: 10,
    height: 10,
    strokeColor: '#000'
  };

  /**
   * Creates grid component object instance.
   */
  constructor() { }

  /**
   * Does all required pre-requisites and updates the grid object.
   */
  updateGrid() {
    this.grid = Object.assign({}, this.grid);
  }
}
