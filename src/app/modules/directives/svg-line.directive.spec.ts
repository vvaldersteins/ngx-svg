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
import { SvgLineDirective } from './svg-line.directive';

// Let's mock component that uses the directive
@Component({
  template: `
    <svg-container containerId="test-id">
      <svg-line [borderSize]="borderSize" [borderColor]="borderColor"
        [x0]="x0" [y0]="y0" [x1]="x1" [y1]="y1" [classes]="classes"
        (clickEvent)="eventCalled()"
        (doubleClickEvent)="eventCalled()"
        (mouseOverEvent)="eventCalled()"
        (mouseOutEvent)="eventCalled()"
        *ngIf="createLine"></svg-line>
    </svg-container>
  `
})
class TestComponent implements OnInit {
  /**
   * Globally used parameters within the component.
   */
  public createLine = true;
  public borderSize = 1;
  public borderColor = '#000';
  public x0 = 0;
  public y0 = 0;
  public x1 = 1;
  public y1 = 1;
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

describe('SVG Line Directive', () => {
  let app: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let html: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [
        SvgContainerComponent,
        TestComponent,
        SvgLineDirective
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

  it('Should test that on destroying line, the line element is removed', () => {
    expect(html.querySelector('line')).not.toBeNull();

    fixture.destroy();

    expect(html.querySelector('line')).toBeNull();
  });

  describe('ngAfterViewChecked fn tests', () => {
    it('Should create the line element, if container exists, but line element does not exist yet', () => {
      app.createLine = false;

      fixture.detectChanges();

      expect(html.querySelectorAll('line').length).toEqual(0);

      app.createLine = true;

      fixture.detectChanges();

      expect(html.querySelectorAll('line').length).toEqual(1);
    });

    it('Should not create a new line element if data has been updated, but update the old one', () => {
      app.borderSize = 3;

      fixture.detectChanges();

      expect(html.querySelectorAll('line').length).toEqual(1);
    });
  });

  describe('createLine fn tests', () => {
    it('Should set custom attributes on the line', () => {
      const line = html.querySelector('line');

      expect(line.getAttribute('x1')).toEqual('0');
      expect(line.getAttribute('y1')).toEqual('0');
      expect(line.getAttribute('x2')).toEqual('1');
      expect(line.getAttribute('y2')).toEqual('1');
      expect(line.getAttribute('stroke')).toEqual('#000000');
      expect(line.getAttribute('stroke-width')).toEqual('1');
      expect(line.getAttribute('class')).toEqual('black-border');
    });

    it('Should create click event handler', async() => {
      spyOn(app, 'eventCalled');

      expect(app.eventCalled).toHaveBeenCalledTimes(0);

      // Get line and click on it
      const line = html.querySelector('line');
      line.dispatchEvent(new MouseEvent('click'));
      fixture.detectChanges();

      expect(app.eventCalled).toHaveBeenCalledTimes(1);
    });

    it('Should create dblclick event handler', async() => {
      spyOn(app, 'eventCalled');

      expect(app.eventCalled).toHaveBeenCalledTimes(0);

      // Get line and double click on it
      const line = html.querySelector('line');
      line.dispatchEvent(new MouseEvent('dblclick'));
      fixture.detectChanges();

      await fixture.whenStable();

      expect(app.eventCalled).toHaveBeenCalledTimes(1);
    });

    it('Should create mouseover event handler', async() => {
      spyOn(app, 'eventCalled');

      expect(app.eventCalled).toHaveBeenCalledTimes(0);

      // Get line and mouse over on it
      const line = html.querySelector('line');
      line.dispatchEvent(new MouseEvent('mouseover'));
      fixture.detectChanges();

      await fixture.whenStable();

      expect(app.eventCalled).toHaveBeenCalledTimes(1);
    });

    it('Should create mouseout event handler', async() => {
      spyOn(app, 'eventCalled');

      expect(app.eventCalled).toHaveBeenCalledTimes(0);

      // Get line and mouse out on it
      const line = html.querySelector('line');
      line.dispatchEvent(new MouseEvent('mouseout'));
      fixture.detectChanges();

      await fixture.whenStable();

      expect(app.eventCalled).toHaveBeenCalledTimes(1);
    });
  });

  describe('ngOnChanges fn tests', () => {
    it('Should call updateLine and update all data but should not reload line in case line is not changed', () => {
      app.x0 = 5;
      app.y0 = 5;
      app.x1 = 10;
      app.y1 = 10;
      app.borderSize = 5;
      app.borderColor = '#111';

      fixture.detectChanges();

      const line = html.querySelector('line');

      expect(line.getAttribute('x1')).toEqual('5');
      expect(line.getAttribute('y1')).toEqual('5');
      expect(line.getAttribute('x2')).toEqual('10');
      expect(line.getAttribute('y2')).toEqual('10');
      expect(line.getAttribute('stroke')).toEqual('#111111');
      expect(line.getAttribute('stroke-width')).toEqual('5');
      expect(line.getAttribute('class')).toEqual('black-border');
    });

    describe('Should test class changes', () => {
      it('Should remove existing classes, if they were removed', () => {
        app.classes = [];

        fixture.detectChanges();

        const line = html.querySelector('line');
        expect(line.getAttribute('class')).toEqual('');
      });

      it('Should add new classes if previous classes stay and new ones are added', () => {
        app.classes = ['black-border', 'red-fill'];

        fixture.detectChanges();

        const line = html.querySelector('line');
        expect(line.getAttribute('class')).toEqual('black-border red-fill');
      });

      it('Should add new classes and remove previous classes if previous class is removed and new one is added', () => {
        app.classes = ['red-fill'];

        fixture.detectChanges();

        const line = html.querySelector('line');
        expect(line.getAttribute('class')).toEqual(' red-fill');
      });
    });
  });
});
