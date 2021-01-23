/**
 * Import Angular libraries.
 */
import { Directive, Input, Output, AfterViewChecked, OnDestroy, EventEmitter, OnChanges, SimpleChanges, ElementRef } from '@angular/core';

/**
 * Import third-party libraries.
 */
import { Image } from '@svgdotjs/svg.js';

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
  private _image: Image;

  /**
   * Import variables for the image directive.
   */
  @Input() imageUrl: string; // Path to the image for SVG image.
  @Input() x = 0; // Starting point on x axis.
  @Input() y = 0; // Starting point on y axis.
  @Input() height = 100; // Height of the image.
  @Input() width = 100; // Width of the image.
  @Input() classes: string[] = []; // List of CSS classes which needs to be added.

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
   * @param _elRef - Angular element reference object instance.
   */
  constructor(
    private _svgContainer: SvgContainerComponent,
    private _elRef: ElementRef
  ) { }

  /**
   * Creates the image object within the container.
   */
  ngAfterViewChecked(): void {
    // Check if container is created and no image object is created
    if (this._svgContainer.getContainer() && !this._image) {
      this.createImage();
    }
  }

  /**
   * Does all required pre-requisites before destroying the component.
   */
  ngOnDestroy(): void {
    this._image.remove();
  }

  /**
   * Is called when changes are made to the image object.
   * @param changes - Angular Simple Changes object containing all of the changes.
   */
  ngOnChanges(changes: SimpleChanges): void {
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

      // Check if classes were changed
      if (changes.classes && changes.classes.currentValue !== changes.classes.previousValue) {
        // Get classes that needs to be removed
        const classesToRemove = changes.classes.previousValue.filter((previousClass: string) =>
          !changes.classes.currentValue.some((currentClass: string) => currentClass === previousClass)
        );

        // Get classes that needs to be added
        const classesToAdd = changes.classes.currentValue.filter((currentClass: string) =>
          !changes.classes.previousValue.some((previousClass: string) => currentClass === previousClass)
        );

        // Add and remove classes
        this.addRemoveClasses(classesToAdd, classesToRemove);
      }
    }
  }

  /**
   * Update image object within the SVG container.
   * @param reloadImage - Boolean indicator if image should be reloaded.
   */
  private updateImage(reloadImage: boolean): void {
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

    // Let's set element in a correct position
    this.setCorrectPosition();
  }

  /**
   * Create image object within the SVG container.
   */
  private createImage(): void {
    this._image = this._svgContainer.getContainer()
      .image() // Assign image object
      .load(this.imageUrl) // Load image
      .size(this.width, this.height) // Assign image size
      .move(this.x, this.y) // Assign position
      .on('click', (evt: MouseEvent) => this.clickEvent.emit(evt)) // Assign click event
      .on('dblclick', (evt: MouseEvent) => this.doubleClickEvent.emit(evt)) // Assign double click event
      .on('mouseover', (evt: MouseEvent) => this.mouseOverEvent.emit(evt)) // Assign mouse over event
      .on('mouseout', (evt: MouseEvent) => this.mouseOutEvent.emit(evt)); // Assign mouse out event

    // Let's set element in a correct position
    this.setCorrectPosition();

    // Add classes to the image
    this.addRemoveClasses(this.classes);
  }

  /**
   * Sets correct position for the element.
   */
  private setCorrectPosition() {
    // Find position of an element within the parent container
    const position = Array.prototype.slice.call(this._elRef.nativeElement.parentElement.children).indexOf(this._elRef.nativeElement);

    // Let's update and insert element in a correct position.
    if (this._svgContainer.getContainer().get(position) && this._image.position() !== position) {
      this._image.insertBefore(this._svgContainer.getContainer().get(position));
    }
  }

  /**
   * Adds classes to the image object.
   * @param classesToAdd - List of classes, which needs to be added.
   * @param classesToRemove - List of classes, which needs to be removed.
   */
  private addRemoveClasses(classesToAdd: string[], classesToRemove: string[] = []): void {
    // First let's remove classes, that are not necessary anymore
    for (const classToRemove of classesToRemove) {
      this._image
        .removeClass(classToRemove);
    }

    // Now let's add new classes
    for (const classToAdd of classesToAdd) {
      this._image
        .addClass(classToAdd);
    }
  }
}
