/**
 * Import Angular libraries.
 */
import { Component } from '@angular/core';

interface Rectangular {
  height: number;
  width: number;
  color?: string;
  x?: number;
  y?: number;
}

@Component({
  templateUrl: 'rect.component.html'
})
export class RectComponent {
  /**
   * Globally used variables within the component.
   */
  private rectangulars: Rectangular[] = [{
    height: 100,
    width: 200,
    color: 'rgba(125, 125, 32, 0.5)',
    x: 20,
    y: 30
  }, {
    height: 50,
    width: 50,
    color: 'rgba(12, 32, 222, 0.7)',
    x: 200,
    y: 20
  }];

  /**
   * Creates rect component object instance.
   */
  constructor() { }

  /**
   * Adds new rectangular element.
   */
  addNew() {
    this.rectangulars.push({
      height: 0,
      width: 0,
      color: '#000',
      x: 0,
      y: 0
    });
  }

  /**
   * removes specific rectangular element.
   */
  removeRow(index: number) {
    this.rectangulars.splice(index, 1);
  }
}
