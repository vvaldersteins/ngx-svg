/**
 * Import Angular libraries.
 */
import { Directive, Input, Output, AfterViewChecked, EventEmitter, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';

/**
 * Import third-party libraries.
 */
import { Polyline, PointArrayAlias } from '@svgdotjs/svg.js';

/**
 * Import custom components.
 */
import { SvgContainerComponent } from '../components/svg-container/svg-container.component';

@Directive({
  selector: 'svg-polyline'
})
export class SvgPolylineDirective implements AfterViewChecked, OnChanges, OnDestroy {
  /**
   * Globally used variables within the directive.
   */
  private _polyline: Polyline;

  /**
   * Input variables for the polyline directive.
   */
  @Input() points: PointArrayAlias; // Array with points in format [[x, y], [x1, y1], [x2, y2], ..., [xn, yn]].
  @Input() borderSize: number; // Size of the border.
  @Input() borderColor = '#000'; // Color of the polyline.
  @Input() fill = '#000'; // Color of the polyline body
  @Input() classes: string[] = []; // List of CSS classes which needs to be added.

  /**
   * Output variables for the polyline directive.
   */
  @Output() clickEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() doubleClickEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() mouseOverEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() mouseOutEvent: EventEmitter<MouseEvent> = new EventEmitter();

  /**
   * Create SVG Polyline directive.
   * @param _svgContainer - Host SVG Container Component object instance.
   */
  constructor(
    private _svgContainer: SvgContainerComponent
  ) { }

  /**
   * Creates or updates the polyline object within the container.
   */
  ngAfterViewChecked() {
    // Check if container is created and no polyline object is created
    if (this._svgContainer.getContainer() && !this._polyline) {
      this.createPolyline();
    }
  }

  /**
   * Is called when changes are made to the polyline object.
   * @param changes - Angular Simple Changes object containing all of the changes.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (this._polyline) {
      // If we have already created the object, update it.
      this.updatePolyline();

      // Check if classes were changed
      if (changes.classes && changes.classes.currentValue !== changes.classes.previousValue) {
        // Get classes that needs to be removed
        const classesToRemove = changes.classes.previousValue.filter((previousClass: string) =>
          !changes.classes.currentValue.some((currentClass: string) => currentClass === previousClass)
        );

        // Get classes that needs to be added
        const classesToAdd = changes.classes.currentValue.filter((previousClass: string) =>
          !changes.classes.previousValue.some((currentClass: string) => currentClass === previousClass)
        );

        // Add and remove classes
        this.addRemoveClasses(classesToAdd, classesToRemove);
      }
    }
  }

  /**
   * Update polyline object within the SVG container.
   */
  updatePolyline() {
    this._polyline
      .plot(this.points) // Update the polyline object
      .fill(this.fill) // Fill color of the polyline
      .stroke({ color: this.borderColor, width: this.borderSize }); // Set the border for the polyline
  }

  /**
   * Create polyline object within the SVG container.
   */
  createPolyline() {
    this._polyline = this._svgContainer.getContainer()
      .polyline(this.points) // Create the polyline object
      .fill(this.fill) // Fill color of the polyline
      .stroke({ color: this.borderColor, width: this.borderSize }) // Set the border for the polyline
      .on('click', evt => this.clickEvent.emit(evt)) // Assign click event
      .on('dblclick', evt => this.doubleClickEvent.emit(evt)) // Assign double click event
      .on('mouseover', evt => this.mouseOverEvent.emit(evt)) // Assign mouse over event
      .on('mouseout', evt => this.mouseOutEvent.emit(evt)); // Assign mouse out event

      // Add classes to the polyline
      this.addRemoveClasses(this.classes);
  }

  /**
   * Adds classes to the polyline object.
   * @param classesToAdd - List of classes, which needs to be added.
   * @param classesToRemove - List of classes, which needs to be removed.
   */
  addRemoveClasses(classesToAdd: string[], classesToRemove: string[] = []) {
    // First let's remove classes, that are not necessary anymore
    for (const classToRemove of classesToRemove) {
      this._polyline
        .removeClass(classToRemove);
    }

    // Now let's add new classes
    for (const classToAdd of classesToAdd) {
      this._polyline
        .addClass(classToAdd);
    }
  }

  /**
   * Does all required pre-requisites before destroying the component.
   */
  ngOnDestroy() {
    this._polyline.remove();
  }
}
