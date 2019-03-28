/**
 * Import Angular libraries.
 */
import { Directive, Input, Output, AfterViewChecked, EventEmitter, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';

/**
 * Import third-party libraries.
 */
import * as SVG from 'svgjs';

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
  private _rect: SVG.Rect;

  /**
   * Import variables for the rectangular directive.
   */
  @Input() height: number; // Height of the rectangular.
  @Input() width: number; // Width of the rectangular.
  @Input() color = '#000'; // Color of the rectangular background
  @Input() x = 0; // Starting point on x axis.
  @Input() y = 0; // Starting point on y axis.
  @Input() classes: string[] = []; // List of CSS classes which needs to be added.

  /**
   * Output variables for the rectangular directive.
   */
  @Output() clickEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() doubleClickEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() mouseOverEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() mouseOutEvent: EventEmitter<MouseEvent> = new EventEmitter();

  /**
   * Create SVG Rect directive.
   * @param _svgContainer - Host SVG Container Component object instance.
   */
  constructor(
    private _svgContainer: SvgContainerComponent
  ) { }

  /**
   * Creates or updates the rectangular object within the container
   */
  ngAfterViewChecked() {
    // Check if container is creatted and no rectangular object is created
    if (this._svgContainer.getContainer() && !this._rect) {
      this.createRect();
    }
  }

  /**
   * Is called when changes are made to the rect object.
   * @param changes - Angular Simple Changes object containing all of the changes.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (this._rect) {
      // If we have already created the object, update it.
      this.updateRect();

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
   * Update rectangular object within the SVG container.
   */
  updateRect() {
    this._rect
      .size(this.width, this.height) // Update the width and height
      .fill(this.color) // Update the color
      .move(this.x, this.y); // Update the coordinates
  }

  /**
   * Create rectangular object within the SVG container.
   */
  createRect() {
    this._rect = this._svgContainer.getContainer()
      .rect(this.width, this.height) // Set height and width of the rect
      .fill(this.color) // Set fill color
      .move(this.x, this.y) // Set coordinates
      .on('click', evt => this.clickEvent.emit(evt)) // Assign click event
      .on('dblclick', evt => this.doubleClickEvent.emit(evt)) // Assign double click event
      .on('mouseover', evt => this.mouseOverEvent.emit(evt)) // Assign mouse over event
      .on('mouseout', evt => this.mouseOutEvent.emit(evt)); // Assign mouse out event

      // Add classes to the rect
      this.addRemoveClasses(this.classes);
  }

  /**
   * Adds classes to the rect object.
   * @param classesToAdd - List of classes, which needs to be added.
   * @param classesToRemove - List of classes, which needs to be removed.
   */
  addRemoveClasses(classesToAdd: string[], classesToRemove: string[] = []) {
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

  /**
   * Does all required pre-requisites before destroying the component.
   */
  ngOnDestroy() {
    this._rect.remove();
  }
}
