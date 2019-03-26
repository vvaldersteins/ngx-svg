/**
 * Import Angular libraries.
 */
import { Component, ChangeDetectorRef } from '@angular/core';

interface Image {
  imageUrl: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

@Component({
  templateUrl: 'image.component.html'
})
export class ImageComponent {
  /**
   * Globally used variables within the component.
   */
  private images: Image[] = [{
    imageUrl: 'ngx-svg/assets/dog.png',
    x: 100,
    y: 100,
    width: 100,
    height: 100
  }];

  /**
   * Creates image component object instance.
   */
  constructor(
    private cdRef: ChangeDetectorRef
  ) { }

  onClick(event) { console.log(event); }

  /**
   * Adds new image element.
   */
  addNew() {
    this.images.push({
      imageUrl: 'ngx-svg/assets/dog.png',
      x: 0,
      y: 0,
      width: 100,
      height: 100
    });
  }

  /**
   * Retrieves the maximum height of all elements.
   * @returns Height of the container.
   */
  getHeight(): number {
    return Math.max.apply(Math, this.images.map(el => el.height + el.y)) + 20;
  }

  /**
   * Removes specific image element.
   * @param index - Index of image, which needs to be removed.
   */
  removeRow(index: number) {
    this.images.splice(index, 1);
  }
}
