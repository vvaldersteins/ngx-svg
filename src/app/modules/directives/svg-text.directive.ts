/**
 * Import Angular libraries.
 */
import { Directive, Input, Output, EventEmitter, OnDestroy, AfterViewChecked, OnChanges, SimpleChanges } from '@angular/core';

/**
 * Import third-party libraries.
 */
import { Text } from '@svgdotjs/svg.js';

/**
 * Import custom components.
 */
import { SvgContainerComponent } from '../components/svg-container/svg-container.component';

@Directive({
  selector: 'svg-text'
})
export class SvgTextDirective implements AfterViewChecked, OnChanges, OnDestroy {
  /**
   * Globally used variables within the directive.
   */
  private _text: Text;

  /**
   * Import variables for the text directive.
   */
  @Input() color = '#000'; // Color of the text.
  @Input() text = ''; // Text which needs to be displayed.
  @Input() x = 0; // Starting point on x axis.
  @Input() y = 0; // Starting point on y axis.
  @Input() size = 10; // Size of the text.
  @Input() classes: string[] = []; // List of CSS classes which needs to be added.

  /**
   * Output variables for the text directive.
   */
  @Output() clickEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() doubleClickEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() mouseOverEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() mouseOutEvent: EventEmitter<MouseEvent> = new EventEmitter();

  /**
   * Create SVG Text directive.
   * @param _svgContainer - Host SVG Container Component object instance.
   */
  constructor(
    private _svgContainer: SvgContainerComponent
  ) { }

  /**
   * Creates the text object within the container.
   */
  ngAfterViewChecked() {
    // Check if container is created and no text object is created
    if (this._svgContainer.getContainer() && !this._text) {
      this.createText();
    }
  }

  /**
   * Is called when changes are made to the text object.
   * @param changes - Angular Simple Changes object containing all of the changes.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (this._text) {
      // If we have already created the object, update it.
      this.updateText();

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
   * Update text object within the SVG container.
   */
  updateText() {
    this._text
      .text(this.text) // Update the text for the element
      .fill(this.color) // Update the color of the text
      .size(this.size) // Update the size of the text
      .move(this.x, this.y); // Update the location of the text
  }

  /**
   * Create text object within the SVG container.
   */
  createText() {
    this._text = this._svgContainer.getContainer()
      .text(this.text) // Set the text for the element
      .fill(this.color) // Set the color of the text
      .size(this.size) // Set the size of the text
      .move(this.x, this.y) // Set the location of the text
      .on('click', evt => this.clickEvent.emit(evt)) // Assign click event
      .on('dblclick', evt => this.doubleClickEvent.emit(evt)) // Assign double click event
      .on('mouseover', evt => this.mouseOverEvent.emit(evt)) // Assign mouse over event
      .on('mouseout', evt => this.mouseOutEvent.emit(evt)); // Assign mouse out event

    // Add classes to the text
    this.addRemoveClasses(this.classes);
  }

  /**
   * Adds classes to the text object.
   * @param classesToAdd - List of classes, which needs to be added.
   * @param classesToRemove - List of classes, which needs to be removed.
   */
  addRemoveClasses(classesToAdd: string[], classesToRemove: string[] = []) {
    // First let's remove classes, that are not necessary anymore
    for (const classToRemove of classesToRemove) {
      this._text
        .removeClass(classToRemove);
    }

    // Now let's add new classes
    for (const classToAdd of classesToAdd) {
      this._text
        .addClass(classToAdd);
    }
  }

  /**
   * Does all required pre-requisites before destroying the component.
   */
  ngOnDestroy() {
    this._text.remove();
  }
}
