/**
 * Import Angular libraries.
 */
import { Component } from '@angular/core';

interface Line {
  borderSize: number;
  borderColor?: string;
  x0?: number;
  y0?: number;
  x1?: number;
  y1?: number;
}

@Component({
  templateUrl: 'line.component.html'
})
export class LineComponent {
  /**
   * Globally used variables within the component.
   */
  private lines: Line[] = [{
    borderSize: 10,
    borderColor: 'rgba(125, 125, 32, 0.5)',
    x0: 20,
    y0: 30,
    x1: 55,
    y1: 85
  }, {
    borderSize: 10,
    borderColor: 'rgba(12, 32, 222, 0.7)',
    x0: 30,
    y0: 20,
    x1: 85,
    y1: 55
  }, {
    borderSize: 10,
    borderColor: 'rgba(18, 52, 23, 0.7)',
    x0: 20,
    y0: 60,
    x1: 50,
    y1: 20
  }];

  /**
   * Creates line component object instance.
   */
  constructor() { }

  /**
   * Adds new line element.
   */
  addNew() {
    this.lines.push({
      borderSize: 0,
      borderColor: '#000',
      x0: 0,
      y0: 0,
      x1: 1,
      y1: 1
    });
  }

  /**
   * Retrieves the maximum height of all elements.
   * @returns Height of the container.
   */
  getHeight(): number {
    return Math.max.apply(Math, this.lines.map(el => {
      if (el.y0 > el.y1) {
        return el.y0;
      } else {
        return el.y1;
      }
    })) + 20;
  }

  /**
   * removes specific line element.
   */
  removeRow(index: number) {
    this.lines.splice(index, 1);
  }
}
