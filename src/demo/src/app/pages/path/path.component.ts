/**
 * Import Angular libraries.
 */
import { Component } from '@angular/core';

interface Path {
  path: string;
  borderSize?: number;
  borderColor?: string;
  x?: number;
  y?: number;
  fill?: string;
}

@Component({
  templateUrl: 'path.component.html'
})
export class PathComponent {
  /**
   * Globally used variables within the component.
   */
  public paths: Path[] = [{
    path: 'M10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80',
    borderSize: 4,
    borderColor: 'rgba(125, 125, 32, 0.5)',
    x: 20,
    y: 30,
    fill: ''
  }];

  /**
   * Creates path component object instance.
   */
  constructor() { }

  /**
   * Adds new path element.
   */
  addNew() {
    this.paths.push({
      path: '',
      borderSize: 2,
      borderColor: '#000',
      x: 0,
      y: 0,
      fill: ''
    });
  }

  /**
   * Retrieves the maximum height of all elements.
   * @returns Height of the container.
   */
  getHeight(): number {
    return Math.max.apply(Math, this.paths.map(el =>
      el.y +
      Math.max.apply(Math, el.path.replace(/[^0-9 ]/g, '').replace(/\s\s+/g, ' ').split(' ').filter((element, index) => index % 2 !== 0)))
    ) + 20;
  }

  /**
   * Removes specific path element.
   * @param index - Index of a path which needs to be removed.
   */
  removeRow(index: number) {
    this.paths.splice(index, 1);
  }
}
