/**
 * Import Angular libraries.
 */
import { Directive, Input, Output, AfterViewChecked, EventEmitter, OnDestroy, OnChanges, SimpleChanges, ElementRef } from '@angular/core';

/**
 * Import third-party libraries.
 */
import { Polygon, PointArrayAlias } from '@svgdotjs/svg.js';

/**
 * Import custom components.
 */
import { SvgContainerComponent } from '../components/svg-container/svg-container.component';

@Directive({
  selector: 'svg-polygon'
})
export class SvgPolygonDirective implements AfterViewChecked, OnChanges, OnDestroy {
  /**
   * Globally used variables within the directive.
   */
  private _polygon: Polygon;

  /**
   * Import variables for the polygon directive.
   */
  @Input() points: PointArrayAlias; // Array with points in format [[x, y], [x1, y1], [x2, y2], ..., [xn, yn]].
  @Input() borderSize: number; // Size of the border.
  @Input() borderColor = '#000'; // Color of the polygon.
  @Input() fill = '#000'; // Color of the polygon body.
  @Input() classes: string[] = []; // List of CSS classes which needs to be added.

  /**
   * Output variables for the polygon directive.
   */
  @Output() clickEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() doubleClickEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() mouseOverEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() mouseOutEvent: EventEmitter<MouseEvent> = new EventEmitter();

  /**
   * Create SVG Polygon directive.
   * @param _svgContainer - Host SVG Container Component object instance.
   * @param _elRef - Angular element reference object instance.
   */
  constructor(
    private _svgContainer: SvgContainerComponent,
    private _elRef: ElementRef
  ) { }

  /**
   * Creates or updates the polygon object within the container.
   */
  ngAfterViewChecked(): void {
    // Check if container is created and no polygon object is created
    if (this._svgContainer.getContainer() && !this._polygon) {
      this.createPolygon();
    }
  }

  /**
   * Does all required pre-requisites before destroying the component.
   */
  ngOnDestroy(): void {
    this._polygon.remove();
  }

  /**
   * Is called when changes are made to the polygon object.
   * @param changes - Angular Simple Changes object containing all of the changes.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (this._polygon) {
      // If we have already created the object, update it.
      this.updatePolygon();

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
   * Update polygon object within the SVG container.
   */
  private updatePolygon(): void {
    this._polygon
      .plot(this.points) // Update the polygon object
      .fill(this.fill) // Fill color of the polygon
      .stroke({ color: this.borderColor, width: this.borderSize }); // Set the border for the polygon

    // Let's set element in a correct position
    this.setCorrectPosition();
  }

  /**
   * Create polygon object within the SVG container.
   */
  private createPolygon(): void {
    this._polygon = this._svgContainer.getContainer()
      .polygon(this.points) // Create the polygon object
      .fill(this.fill) // Fill color of the polygon
      .stroke({ color: this.borderColor, width: this.borderSize }) // Set the border for the polygon
      .on('click', (evt: MouseEvent) => this.clickEvent.emit(evt)) // Assign click event
      .on('dblclick', (evt: MouseEvent) => this.doubleClickEvent.emit(evt)) // Assign double click event
      .on('mouseover', (evt: MouseEvent) => this.mouseOverEvent.emit(evt)) // Assign mouse over event
      .on('mouseout', (evt: MouseEvent) => this.mouseOutEvent.emit(evt)); // Assign mouse out event

    // Let's set element in a correct position
    this.setCorrectPosition();  

    // Add classes to the polygon
    this.addRemoveClasses(this.classes);
  }

  /**
   * Sets correct position for the element.
   */
  private setCorrectPosition() {
    // Find position of an element within the parent container
    const position = Array.prototype.slice.call(this._elRef.nativeElement.parentElement.children).indexOf(this._elRef.nativeElement);

    // Let's update and insert element in a correct position.
    if (this._svgContainer.getContainer().get(position) && this._polygon.position() !== position) {
      this._polygon.insertBefore(this._svgContainer.getContainer().get(position));
    }
  }

  /**
   * Adds classes to the polygon object.
   * @param classesToAdd - List of classes, which needs to be added.
   * @param classesToRemove - List of classes, which needs to be removed.
   */
  private addRemoveClasses(classesToAdd: string[], classesToRemove: string[] = []): void {
    // First let's remove classes, that are not necessary anymore
    for (const classToRemove of classesToRemove) {
      this._polygon
        .removeClass(classToRemove);
    }

    // Now let's add new classes
    for (const classToAdd of classesToAdd) {
      this._polygon
        .addClass(classToAdd);
    }
  }
}
