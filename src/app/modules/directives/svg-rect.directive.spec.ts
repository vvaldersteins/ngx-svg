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
import { SvgRectDirective } from './svg-rect.directive';

// Let's mock component that uses the directive
@Component({
  template: `
    <svg-container containerId="test-id">
      <svg-rect [height]="height" [width]="width" [color]="color"
        [rx]="rx" [ry]="ry"
        [x]="x" [y]="y" [classes]="classes"
        (clickEvent)="eventCalled()"
        (doubleClickEvent)="eventCalled()"
        (mouseOverEvent)="eventCalled()"
        (mouseOutEvent)="eventCalled()"
        *ngIf="createRect"></svg-rect>
    </svg-container>
  `
})
class TestComponent implements OnInit {
  /**
   * Globally used parameters within the component.
   */
  public createRect = true;
  public color = '#000';
  public height = 10;
  public width = 10;
  public x = 0;
  public y = 0;
  public rx = 0;
  public ry = 0;
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

describe('SVG Rect Directive', () => {
  let app: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let html: HTMLElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [
        SvgContainerComponent,
        TestComponent,
        SvgRectDirective
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

  it('Should test that on destroying rect, the rect element is removed', () => {
    expect(html.querySelector('rect')).not.toBeNull();

    fixture.destroy();

    expect(html.querySelector('rect')).toBeNull();
  });

  describe('ngAfterViewChecked fn tests', () => {
    it('Should create the rect element, if container exists, but rect element does not exist yet', () => {
      app.createRect = false;

      fixture.detectChanges();

      expect(html.querySelectorAll('rect').length).toEqual(0);

      app.createRect = true;

      fixture.detectChanges();

      expect(html.querySelectorAll('rect').length).toEqual(1);
    });

    it('Should not create a new rect element if data has been updated, but update the old one', () => {
      app.color = '#111';

      fixture.detectChanges();

      expect(html.querySelectorAll('rect').length).toEqual(1);
    });
  });

  describe('createRect fn tests', () => {
    it('Should set custom attributes on the rect', () => {
      const rect = html.querySelector('rect');

      expect(rect.getAttribute('width')).toEqual('10');
      expect(rect.getAttribute('height')).toEqual('10');
      expect(rect.getAttribute('x')).toEqual('0');
      expect(rect.getAttribute('y')).toEqual('0');
      expect(rect.getAttribute('rx')).toEqual('0');
      expect(rect.getAttribute('ry')).toEqual('0');
      expect(rect.getAttribute('fill')).toEqual('#000000');
      expect(rect.getAttribute('class')).toEqual('black-border');
    });

    it('Should create click event handler', async() => {
      spyOn(app, 'eventCalled');

      expect(app.eventCalled).toHaveBeenCalledTimes(0);

      // Get rect and click on it
      const rect = html.querySelector('rect');
      rect.dispatchEvent(new MouseEvent('click'));
      fixture.detectChanges();

      expect(app.eventCalled).toHaveBeenCalledTimes(1);
    });

    it('Should create dblclick event handler', async() => {
      spyOn(app, 'eventCalled');

      expect(app.eventCalled).toHaveBeenCalledTimes(0);

      // Get rect and double click on it
      const rect = html.querySelector('rect');
      rect.dispatchEvent(new MouseEvent('dblclick'));
      fixture.detectChanges();

      await fixture.whenStable();

      expect(app.eventCalled).toHaveBeenCalledTimes(1);
    });

    it('Should create mouseover event handler', async() => {
      spyOn(app, 'eventCalled');

      expect(app.eventCalled).toHaveBeenCalledTimes(0);

      // Get rect and mouse over on it
      const rect = html.querySelector('rect');
      rect.dispatchEvent(new MouseEvent('mouseover'));
      fixture.detectChanges();

      await fixture.whenStable();

      expect(app.eventCalled).toHaveBeenCalledTimes(1);
    });

    it('Should create mouseout event handler', async() => {
      spyOn(app, 'eventCalled');

      expect(app.eventCalled).toHaveBeenCalledTimes(0);

      // Get rect and mouse out on it
      const rect = html.querySelector('rect');
      rect.dispatchEvent(new MouseEvent('mouseout'));
      fixture.detectChanges();

      await fixture.whenStable();

      expect(app.eventCalled).toHaveBeenCalledTimes(1);
    });
  });

  describe('ngOnChanges fn tests', () => {
    it('Should call updateRect and update all data', () => {
      app.width = 5;
      app.height = 8;
      app.x = 2;
      app.y = 2;
      app.rx = 10;
      app.ry = 5;
      app.color = '#111';

      fixture.detectChanges();

      const rect = html.querySelector('rect');

      expect(rect.getAttribute('width')).toEqual('5');
      expect(rect.getAttribute('height')).toEqual('8');
      expect(rect.getAttribute('x')).toEqual('2');
      expect(rect.getAttribute('y')).toEqual('2');
      expect(rect.getAttribute('rx')).toEqual('10');
      expect(rect.getAttribute('ry')).toEqual('5');
      expect(rect.getAttribute('fill')).toEqual('#111111');
      expect(rect.getAttribute('class')).toEqual('black-border');
    });

    describe('Should test class changes', () => {
      it('Should remove existing classes, if they were removed', () => {
        app.classes = [];

        fixture.detectChanges();

        const rect = html.querySelector('rect');
        expect(rect.getAttribute('class')).toEqual('');
      });

      it('Should add new classes if previous classes stay and new ones are added', () => {
        app.classes = ['black-border', 'red-fill'];

        fixture.detectChanges();

        const rect = html.querySelector('rect');
        expect(rect.getAttribute('class')).toEqual('black-border red-fill');
      });

      it('Should add new classes and remove previous classes if previous class is removed and new one is added', () => {
        app.classes = ['red-fill'];

        fixture.detectChanges();

        const rect = html.querySelector('rect');
        expect(rect.getAttribute('class')).toEqual(' red-fill');
      });
    });
  });
});
