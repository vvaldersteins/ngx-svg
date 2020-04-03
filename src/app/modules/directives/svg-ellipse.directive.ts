/**
 * Import Angular libraries.
 */
import { Directive, Input, Output, AfterViewChecked, EventEmitter, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';

/**
 * Import third-party libraries.
 */
import { Ellipse } from '@svgdotjs/svg.js';

/**
 * Import custom components.
 */
import { SvgContainerComponent } from '../components/svg-container/svg-container.component';

@Directive({
  selector: 'svg-ellipse'
})
export class SvgEllipseDirective implements AfterViewChecked, OnChanges, OnDestroy {
  /**
   * Globally used variables within the directive.
   */
  private _ellipse: Ellipse;

  /**
   * Import variables for the ellipse directive.
   */
  @Input() height: number; // Height of the ellipse.
  @Input() width: number; // Width of the ellipse.
  @Input() color = '#000'; // Color of the ellipse background
  @Input() x = 0; // Starting point on x axis.
  @Input() y = 0; // Starting point on y axis.
  @Input() classes: string[] = []; // List of CSS classes which needs to be added.
  /**
   * Output variables for the ellipse directive.
   */
  @Output() clickEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() doubleClickEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() mouseOverEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() mouseOutEvent: EventEmitter<MouseEvent> = new EventEmitter();

  /**
   * Create SVG Ellipse directive.
   * @param _svgContainer - Host SVG Container Component object instance.
   */
  constructor(
    private _svgContainer: SvgContainerComponent
  ) { }

  /**
   * Creates or updates the ellipse object within the container
   */
  ngAfterViewChecked(): void {
    // Check if container is created and no ellipse object is created
    if (this._svgContainer.getContainer() && !this._ellipse) {
      this.createEllipse();
    }
  }

  /**
   * Does all required pre-requisites before destroying the component.
   */
  ngOnDestroy(): void {
    this._ellipse.remove();
  }

  /**
   * Is called when changes are made to the ellipse object.
   * @param changes - Angular Simple Changes object containing all of the changes.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (this._ellipse) {
      // If we have already created the object, update it.
      this.updateEllipse();

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
   * Update ellipse object within the SVG container.
   */
  private updateEllipse(): void {
    this._ellipse
      .size(this.width, this.height) // Update the width and height
      .fill(this.color) // Update the color
      .attr('cx', +this.x + +this.width) // Set x position
      .attr('cy', +this.y + +this.height); // Set y position
  }

  /**
   * Create ellipse object within the SVG container.
   */
  private createEllipse(): void {
    this._ellipse = this._svgContainer.getContainer()
      .ellipse(this.width, this.height) // Set height and width of the ellipse
      .fill(this.color) // Set fill color
      .attr('cx', +this.x + +this.width) // Set x position
      .attr('cy', +this.y + +this.height) // Set y position
      .on('click', evt => this.clickEvent.emit(evt)) // Assign click event
      .on('dblclick', evt => this.doubleClickEvent.emit(evt)) // Assign double click event
      .on('mouseover', evt => this.mouseOverEvent.emit(evt)) // Assign mouse over event
      .on('mouseout', evt => this.mouseOutEvent.emit(evt)); // Assign mouse out event

    // Add classes to the ellipse
    this.addRemoveClasses(this.classes);
  }

  /**
   * Adds classes to the ellipse object.
   * @param classesToAdd - List of classes, which needs to be added.
   * @param classesToRemove - List of classes, which needs to be removed.
   */
  private addRemoveClasses(classesToAdd: string[], classesToRemove: string[] = []): void {
    // First let's remove classes, that are not necessary anymore
    for (const classToRemove of classesToRemove) {
      this._ellipse
        .removeClass(classToRemove);
    }

    // Now let's add new classes
    for (const classToAdd of classesToAdd) {
      this._ellipse
        .addClass(classToAdd);
    }
  }
}
