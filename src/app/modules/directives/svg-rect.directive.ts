/**
 * Import Angular libraries.
 */
import { Directive, Input, Output, AfterViewChecked, EventEmitter, OnDestroy, OnChanges, SimpleChanges, ElementRef } from '@angular/core';

/**
 * Import third-party libraries.
 */
import { Rect } from '@svgdotjs/svg.js';

/**
 * Import custom components.
 */
import { SvgContainerComponent } from '../components/svg-container/svg-container.component';

@Directive({
  selector: 'svg-rect'
})
export class SvgRectDirective implements AfterViewChecked, OnChanges, OnDestroy {
  /**
   * Globally used variables within the directive.
   */
  private _rect?: Rect;

  /**
   * Import variables for the rectangular directive.
   */
  @Input() height: number; // Height of the rectangular.
  @Input() width: number; // Width of the rectangular.
  @Input() color = '#000'; // Color of the rectangular background
  @Input() x = 0; // Starting point on x axis.
  @Input() y = 0; // Starting point on y axis.
  @Input() rx = 0; // Radius for x axis.
  @Input() ry = 0; // Radius for y axis.
  @Input() classes: string[] = []; // List of CSS classes which needs to be added.

  /**
   * Output variables for the rectangular directive.
   */
  @Output() clickEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() doubleClickEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() mouseOverEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() mouseOutEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() onInitialize: EventEmitter<Rect> = new EventEmitter();

  /**
   * Create SVG Rect directive.
   * @param _svgContainer - Host SVG Container Component object instance.
   * @param _elRef - Angular element reference object instance.
   */
  constructor(
    private _svgContainer: SvgContainerComponent,
    private _elRef: ElementRef
  ) {}

  /**
   * Creates or updates the rectangular object within the container
   */
  ngAfterViewChecked(): void {
    // Check if container is created and no rectangular object is created
    if (this._svgContainer.getContainer() && !this._rect) {
      this.createRect();
    }
  }

  /**
   * Does all required pre-requisites before destroying the component.
   */
  ngOnDestroy(): void {
    this._rect?.remove();
  }

  /**
   * Is called when changes are made to the rect object.
   * @param changes - Angular Simple Changes object containing all of the changes.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (this._rect) {
      // If we have already created the object, update it.
      this.updateRect();

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
   * Update rectangular object within the SVG container.
   */
  private updateRect(): void {
    this._rect
      .size(this.width, this.height) // Update the width and height
      .fill(this.color) // Update the color
      .radius(this.rx, this.ry) // Update the radius
      .move(this.x, this.y); // Update the coordinates

    // Let's set element in a correct position
    this.setCorrectPosition();
  }

  /**
   * Create rectangular object within the SVG container.
   */
  private createRect(): void {
    this._rect = this._svgContainer.getContainer()
      .rect(this.width, this.height) // Set height and width of the rect
      .fill(this.color) // Set fill color
      .move(this.x, this.y) // Set coordinates
      .radius(this.rx, this.ry) // Set radius
      .on('click', (evt: MouseEvent) => this.clickEvent.emit(evt)) // Assign click event
      .on('dblclick', (evt: MouseEvent) => this.doubleClickEvent.emit(evt)) // Assign double click event
      .on('mouseover', (evt: MouseEvent) => this.mouseOverEvent.emit(evt)) // Assign mouse over event
      .on('mouseout', (evt: MouseEvent) => this.mouseOutEvent.emit(evt)); // Assign mouse out event

    // Let's set element in a correct position
    this.setCorrectPosition();

    // Add classes to the rect
    this.addRemoveClasses(this.classes);

    // Let's output the rect element
    this.onInitialize.emit(this._rect);
  }

  /**
   * Sets correct position for the element.
   */
  private setCorrectPosition() {
    // Find position of an element within the parent container
    const position = Array.prototype.slice.call(this._elRef.nativeElement.parentElement.children).indexOf(this._elRef.nativeElement);

    // Let's update and insert element in a correct position.
    if (this._svgContainer.getContainer().get(position) && this._rect.position() !== position) {
      this._rect.insertBefore(this._svgContainer.getContainer().get(position));
    }
  }

  /**
   * Adds classes to the rect object.
   * @param classesToAdd - List of classes, which needs to be added.
   * @param classesToRemove - List of classes, which needs to be removed.
   */
  private addRemoveClasses(classesToAdd: string[], classesToRemove: string[] = []): void {
    // First let's remove classes, that are not necessary anymore
    for (const classToRemove of classesToRemove) {
      this._rect
        .removeClass(classToRemove);
    }

    // Now let's add new classes
    for (const classToAdd of classesToAdd) {
      this._rect
        .addClass(classToAdd);
    }
  }
}
