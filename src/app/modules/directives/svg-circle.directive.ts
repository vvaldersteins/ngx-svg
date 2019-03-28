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
  selector: 'svg-circle'
})
export class SvgCircleDirective implements AfterViewChecked, OnChanges, OnDestroy {
  /**
   * Globally used variables within the directive.
   */
  private _circle: SVG.Circle;

  /**
   * Import variables for the circle directive.
   */
  @Input() radius: number; // Radius of the circle
  @Input() color = '#000'; // Color of the circle background
  @Input() x = 0; // Starting point on x axis.
  @Input() y = 0; // Starting point on y axis.
  @Input() classes: string[] = []; // List of CSS classes which needs to be added.

  /**
   * Output variables for the circle directive.
   */
  @Output() clickEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() doubleClickEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() mouseOverEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() mouseOutEvent: EventEmitter<MouseEvent> = new EventEmitter();

  /**
   * Create SVG Circle directive.
   * @param _svgContainer - Host SVG Container Component object instance.
   */
  constructor(
    private _svgContainer: SvgContainerComponent
  ) { }

  /**
   * Creates the circle object within the container.
   */
  ngAfterViewChecked() {
    // Check if container is creatted and no circle object is created
    if (this._svgContainer.getContainer() && !this._circle) {
      this.createCircle();
    }
  }

  /**
   * Is called when changes are made to the circle object.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (this._circle) {
      // If we have already created the object, update it.
      this.updateCircle();

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
   * Update circle object within the SVG container.
   */
  updateCircle() {
    this._circle
      .radius(this.radius) // Set the radius
      .fill(this.color) // Set the fill color
      .attr('cx', +this.x + +this.radius) // Set x position
      .attr('cy', +this.y + +this.radius); // Set y position
  }

  /**
   * Create circle object within the SVG container.
   */
  createCircle() {
    this._circle = this._svgContainer.getContainer()
      .circle(this.radius) // Create the circle with radius
      .fill(this.color) // Set the fill color
      .attr('cx', +this.x + +this.radius) // Set x position
      .attr('cy', +this.y + +this.radius) // Set y position
      .on('click', evt => this.clickEvent.emit(evt)) // Assign click event
      .on('dblclick', evt => this.doubleClickEvent.emit(evt)) // Assign double click event
      .on('mouseover', evt => this.mouseOverEvent.emit(evt)) // Assign mouse over event
      .on('mouseout', evt => this.mouseOutEvent.emit(evt)); // Assign mouse out event

    // Add to the circle
    this.addRemoveClasses(this.classes);
  }

  /**
   * Adds classes to the circle object.
   * @param classesToAdd - List of classes, which needs to be added.
   * @param classesToRemove - List of classes, which needs to be removed.
   */
  addRemoveClasses(classesToAdd: string[], classesToRemove: string[] = []) {
    // First let's remove classes, that are not necessary anymore
    for (const classToRemove of classesToRemove) {
      this._circle
        .removeClass(classToRemove);
    }

    // Now let's add new classes
    for (const classToAdd of classesToAdd) {
      this._circle
        .addClass(classToAdd);
    }
  }

  /**
   * Does all required pre-requisites before destroying the component.
   */
  ngOnDestroy() {
    this._circle.remove();
  }
}
