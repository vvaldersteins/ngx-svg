/**
 * Import Angular libraries.
 */
import { Component } from '@angular/core';

interface Polygon {
  borderSize: number;
  borderColor?: string;
  fill?: string;
  points: number[][];
}

@Component({
  templateUrl: 'polygon.component.html'
})
export class PolygonComponent {
  /**
   * Globally used variables within the component.
   */
  public polygons: Polygon[] = [{
    borderSize: 2,
    borderColor: 'rgba(125, 125, 32, 0.5)',
    fill: 'rgba(100, 100, 20, 0.2)',
    points: [[10, 100], [100, 100], [100, 10], [10, 10]]
  }, {
    borderSize: 3,
    borderColor: 'rgba(23, 25, 255, 1)',
    fill: 'rgba(0, 0, 0, 0)',
    points: [[200, 150], [210, 190], [250, 200], [210, 210], [200, 250], [190, 210], [150, 200], [190, 190]]
  }];

  /**
   * Creates polygon component object instance.
   */
  constructor() { }

  /**
   * Adds new polygon element.
   */
  addNew() {
    this.polygons.push({
      borderSize: 0,
      borderColor: '#000',
      points: [[]]
    });
  }

  /**
   * Retrieves the maximum height of all elements.
   * @returns Height of the container.
   */
  getHeight(): number {
    return Math.max.apply(Math, this.polygons.map(el => {
      let maxValue;
      const max = Math.max.apply(Math, el.points.map(point => {
        if (maxValue === undefined || (maxValue !== undefined && point[1] > maxValue)) {
          maxValue = point[1];
        }

        return maxValue;
      }));

      return max;
    })) + 20;
  }

  /**
   * Adds new points element at the end of the list.
   * @param polygon - Polygon object for which to add new points element.
   */
  addNewPoint(polygon: Polygon) {
    polygon.points.push([]);
  }

  /**
   * Removes a specific point from the points list.
   * @param polygon - Polygon object for which point needs to be removed.
   * @param index - Index which needs to be removed.
   */
  removePoint(polygon: Polygon, index: number) {
    polygon.points.splice(index, 1);
  }

  /**
   * Removes specific polygon element.
   * @param index - Index which needs to be removed
   */
  removeRow(index: number) {
    this.polygons.splice(index, 1);
  }
}
