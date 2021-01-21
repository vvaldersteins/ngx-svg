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
import { SvgPolylineDirective } from './svg-polyline.directive';

// Let's mock component that uses the directive
@Component({
  template: `
    <svg-container containerId="test-id">
      <svg-polyline [borderSize]="borderSize" [borderColor]="borderColor"
        [fill]="fill" [points]="points" [classes]="classes"
        (clickEvent)="eventCalled()"
        (doubleClickEvent)="eventCalled()"
        (mouseOverEvent)="eventCalled()"
        (mouseOutEvent)="eventCalled()"
        *ngIf="createPolyline"></svg-polyline>
    </svg-container>
  `
})
class TestComponent implements OnInit {
  /**
   * Globally used parameters within the component.
   */
  public createPolyline = true;
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

describe('SVG Polyline Directive', () => {
  let app: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let html: HTMLElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [
        SvgContainerComponent,
        TestComponent,
        SvgPolylineDirective
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

  it('Should test that on destroying polyline, the polyline element is removed', () => {
    expect(html.querySelector('polyline')).not.toBeNull();

    fixture.destroy();

    expect(html.querySelector('polyline')).toBeNull();
  });

  describe('ngAfterViewChecked fn tests', () => {
    it('Should create the polyline element, if container exists, but polyline element does not exist yet', () => {
      app.createPolyline = false;

      fixture.detectChanges();

      expect(html.querySelectorAll('polyline').length).toEqual(0);

      app.createPolyline = true;

      fixture.detectChanges();

      expect(html.querySelectorAll('polyline').length).toEqual(1);
    });

    it('Should not create a new polyline element if data has been updated, but update the old one', () => {
      app.borderSize = 3;

      fixture.detectChanges();

      expect(html.querySelectorAll('polyline').length).toEqual(1);
    });
  });

  describe('createPolyline fn tests', () => {
    it('Should set custom attributes on the polyline', () => {
      const polyline = html.querySelector('polyline');

      expect(polyline.getAttribute('points')).toEqual('0,0 10,10 10,0 0,10');
      expect(polyline.getAttribute('stroke')).toEqual('#000000');
      expect(polyline.getAttribute('stroke-width')).toEqual('1');
      expect(polyline.getAttribute('fill')).toEqual('#111111');
      expect(polyline.getAttribute('class')).toEqual('black-border');
    });

    it('Should create click event handler', async() => {
      spyOn(app, 'eventCalled');

      expect(app.eventCalled).toHaveBeenCalledTimes(0);

      // Get polyline and click on it
      const polyline = html.querySelector('polyline');
      polyline.dispatchEvent(new MouseEvent('click'));
      fixture.detectChanges();

      expect(app.eventCalled).toHaveBeenCalledTimes(1);
    });

    it('Should create dblclick event handler', async() => {
      spyOn(app, 'eventCalled');

      expect(app.eventCalled).toHaveBeenCalledTimes(0);

      // Get polyline and double click on it
      const polyline = html.querySelector('polyline');
      polyline.dispatchEvent(new MouseEvent('dblclick'));
      fixture.detectChanges();

      await fixture.whenStable();

      expect(app.eventCalled).toHaveBeenCalledTimes(1);
    });

    it('Should create mouseover event handler', async() => {
      spyOn(app, 'eventCalled');

      expect(app.eventCalled).toHaveBeenCalledTimes(0);

      // Get polyline and mouse over on it
      const polyline = html.querySelector('polyline');
      polyline.dispatchEvent(new MouseEvent('mouseover'));
      fixture.detectChanges();

      await fixture.whenStable();

      expect(app.eventCalled).toHaveBeenCalledTimes(1);
    });

    it('Should create mouseout event handler', async() => {
      spyOn(app, 'eventCalled');

      expect(app.eventCalled).toHaveBeenCalledTimes(0);

      // Get polyline and mouse out on it
      const polyline = html.querySelector('polyline');
      polyline.dispatchEvent(new MouseEvent('mouseout'));
      fixture.detectChanges();

      await fixture.whenStable();

      expect(app.eventCalled).toHaveBeenCalledTimes(1);
    });
  });

  describe('ngOnChanges fn tests', () => {
    it('Should call updatePolyline and update all data but should not reload polyline in case polyline is not changed', () => {
      app.points = [[0, 0], [20, 20], [20, 0]];
      app.borderSize = 5;
      app.borderColor = '#111';
      app.fill = '#222';

      fixture.detectChanges();

      const polyline = html.querySelector('polyline');

      expect(polyline.getAttribute('points')).toEqual('0,0 20,20 20,0');
      expect(polyline.getAttribute('stroke')).toEqual('#111111');
      expect(polyline.getAttribute('fill')).toEqual('#222222');
      expect(polyline.getAttribute('stroke-width')).toEqual('5');
      expect(polyline.getAttribute('class')).toEqual('black-border');
    });

    describe('Should test class changes', () => {
      it('Should remove existing classes, if they were removed', () => {
        app.classes = [];

        fixture.detectChanges();

        const polyline = html.querySelector('polyline');
        expect(polyline.getAttribute('class')).toEqual('');
      });

      it('Should add new classes if previous classes stay and new ones are added', () => {
        app.classes = ['black-border', 'red-fill'];

        fixture.detectChanges();

        const polyline = html.querySelector('polyline');
        expect(polyline.getAttribute('class')).toEqual('black-border red-fill');
      });

      it('Should add new classes and remove previous classes if previous class is removed and new one is added', () => {
        app.classes = ['red-fill'];

        fixture.detectChanges();

        const polyline = html.querySelector('polyline');
        expect(polyline.getAttribute('class')).toEqual(' red-fill');
      });
    });
  });
});
