/**
 * Import Angular libraries.
 */
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';

/**
 * Import custom components.
 */
import { SvgContainerComponent } from '../components/svg-container/svg-container.component';

/**
 * Import custom directives.
 */
import { SvgCircleDirective } from './svg-circle.directive';

// Let's mock component that uses the directive
@Component({
  template: `
    <svg-container containerId="test-id">
      <svg-circle [diameter]="diameter" [color]="color"
        [x]="x" [y]="y" [classes]="classes"
        (clickEvent)="eventCalled()"
        (doubleClickEvent)="eventCalled()"
        (mouseOverEvent)="eventCalled()"
        (mouseOutEvent)="eventCalled()"
        *ngIf="createCircle"></svg-circle>
    </svg-container>
  `
})
class TestComponent implements OnInit {
  /**
   * Globally used parameters within the component.
   */
  public createCircle = true;
  public color = '#000';
  public diameter = 2;
  public x = 0;
  public y = 0;
  public classes = ['black-border'];

  /**
   * Creates test component object instance.
   * @param cdRef - Change detector ref object instance.
   */
  constructor(
    private cdRef: ChangeDetectorRef
  ) {}

  /**
   * Does all required pre-requisites before initializing the test component.
   */
  ngOnInit(): void {
    this.cdRef.detectChanges();
  }

  /**
   * Mock function for testing that event has been called.
   */
  eventCalled() {}
}

describe('SVG Circle Directive', () => {
  let app: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let html: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [
        SvgContainerComponent,
        TestComponent,
        SvgCircleDirective
      ],
      providers: [
        { provide: ComponentFixtureAutoDetect, useValue: true }
      ]
    }).compileComponents();

    // Let's assign variables
    fixture = TestBed.createComponent(TestComponent);
    app = fixture.componentInstance;
    html = fixture.nativeElement;
  }));

  it('Should create component', () => {
    expect(app).toBeTruthy();
  });

  it('Should test that on destroying circle, the circle element is removed', () => {
    expect(html.querySelector('circle')).not.toBeNull();

    fixture.destroy();

    expect(html.querySelector('circle')).toBeNull();
  });

  describe('ngAfterViewChecked fn tests', () => {
    it('Should create the circle element, if container exists, but circle element does not exist yet', () => {
      app.createCircle = false;

      fixture.detectChanges();

      expect(html.querySelectorAll('circle').length).toEqual(0);

      app.createCircle = true;

      fixture.detectChanges();

      expect(html.querySelectorAll('circle').length).toEqual(1);
    });

    it('Should not create a new circle element if data has been updated, but update the old one', () => {
      app.color = '#111';

      fixture.detectChanges();

      expect(html.querySelectorAll('circle').length).toEqual(1);
    });
  });

  describe('createCircle fn tests', () => {
    it('Should set custom attributes on the circle', () => {
      const circle = html.querySelector('circle');

      expect(circle.getAttribute('r')).toEqual('1'); // Half of the diameter
      expect(circle.getAttribute('cx')).toEqual('2');
      expect(circle.getAttribute('cy')).toEqual('2');
      expect(circle.getAttribute('fill')).toEqual('#000000');
      expect(circle.getAttribute('class')).toEqual('black-border');
    });

    it('Should create click event handler', async() => {
      spyOn(app, 'eventCalled');

      expect(app.eventCalled).toHaveBeenCalledTimes(0);

      // Get circle and click on it
      const circle = html.querySelector('circle');
      circle.dispatchEvent(new MouseEvent('click'));
      fixture.detectChanges();

      expect(app.eventCalled).toHaveBeenCalledTimes(1);
    });

    it('Should create dblclick event handler', async() => {
      spyOn(app, 'eventCalled');

      expect(app.eventCalled).toHaveBeenCalledTimes(0);

      // Get circle and double click on it
      const circle = html.querySelector('circle');
      circle.dispatchEvent(new MouseEvent('dblclick'));
      fixture.detectChanges();

      await fixture.whenStable();

      expect(app.eventCalled).toHaveBeenCalledTimes(1);
    });

    it('Should create mouseover event handler', async() => {
      spyOn(app, 'eventCalled');

      expect(app.eventCalled).toHaveBeenCalledTimes(0);

      // Get circle and mouse over on it
      const circle = html.querySelector('circle');
      circle.dispatchEvent(new MouseEvent('mouseover'));
      fixture.detectChanges();

      await fixture.whenStable();

      expect(app.eventCalled).toHaveBeenCalledTimes(1);
    });

    it('Should create mouseout event handler', async() => {
      spyOn(app, 'eventCalled');

      expect(app.eventCalled).toHaveBeenCalledTimes(0);

      // Get circle and mouse out on it
      const circle = html.querySelector('circle');
      circle.dispatchEvent(new MouseEvent('mouseout'));
      fixture.detectChanges();

      await fixture.whenStable();

      expect(app.eventCalled).toHaveBeenCalledTimes(1);
    });
  });

  describe('ngOnChanges fn tests', () => {
    it('Should call updateCircle and update all data', () => {
      app.diameter = 5;
      app.x = 2;
      app.y = 2;
      app.color = '#111';

      fixture.detectChanges();

      const circle = html.querySelector('circle');

      expect(circle.getAttribute('r')).toEqual('2.5'); // Half of the diameter
      expect(circle.getAttribute('cx')).toEqual('7');
      expect(circle.getAttribute('cy')).toEqual('7');
      expect(circle.getAttribute('fill')).toEqual('#111111');
      expect(circle.getAttribute('class')).toEqual('black-border');
    });

    describe('Should test class changes', () => {
      it('Should remove existing classes, if they were removed', () => {
        app.classes = [];

        fixture.detectChanges();

        const circle = html.querySelector('circle');
        expect(circle.getAttribute('class')).toEqual('');
      });

      it('Should add new classes if previous classes stay and new ones are added', () => {
        app.classes = ['black-border', 'red-fill'];

        fixture.detectChanges();

        const circle = html.querySelector('circle');
        expect(circle.getAttribute('class')).toEqual('black-border red-fill');
      });

      it('Should add new classes and remove previous classes if previous class is removed and new one is added', () => {
        app.classes = ['red-fill'];

        fixture.detectChanges();

        const circle = html.querySelector('circle');
        expect(circle.getAttribute('class')).toEqual(' red-fill');
      });
    });
  });
});
