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
import { SvgEllipseDirective } from './svg-ellipse.directive';

// Let's mock component that uses the directive
@Component({
  template: `
    <svg-container containerId="test-id">
      <svg-ellipse [height]="height" [width]="width" [color]="color"
        [x]="x" [y]="y" [classes]="classes"
        (clickEvent)="eventCalled()"
        (doubleClickEvent)="eventCalled()"
        (mouseOverEvent)="eventCalled()"
        (mouseOutEvent)="eventCalled()"
        *ngIf="createEllipse"></svg-ellipse>
    </svg-container>
  `
})
class TestComponent implements OnInit {
  /**
   * Globally used parameters within the component.
   */
  public createEllipse = true;
  public color = '#000';
  public height = 10;
  public width = 10;
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

describe('SVG Ellipse Directive', () => {
  let app: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let html: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [
        SvgContainerComponent,
        TestComponent,
        SvgEllipseDirective
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

  it('Should test that on destroying ellipse, the ellipse element is removed', () => {
    expect(html.querySelector('ellipse')).not.toBeNull();

    fixture.destroy();

    expect(html.querySelector('ellipse')).toBeNull();
  });

  describe('ngAfterViewChecked fn tests', () => {
    it('Should create the ellipse element, if container exists, but ellipse element does not exist yet', () => {
      app.createEllipse = false;

      fixture.detectChanges();

      expect(html.querySelectorAll('ellipse').length).toEqual(0);

      app.createEllipse = true;

      fixture.detectChanges();

      expect(html.querySelectorAll('ellipse').length).toEqual(1);
    });

    it('Should not create a new ellipse element if data has been updated, but update the old one', () => {
      app.color = '#111';

      fixture.detectChanges();

      expect(html.querySelectorAll('ellipse').length).toEqual(1);
    });
  });

  describe('createEllipse fn tests', () => {
    it('Should set custom attributes on the ellipse', () => {
      const ellipse = html.querySelector('ellipse');

      expect(ellipse.getAttribute('rx')).toEqual('5'); // Half of the width
      expect(ellipse.getAttribute('ry')).toEqual('5'); // Half of the height
      expect(ellipse.getAttribute('cx')).toEqual('10');
      expect(ellipse.getAttribute('cy')).toEqual('10');
      expect(ellipse.getAttribute('fill')).toEqual('#000000');
      expect(ellipse.getAttribute('class')).toEqual('black-border');
    });

    it('Should create click event handler', async() => {
      spyOn(app, 'eventCalled');

      expect(app.eventCalled).toHaveBeenCalledTimes(0);

      // Get ellipse and click on it
      const ellipse = html.querySelector('ellipse');
      ellipse.dispatchEvent(new MouseEvent('click'));
      fixture.detectChanges();

      expect(app.eventCalled).toHaveBeenCalledTimes(1);
    });

    it('Should create dblclick event handler', async() => {
      spyOn(app, 'eventCalled');

      expect(app.eventCalled).toHaveBeenCalledTimes(0);

      // Get ellipse and double click on it
      const ellipse = html.querySelector('ellipse');
      ellipse.dispatchEvent(new MouseEvent('dblclick'));
      fixture.detectChanges();

      await fixture.whenStable();

      expect(app.eventCalled).toHaveBeenCalledTimes(1);
    });

    it('Should create mouseover event handler', async() => {
      spyOn(app, 'eventCalled');

      expect(app.eventCalled).toHaveBeenCalledTimes(0);

      // Get ellipse and mouse over on it
      const ellipse = html.querySelector('ellipse');
      ellipse.dispatchEvent(new MouseEvent('mouseover'));
      fixture.detectChanges();

      await fixture.whenStable();

      expect(app.eventCalled).toHaveBeenCalledTimes(1);
    });

    it('Should create mouseout event handler', async() => {
      spyOn(app, 'eventCalled');

      expect(app.eventCalled).toHaveBeenCalledTimes(0);

      // Get ellipse and mouse out on it
      const ellipse = html.querySelector('ellipse');
      ellipse.dispatchEvent(new MouseEvent('mouseout'));
      fixture.detectChanges();

      await fixture.whenStable();

      expect(app.eventCalled).toHaveBeenCalledTimes(1);
    });
  });

  describe('ngOnChanges fn tests', () => {
    it('Should call updateEllipse and update all data', () => {
      app.width = 5;
      app.height = 8;
      app.x = 2;
      app.y = 2;
      app.color = '#111';

      fixture.detectChanges();

      const ellipse = html.querySelector('ellipse');

      expect(ellipse.getAttribute('rx')).toEqual('2.5'); // Half of the width
      expect(ellipse.getAttribute('ry')).toEqual('4'); // Half of the height
      expect(ellipse.getAttribute('cx')).toEqual('7');
      expect(ellipse.getAttribute('cy')).toEqual('10');
      expect(ellipse.getAttribute('fill')).toEqual('#111111');
      expect(ellipse.getAttribute('class')).toEqual('black-border');
    });

    describe('Should test class changes', () => {
      it('Should remove existing classes, if they were removed', () => {
        app.classes = [];

        fixture.detectChanges();

        const ellipse = html.querySelector('ellipse');
        expect(ellipse.getAttribute('class')).toEqual('');
      });

      it('Should add new classes if previous classes stay and new ones are added', () => {
        app.classes = ['black-border', 'red-fill'];

        fixture.detectChanges();

        const ellipse = html.querySelector('ellipse');
        expect(ellipse.getAttribute('class')).toEqual('black-border red-fill');
      });

      it('Should add new classes and remove previous classes if previous class is removed and new one is added', () => {
        app.classes = ['red-fill'];

        fixture.detectChanges();

        const ellipse = html.querySelector('ellipse');
        expect(ellipse.getAttribute('class')).toEqual(' red-fill');
      });
    });
  });
});
