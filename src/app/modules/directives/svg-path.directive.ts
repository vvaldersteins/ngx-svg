/**
 * Import Angular libraries.
 */
import { Directive, Input, Output, EventEmitter, OnDestroy, AfterViewChecked, OnChanges, SimpleChanges } from '@angular/core';

/**
 * Import third-party libraries.
 */
import * as SVG from 'svgjs';

/**
 * Import custom components.
 */
import { SvgContainerComponent } from '../components/svg-container/svg-container.component';

@Directive({
  selector: 'svg-path'
})
export class SvgPathDirective implements AfterViewChecked, OnChanges, OnDestroy {
  /**
   * Globally used variables within the directive.
   */
  private _path: SVG.Path;

  /**
   * Import variables for the path directive.
   */
  @Input() path = ''; // Path which needs to be displayed.
  @Input() borderColor = '#000'; // Color of the border.
  @Input() borderSize = 2; // Size of the border.
  @Input() x = 0; // Starting point on x axis.
  @Input() y = 0; // Starting point on y axis.
  @Input() fill = ''; // Fill color of the path.
  @Input() classes: string[] = []; // List of CSS classes which needs to be added.

  /**
   * Output variables for the path directive.
   */
  @Output() clickEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() doubleClickEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() mouseOverEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() mouseOutEvent: EventEmitter<MouseEvent> = new EventEmitter();

  /**
   * Create SVG Path directive.
   * @param _svgContainer - Host SVG Container Component object instance.
   */
  constructor(
    private _svgContainer: SvgContainerComponent
  ) { }

  /**
   * Creates the path object within the container.
   */
  ngAfterViewChecked() {
    // Check if container is creatted and no path object is created
    if (this._svgContainer.getContainer() && !this._path) {
      this.createPath();
    }
  }

  /**
   * Is called when changes are made to the path object.
   * @param changes - Angular Simple Changes object containing all of the changes.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (this._path) {
      // If we have already created the object, update it.
      this.updatePath();

      // Check if classes were changed
      if (changes.classes && changes.classes.currentValue !== changes.classes.previousValue) {
        // Get classes that needs to be removed
        const classesToRemove = changes.classes.previousValue.filter(previousClass =>
          !changes.classes.currentValue.some(currentClass => currentClass === previousClass)
        );

        // Get classes that needs to be added
        const classesToAdd = changes.classes.currentValue.filter(previousClass =>
          !changes.classes.previousValue.some(currentClass => currentClass === previousClass)
        );

        // Add and remove classes
        this.addRemoveClasses(classesToAdd, classesToRemove);
      }
    }
  }

  /**
   * Update path object within the SVG container.
   */
  updatePath() {
    this._path
      .plot(this.path) // Update the path for the element
      .stroke({ color: this.borderColor, width: this.borderSize }) // Update the border for the
      .fill(this.fill === '' ? 'rgba(0, 0, 0, 0)' : this.fill) // Update fill of the path
      .move(this.x, this.y); // Update the location of the path
  }

  /**
   * Create path object within the SVG container.
   */
  createPath() {
    this._path = this._svgContainer.getContainer()
      .path(this.path) // Set the path for the element
      .stroke({ color: this.borderColor, width: this.borderSize }) // Set the border for the path
      .fill(this.fill === '' ? 'rgba(0, 0, 0, 0)' : this.fill) // Set fill of the path
      .move(this.x, this.y) // Set the location of the path
      .on('click', evt => this.clickEvent.emit(evt)) // Assign click event
      .on('dblclick', evt => this.doubleClickEvent.emit(evt)) // Assign double click event
      .on('mouseover', evt => this.mouseOverEvent.emit(evt)) // Assign mouse over event
      .on('mouseout', evt => this.mouseOutEvent.emit(evt)); // Assign mouse out event

    // Add classes to the path
    this.addRemoveClasses(this.classes);
  }

  /**
   * Adds classes to the path object.
   * @param classesToAdd - List of classes, which needs to be added.
   * @param classesToRemove - List of classes, which needs to be removed.
   */
  addRemoveClasses(classesToAdd: string[], classesToRemove: string[] = []) {
    // First let's remove classes, that are not necessary anymore
    for (const classToRemove of classesToRemove) {
      this._path
        .removeClass(classToRemove);
    }

    // Now let's add new classes
    for (const classToAdd of classesToAdd) {
      this._path
        .addClass(classToAdd);
    }
  }

  /**
   * Does all required pre-requisites before destroying the component.
   */
  ngOnDestroy() {
    this._path.remove();
  }
}
