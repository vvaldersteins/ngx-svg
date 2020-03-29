/**
 * Import Angular libraries.
 */
import { Directive, Input, Output, AfterViewChecked, OnDestroy, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

/**
 * Import third-party libraries.
 */
import { Line } from '@svgdotjs/svg.js';

/**
 * Import custom components.
 */
import { SvgContainerComponent } from '../components/svg-container/svg-container.component';

@Directive({
  selector: 'svg-line'
})
export class SvgLineDirective implements AfterViewChecked, OnChanges, OnDestroy {
  /**
   * Globally used variables within the directive.
   */
  private _line: Line;

  /**
   * Import variables for the line directive.
   */
  @Input() borderSize: number; // Size of the border.
  @Input() borderColor = '#000'; // Color of the line.
  @Input() x0 = 0; // Starting point on x axis.
  @Input() y0 = 0; // Starting point on y axis.
  @Input() x1 = 1; // Ending point on x axis.
  @Input() y1 = 1; // Ending point on y axis.
  @Input() classes: string[] = []; // List of CSS classes which needs to be added.
  /**
   * Output variables for the line directive.
   */
  @Output() clickEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() doubleClickEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() mouseOverEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() mouseOutEvent: EventEmitter<MouseEvent> = new EventEmitter();

  /**
   * Create SVG Line directive.
   * @param _svgContainer - Host SVG Container Component object instance.
   */
  constructor(
    private _svgContainer: SvgContainerComponent
  ) { }

  /**
   * Creates or updates the line object within the container.
   */
  ngAfterViewChecked() {
    // Check if container is created and no line object is created
    if (this._svgContainer.getContainer() && !this._line) {
      this.createLine();
    }
  }

  /**
   * Is called when changes are made to the line object.
   * @param changes - Angular Simple Changes object containing all of the changes.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (this._line) {
      // If we have already created the object, update it.
      this.updateLine();

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
   * Update line object within the SVG container.
   */
  updateLine() {
    this._line
      .plot(this.x0, this.y0, this.x1, this.y1) // Create the line at specific position
      .stroke({ color: this.borderColor, width: this.borderSize }); // Set the border for the line
  }

  /**
   * Create line object within the SVG container.
   */
  createLine() {
    this._line = this._svgContainer.getContainer()
      .line(this.x0, this.y0, this.x1, this.y1) // Create the line at specific position
      .stroke({ color: this.borderColor, width: this.borderSize }) // Set the border for the line
      .on('click', evt => this.clickEvent.emit(evt)) // Assign click event
      .on('dblclick', evt => this.doubleClickEvent.emit(evt)) // Assign double click event
      .on('mouseover', evt => this.mouseOverEvent.emit(evt)) // Assign mouse over event
      .on('mouseout', evt => this.mouseOutEvent.emit(evt)); // Assign mouse out event

      // Add classes to the line
      this.addRemoveClasses(this.classes);
  }

  /**
   * Adds classes to the line object.
   * @param classesToAdd - List of classes, which needs to be added.
   * @param classesToRemove - List of classes, which needs to be removed.
   */
  addRemoveClasses(classesToAdd: string[], classesToRemove: string[] = []) {
    // First let's remove classes, that are not necessary anymore
    for (const classToRemove of classesToRemove) {
      this._line
        .removeClass(classToRemove);
    }

    // Now let's add new classes
    for (const classToAdd of classesToAdd) {
      this._line
        .addClass(classToAdd);
    }
  }

  /**
   * Does all required pre-requisites before destroying the component.
   */
  ngOnDestroy() {
    this._line.remove();
  }
}
