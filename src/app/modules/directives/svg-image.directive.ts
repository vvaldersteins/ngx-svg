/**
 * Import Angular libraries.
 */
import { Directive, Input, Output, AfterViewChecked, OnDestroy, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

/**
 * Import third-party libraries.
 */
import * as SVG from 'svgjs';

/**
 * Import custom components.
 */
import { SvgContainerComponent } from '../components/svg-container/svg-container.component';

@Directive({
  selector: 'svg-image'
})
export class SvgImageDirective implements AfterViewChecked, OnDestroy, OnChanges {
  /**
   * Globally used variables within the directive.
   */
  private _image: SVG.Image;

  /**
   * Import variables for the image directive.
   */
  @Input() imageUrl: string; // Path to the image for SVG image.
  @Input() x = 0; // Starting point on x axis.
  @Input() y = 0; // Starting point on y axis.
  @Input() height = 100; // Height of the image.
  @Input() width = 100; // Width of the image.

  /**
   * Output variables for the image directive.
   */
  @Output() clickEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() doubleClickEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() mouseOverEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() mouseOutEvent: EventEmitter<MouseEvent> = new EventEmitter();

  /**
   * Create SVG image directive.
   * @param _svgContainer - Host SVG Container Component object instance.
   */
  constructor(
    private _svgContainer: SvgContainerComponent
  ) { }

  /**
   * Creates the image object within the container.
   */
  ngAfterViewChecked() {
    // Check if container is creatted and no image object is created
    if (this._svgContainer.getContainer() && !this._image) {
      this.createImage();
    }
  }

  /**
   * Is called when changes are made to the image object.
   * @param changes - Angular Simple Changes object containing all of the changes.
   */
  ngOnChanges(changes: SimpleChanges) {
    // Make sure we check it only when image is initialized
    if (this._image) {
      // Update image also in case image url has changed
      if (changes.imageUrl && changes.imageUrl.currentValue !== changes.imageUrl.previousValue) {
        // Update image properties and image itself
        this.updateImage(true);
      } else if (
        (changes.x && changes.x.currentValue !== changes.x.previousValue) ||
        (changes.y && changes.y.currentValue !== changes.y.previousValue) ||
        (changes.width && changes.width.currentValue !== changes.width.previousValue) ||
        (changes.height && changes.height.currentValue !== changes.height.previousValue)
      ) {
        // Update only image properties
        this.updateImage(false);
      }
    }
  }

  /**
   * Update image object within the SVG container.
   * @param reloadImage - Boolean indicator if image should be reloaded.
   */
  updateImage(reloadImage: boolean) {
    // Check if we have to update only image properties, or also image itself
    if (reloadImage) {
      this._image
        .load(this.imageUrl) // Update image
        .size(this.width, this.height) // Update image size
        .move(this.x, this.y); // Update image position
    } else { // Update just image properties
      this._image
        .size(this.width, this.height) // Update image size
        .move(this.x, this.y); // Update image position
    }
  }

  /**
   * Create image object within the SVG container.
   */
  createImage() {
    this._image = this._svgContainer.getContainer()
      .image() // Assign image object
      .load(this.imageUrl) // Load image
      .size(this.width, this.height) // Assign image size
      .move(this.x, this.y) // Assign position
      .on('click', evt => this.clickEvent.emit(evt)) // Assign click event
      .on('dblclick', evt => this.doubleClickEvent.emit(evt)) // Assign double click event
      .on('mouseover', evt => this.mouseOverEvent.emit(evt)) // Assign mouse over event
      .on('mouseout', evt => this.mouseOutEvent.emit(evt)); // Assign mouse out event
  }

  /**
   * Does all required pre-requisites before destroying the component.
   */
  ngOnDestroy() {
    this._image.remove();
  }
}
