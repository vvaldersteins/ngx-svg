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
import { SvgPathDirective } from './svg-path.directive';

// Let's mock component that uses the directive
@Component({
  template: `
    <svg-container containerId="test-id">
      <svg-path [borderSize]="borderSize" [borderColor]="borderColor"
        [x]="x" [y]="y" [fill]="fill" [path]="path" [classes]="classes"
        (clickEvent)="eventCalled()"
        (doubleClickEvent)="eventCalled()"
        (mouseOverEvent)="eventCalled()"
        (mouseOutEvent)="eventCalled()"
        *ngIf="createPath"></svg-path>
    </svg-container>
  `
})
class TestComponent implements OnInit {
  /**
   * Globally used parameters within the component.
   */
  public createPath = true;
  public borderSize = 1;
  public borderColor = '#000';
  public x = 0;
  public y = 0;
  public fill = '#111';
  public path = 'M10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80';
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

describe('SVG Path Directive', () => {
  let app: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let html: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [
        SvgContainerComponent,
        TestComponent,
        SvgPathDirective
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

  it('Should test that on destroying path, the path element is removed', () => {
    expect(html.querySelector('path')).not.toBeNull();

    fixture.destroy();

    expect(html.querySelector('path')).toBeNull();
  });

  describe('ngAfterViewChecked fn tests', () => {
    it('Should create the path element, if container exists, but path element does not exist yet', () => {
      app.createPath = false;

      fixture.detectChanges();

      expect(html.querySelectorAll('path').length).toEqual(0);

      app.createPath = true;

      fixture.detectChanges();

      expect(html.querySelectorAll('path').length).toEqual(1);
    });

    it('Should not create a new path element if data has been updated, but update the old one', () => {
      app.borderSize = 3;

      fixture.detectChanges();

      expect(html.querySelectorAll('path').length).toEqual(1);
    });
  });

  describe('createPath fn tests', () => {
    it('Should set custom attributes on the path', () => {
      let path = html.querySelector('path');

      expect(path.getAttribute('d')).toEqual('M0 52.5C30 -17.5 55 -17.5 85 52.5S140 122.5 170 52.5 ');
      expect(path.getAttribute('stroke')).toEqual('#000000');
      expect(path.getAttribute('stroke-width')).toEqual('1');
      expect(path.getAttribute('fill')).toEqual('#111111');
      expect(path.getAttribute('class')).toEqual('black-border');

      // Let's destroy the element and test with undefined fill
      app.createPath = false;
      app.fill = undefined;

      fixture.detectChanges();

      app.createPath = true;

      fixture.detectChanges();

      path = html.querySelector('path');

      expect(path.getAttribute('fill')).toEqual('rgba(0, 0, 0, 0)');
    });

    it('Should create click event handler', async() => {
      spyOn(app, 'eventCalled');

      expect(app.eventCalled).toHaveBeenCalledTimes(0);

      // Get path and click on it
      const path = html.querySelector('path');
      path.dispatchEvent(new MouseEvent('click'));
      fixture.detectChanges();

      expect(app.eventCalled).toHaveBeenCalledTimes(1);
    });

    it('Should create dblclick event handler', async() => {
      spyOn(app, 'eventCalled');

      expect(app.eventCalled).toHaveBeenCalledTimes(0);

      // Get path and double click on it
      const path = html.querySelector('path');
      path.dispatchEvent(new MouseEvent('dblclick'));
      fixture.detectChanges();

      await fixture.whenStable();

      expect(app.eventCalled).toHaveBeenCalledTimes(1);
    });

    it('Should create mouseover event handler', async() => {
      spyOn(app, 'eventCalled');

      expect(app.eventCalled).toHaveBeenCalledTimes(0);

      // Get path and mouse over on it
      const path = html.querySelector('path');
      path.dispatchEvent(new MouseEvent('mouseover'));
      fixture.detectChanges();

      await fixture.whenStable();

      expect(app.eventCalled).toHaveBeenCalledTimes(1);
    });

    it('Should create mouseout event handler', async() => {
      spyOn(app, 'eventCalled');

      expect(app.eventCalled).toHaveBeenCalledTimes(0);

      // Get path and mouse out on it
      const path = html.querySelector('path');
      path.dispatchEvent(new MouseEvent('mouseout'));
      fixture.detectChanges();

      await fixture.whenStable();

      expect(app.eventCalled).toHaveBeenCalledTimes(1);
    });
  });

  describe('ngOnChanges fn tests', () => {
    it('Should call updatePath and update all data but should not reload path in case path is not changed', () => {
      app.x = 5;
      app.y = 5;
      app.path = 'M 10 10 C 20 20, 40 20, 50 10';
      app.borderSize = 5;
      app.borderColor = '#111';
      app.fill = '#222';

      fixture.detectChanges();

      const path = html.querySelector('path');

      expect(path.getAttribute('d')).toEqual('M5 5C15 15 35 15 45 5 ');
      expect(path.getAttribute('stroke')).toEqual('#111111');
      expect(path.getAttribute('fill')).toEqual('#222222');
      expect(path.getAttribute('stroke-width')).toEqual('5');
      expect(path.getAttribute('class')).toEqual('black-border');

      app.fill = undefined;

      fixture.detectChanges();

      expect(path.getAttribute('fill')).toEqual('rgba(0, 0, 0, 0)');
    });

    describe('Should test class changes', () => {
      it('Should remove existing classes, if they were removed', () => {
        app.classes = [];

        fixture.detectChanges();

        const path = html.querySelector('path');
        expect(path.getAttribute('class')).toEqual('');
      });

      it('Should add new classes if previous classes stay and new ones are added', () => {
        app.classes = ['black-border', 'red-fill'];

        fixture.detectChanges();

        const path = html.querySelector('path');
        expect(path.getAttribute('class')).toEqual('black-border red-fill');
      });

      it('Should add new classes and remove previous classes if previous class is removed and new one is added', () => {
        app.classes = ['red-fill'];

        fixture.detectChanges();

        const path = html.querySelector('path');
        expect(path.getAttribute('class')).toEqual(' red-fill');
      });
    });
  });
});
