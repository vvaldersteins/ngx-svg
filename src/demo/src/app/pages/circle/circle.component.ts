/**
 * Import Angular libraries.
 */
import { Component, ChangeDetectorRef } from '@angular/core';

interface Circle {
  radius: number;
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
  private circles: Circle[] = [{
    radius: 45,
    color: 'rgba(125, 125, 32, 0.5)',
    x: 20,
    y: 30
  }, {
    radius: 30,
    color: 'rgba(12, 32, 222, 0.7)',
    x: 70,
    y: 30
  }];

  /**
   * Creates circle component object instance.
   */
  constructor(
    private cdRef: ChangeDetectorRef
  ) { }

  /**
   * Adds new circle element.
   */
  addNew() {
    this.circles.push({
      radius: 0,
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
    return Math.max.apply(Math, this.circles.map(el => el.radius * 2 + el.y)) + 20;
  }

  /**
   * removes specific circle element.
   */
  removeRow(index: number) {
    this.circles.splice(index, 1);
  }
}
