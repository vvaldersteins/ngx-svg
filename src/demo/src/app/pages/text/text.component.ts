/**
 * Import Angular libraries.
 */
import { Component } from '@angular/core';

interface Text {
  text: string;
  size?: number;
  color?: string;
  x?: number;
  y?: number;
}

@Component({
  templateUrl: 'text.component.html'
})
export class TextComponent {
  /**
   * Globally used variables within the component.
   */
  private texts: Text[] = [{
    text: 'Wow! This is awesome text with an opacity!',
    size: 30,
    color: 'rgba(125, 125, 32, 0.5)',
    x: 20,
    y: 30
  }, {
    text: 'Texts can have different sizes, positions and colors!',
    size: 10,
    color: 'rgba(12, 32, 222, 0.7)',
    x: 200,
    y: 80
  }];

  /**
   * Creates text component object instance.
   */
  constructor() { }

  /**
   * Adds new text element.
   */
  addNew() {
    this.texts.push({
      text: '',
      size: 10,
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
    return Math.max.apply(Math, this.texts.map(el => el.y)) + 20;
  }

  /**
   * Removes specific text element.
   * @param index - Index of text element, which needs to be removed.
   */
  removeRow(index: number) {
    this.texts.splice(index, 1);
  }
}
