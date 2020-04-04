/**
 * Import Angular libraries.
 */
import { Component } from '@angular/core';

interface Circle {
  diameter: number;
  color?: string;
  x?: number;
  y?: number;
}

@Component({
  templateUrl: 'circle.component.html'
})
export class CircleComponent {
  /**
   * Globally used variables within the component.
   */
  public circles: Circle[] = [{
    diameter: 45,
    color: 'rgba(125, 125, 32, 0.5)',
    x: 20,
    y: 30
  }, {
    diameter: 30,
    color: 'rgba(12, 32, 222, 0.7)',
    x: 70,
    y: 30
  }];

  /**
   * Creates circle component object instance.
   */
  constructor() { }

  /**
   * Adds new circle element.
   */
  addNew() {
    this.circles.push({
      diameter: 0,
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
    return Math.max.apply(Math, this.circles.map(el => el.diameter + el.y)) + 30;
  }

  /**
   * Removes specific circle element.
   * @param index - Index of circle, which needs to be removed.
   */
  removeRow(index: number) {
    this.circles.splice(index, 1);
  }
}
