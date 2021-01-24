/**
 * Import Angular libraries.
 */
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TestBed, ComponentFixture, ComponentFixtureAutoDetect, waitForAsync } from '@angular/core/testing';

/**
 * Import custom components.
 */
import { SvgContainerComponent } from '../components/svg-container/svg-container.component';

/**
 * Import custom directives.
 */
import { SvgPolygonDirective } from './svg-polygon.directive';

// Let's mock component that uses the directive
@Component({
  template: `
    <svg-container containerId="test-id">
      <svg-polygon [borderSize]="borderSize" [borderColor]="borderColor"
        [fill]="fill" [points]="points" [classes]="classes"
        (clickEvent)="eventCalled()"
        (doubleClickEvent)="eventCalled()"
        (mouseOverEvent)="eventCalled()"
        (mouseOutEvent)="eventCalled()"
        (onInitialize)="eventCalled()"
        *ngIf="createPolygon"></svg-polygon>
    </svg-container>
  `
})
class TestComponent implements OnInit {
  /**
   * Globally used parameters within the component.
   */
  public createPolygon = true;
  public borderSize = 1;
  public borderColor = '#000';
  public points = [[0, 0], [10, 10], [10, 0], [0, 10]];
  public fill = '#111';
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

describe('SVG Polygon Directive', () => {
  let app: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let html: HTMLElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [
        SvgContainerComponent,
        TestComponent,
        SvgPolygonDirective
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

  it('Should test that on destroying polygon, the polygon element is removed', () => {
    expect(html.querySelector('polygon')).not.toBeNull();

    fixture.destroy();

    expect(html.querySelector('polygon')).toBeNull();
  });

  describe('ngAfterViewChecked fn tests', () => {
    it('Should create the polygon element, if container exists, but polygon element does not exist yet', () => {
      app.createPolygon = false;

      fixture.detectChanges();

      expect(html.querySelectorAll('polygon').length).toEqual(0);

      app.createPolygon = true;

      fixture.detectChanges();

      expect(html.querySelectorAll('polygon').length).toEqual(1);
    });

    it('Should not create a new polygon element if data has been updated, but update the old one', () => {
      app.borderSize = 3;

      fixture.detectChanges();

      expect(html.querySelectorAll('polygon').length).toEqual(1);
    });
  });

  describe('createPolygon fn tests', () => {
    it('Should set custom attributes on the polygon', () => {
      const polygon = html.querySelector('polygon');

      expect(polygon.getAttribute('points')).toEqual('0,0 10,10 10,0 0,10');
      expect(polygon.getAttribute('stroke')).toEqual('#000000');
      expect(polygon.getAttribute('stroke-width')).toEqual('1');
      expect(polygon.getAttribute('fill')).toEqual('#111111');
      expect(polygon.getAttribute('class')).toEqual('black-border');
    });

    it('Should emit onInitialize on polygon creation', () => {
      spyOn(app, 'eventCalled');
      app.createPolygon = false;

      fixture.detectChanges();

      app.createPolygon = true;

      fixture.detectChanges();

      expect(app.eventCalled).toHaveBeenCalledTimes(1);
    });

    it('Should create click event handler', async() => {
      spyOn(app, 'eventCalled');

      expect(app.eventCalled).toHaveBeenCalledTimes(0);

      // Get polygon and click on it
      const polygon = html.querySelector('polygon');
      polygon.dispatchEvent(new MouseEvent('click'));
      fixture.detectChanges();

      expect(app.eventCalled).toHaveBeenCalledTimes(1);
    });

    it('Should create dblclick event handler', async() => {
      spyOn(app, 'eventCalled');

      expect(app.eventCalled).toHaveBeenCalledTimes(0);

      // Get polygon and double click on it
      const polygon = html.querySelector('polygon');
      polygon.dispatchEvent(new MouseEvent('dblclick'));
      fixture.detectChanges();

      await fixture.whenStable();

      expect(app.eventCalled).toHaveBeenCalledTimes(1);
    });

    it('Should create mouseover event handler', async() => {
      spyOn(app, 'eventCalled');

      expect(app.eventCalled).toHaveBeenCalledTimes(0);

      // Get polygon and mouse over on it
      const polygon = html.querySelector('polygon');
      polygon.dispatchEvent(new MouseEvent('mouseover'));
      fixture.detectChanges();

      await fixture.whenStable();

      expect(app.eventCalled).toHaveBeenCalledTimes(1);
    });

    it('Should create mouseout event handler', async() => {
      spyOn(app, 'eventCalled');

      expect(app.eventCalled).toHaveBeenCalledTimes(0);

      // Get polygon and mouse out on it
      const polygon = html.querySelector('polygon');
      polygon.dispatchEvent(new MouseEvent('mouseout'));
      fixture.detectChanges();

      await fixture.whenStable();

      expect(app.eventCalled).toHaveBeenCalledTimes(1);
    });
  });

  describe('ngOnChanges fn tests', () => {
    it('Should call updatePolygon and update all data but should not reload polygon in case polygon is not changed', () => {
      app.points = [[0, 0], [20, 20], [20, 0]];
      app.borderSize = 5;
      app.borderColor = '#111';
      app.fill = '#222';

      fixture.detectChanges();

      const polygon = html.querySelector('polygon');

      expect(polygon.getAttribute('points')).toEqual('0,0 20,20 20,0');
      expect(polygon.getAttribute('stroke')).toEqual('#111111');
      expect(polygon.getAttribute('fill')).toEqual('#222222');
      expect(polygon.getAttribute('stroke-width')).toEqual('5');
      expect(polygon.getAttribute('class')).toEqual('black-border');
    });

    describe('Should test class changes', () => {
      it('Should remove existing classes, if they were removed', () => {
        app.classes = [];

        fixture.detectChanges();

        const polygon = html.querySelector('polygon');
        expect(polygon.getAttribute('class')).toEqual('');
      });

      it('Should add new classes if previous classes stay and new ones are added', () => {
        app.classes = ['black-border', 'red-fill'];

        fixture.detectChanges();

        const polygon = html.querySelector('polygon');
        expect(polygon.getAttribute('class')).toEqual('black-border red-fill');
      });

      it('Should add new classes and remove previous classes if previous class is removed and new one is added', () => {
        app.classes = ['red-fill'];

        fixture.detectChanges();

        const polygon = html.querySelector('polygon');
        expect(polygon.getAttribute('class')).toEqual(' red-fill');
      });
    });
  });
});
