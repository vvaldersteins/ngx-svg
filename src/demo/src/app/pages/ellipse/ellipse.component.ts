/**
 * Import Angular libraries.
 */
import { Component } from '@angular/core';

interface Ellipse {
  height: number;
  width: number;
  color?: string;
  x?: number;
  y?: number;
}

@Component({
  templateUrl: 'ellipse.component.html'
})
export class EllipseComponent {
  /**
   * Globally used variables within the component.
   */
  public ellipses: Ellipse[] = [{
    height: 50,
    width: 100,
    color: 'rgba(125, 125, 32, 0.5)',
    x: 20,
    y: 30
  }, {
    height: 70,
    width: 50,
    color: 'rgba(12, 32, 222, 0.7)',
    x: 100,
    y: 20
  }];

  /**
   * Creates ellipse component object instance.
   */
  constructor() { }

  /**
   * Adds new ellipse element.
   */
  addNew() {
    this.ellipses.push({
      height: 0,
      width: 0,
      color: '#000',
      x: 0,
      y: 0
    });
  }

  /**
   * Retrieves the maximum height of all elements.
   * @returns Height of the container.
   */
  getHeight(): number {
    return Math.max.apply(Math, this.ellipses.map(el => el.height * 2 + el.y)) + 20;
  }

  /**
   * Removes specific ellipses element.
   * @param index - Index of ellipse, which needs to be removed.
   */
  removeRow(index: number) {
    this.ellipses.splice(index, 1);
  }
}
