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
import { SvgTextDirective } from './svg-text.directive';

// Let's mock component that uses the directive
@Component({
  template: `
    <svg-container containerId="test-id">
      <svg-text [size]="size" [text]="text" [color]="color"
        [x]="x" [y]="y" [classes]="classes"
        (clickEvent)="eventCalled()"
        (doubleClickEvent)="eventCalled()"
        (mouseOverEvent)="eventCalled()"
        (mouseOutEvent)="eventCalled()"
        *ngIf="createText"></svg-text>
    </svg-container>
  `
})
class TestComponent implements OnInit {
  /**
   * Globally used parameters within the component.
   */
  public createText = true;
  public color = '#000';
  public size = 10;
  public text = 'Test text';
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

describe('SVG Text Directive', () => {
  let app: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let html: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [
        SvgContainerComponent,
        TestComponent,
        SvgTextDirective
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

  it('Should test that on destroying text, the text element is removed', () => {
    expect(html.querySelector('text')).not.toBeNull();

    fixture.destroy();

    expect(html.querySelector('text')).toBeNull();
  });

  describe('ngAfterViewChecked fn tests', () => {
    it('Should create the text element, if container exists, but text element does not exist yet', () => {
      app.createText = false;

      fixture.detectChanges();

      expect(html.querySelectorAll('text').length).toEqual(0);

      app.createText = true;

      fixture.detectChanges();

      expect(html.querySelectorAll('text').length).toEqual(1);
    });

    it('Should not create a new text element if data has been updated, but update the old one', () => {
      app.color = '#111';

      fixture.detectChanges();

      expect(html.querySelectorAll('text').length).toEqual(1);
    });
  });

  describe('createText fn tests', () => {
    it('Should set custom attributes on the text', () => {
      const text = html.querySelector('text');

      expect(text.getAttribute('x')).toEqual('0');
      expect(text.getAttribute('y')).toEqual('-4');
      expect(text.getAttribute('font-size')).toEqual('10');
      expect(text.getAttribute('fill')).toEqual('#000000');
      expect(text.getAttribute('class')).toEqual('black-border');
      expect(text.querySelector('tspan').getAttribute('x')).toEqual('0');
      expect(text.querySelector('tspan').getAttribute('dy')).toEqual('13');
      expect(text.querySelector('tspan').textContent).toEqual('Test text');
    });

    it('Should create click event handler', async() => {
      spyOn(app, 'eventCalled');

      expect(app.eventCalled).toHaveBeenCalledTimes(0);

      // Get text and click on it
      const text = html.querySelector('text');
      text.dispatchEvent(new MouseEvent('click'));
      fixture.detectChanges();

      expect(app.eventCalled).toHaveBeenCalledTimes(1);
    });

    it('Should create dblclick event handler', async() => {
      spyOn(app, 'eventCalled');

      expect(app.eventCalled).toHaveBeenCalledTimes(0);

      // Get text and double click on it
      const text = html.querySelector('text');
      text.dispatchEvent(new MouseEvent('dblclick'));
      fixture.detectChanges();

      await fixture.whenStable();

      expect(app.eventCalled).toHaveBeenCalledTimes(1);
    });

    it('Should create mouseover event handler', async() => {
      spyOn(app, 'eventCalled');

      expect(app.eventCalled).toHaveBeenCalledTimes(0);

      // Get text and mouse over on it
      const text = html.querySelector('text');
      text.dispatchEvent(new MouseEvent('mouseover'));
      fixture.detectChanges();

      await fixture.whenStable();

      expect(app.eventCalled).toHaveBeenCalledTimes(1);
    });

    it('Should create mouseout event handler', async() => {
      spyOn(app, 'eventCalled');

      expect(app.eventCalled).toHaveBeenCalledTimes(0);

      // Get text and mouse out on it
      const text = html.querySelector('text');
      text.dispatchEvent(new MouseEvent('mouseout'));
      fixture.detectChanges();

      await fixture.whenStable();

      expect(app.eventCalled).toHaveBeenCalledTimes(1);
    });
  });

  describe('ngOnChanges fn tests', () => {
    it('Should call updateText and update all data', () => {
      app.size = 15;
      app.text = 'Custom text';
      app.x = 2;
      app.y = 2;
      app.color = '#111';

      fixture.detectChanges();

      const text = html.querySelector('text');

      expect(text.getAttribute('font-size')).toEqual('15');
      expect(text.getAttribute('x')).toEqual('2');
      expect(text.getAttribute('y')).toEqual('-3.5');
      expect(text.getAttribute('fill')).toEqual('#111111');
      expect(text.getAttribute('class')).toEqual('black-border');
      expect(text.querySelector('tspan').getAttribute('x')).toEqual('2');
      expect(text.querySelector('tspan').getAttribute('dy')).toEqual('19.5');
      expect(text.querySelector('tspan').textContent).toEqual('Custom text');
    });

    describe('Should test class changes', () => {
      it('Should remove existing classes, if they were removed', () => {
        app.classes = [];

        fixture.detectChanges();

        const text = html.querySelector('text');
        expect(text.getAttribute('class')).toEqual('');
      });

      it('Should add new classes if previous classes stay and new ones are added', () => {
        app.classes = ['black-border', 'red-fill'];

        fixture.detectChanges();

        const text = html.querySelector('text');
        expect(text.getAttribute('class')).toEqual('black-border red-fill');
      });

      it('Should add new classes and remove previous classes if previous class is removed and new one is added', () => {
        app.classes = ['red-fill'];

        fixture.detectChanges();

        const text = html.querySelector('text');
        expect(text.getAttribute('class')).toEqual(' red-fill');
      });
    });
  });
});
