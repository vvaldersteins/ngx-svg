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
import { SvgImageDirective } from './svg-image.directive';

// Let's mock component that uses the directive
@Component({
  template: `
    <svg-container containerId="test-id">
      <svg-image [height]="height" [width]="width" [imageUrl]="imageUrl"
        [x]="x" [y]="y" [classes]="classes"
        (clickEvent)="eventCalled()"
        (doubleClickEvent)="eventCalled()"
        (mouseOverEvent)="eventCalled()"
        (mouseOutEvent)="eventCalled()"
        (onInitialize)="eventCalled()"
        *ngIf="createImage"></svg-image>
    </svg-container>
  `
})
class TestComponent implements OnInit {
  /**
   * Globally used parameters within the component.
   */
  public createImage = true;
  public imageUrl = 'https://vvaldersteins.github.io/ngx-svg/assets/dog.png';
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

describe('SVG Image Directive', () => {
  let app: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let html: HTMLElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [
        SvgContainerComponent,
        TestComponent,
        SvgImageDirective
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

  it('Should test that on destroying image, the image element is removed', () => {
    expect(html.querySelector('image')).not.toBeNull();

    fixture.destroy();

    expect(html.querySelector('image')).toBeNull();
  });

  describe('ngAfterViewChecked fn tests', () => {
    it('Should create the image element, if container exists, but image element does not exist yet', () => {
      app.createImage = false;

      fixture.detectChanges();

      expect(html.querySelectorAll('image').length).toEqual(0);

      app.createImage = true;

      fixture.detectChanges();

      expect(html.querySelectorAll('image').length).toEqual(1);
    });

    it('Should not create a new image element if data has been updated, but update the old one', () => {
      app.width = 15;

      fixture.detectChanges();

      expect(html.querySelectorAll('image').length).toEqual(1);
    });
  });

  describe('createImage fn tests', () => {
    it('Should set custom attributes on the image', () => {
      const image = html.querySelector('image');

      expect(image.getAttribute('x')).toEqual('0');
      expect(image.getAttribute('y')).toEqual('0');
      expect(image.getAttribute('width')).toEqual('10');
      expect(image.getAttribute('height')).toEqual('10');
      expect(image.getAttribute('href')).toEqual('https://vvaldersteins.github.io/ngx-svg/assets/dog.png');
      expect(image.getAttribute('class')).toEqual('black-border');
    });

    it('Should emit onInitialize on image creation', () => {
      spyOn(app, 'eventCalled');
      app.createImage = false;

      fixture.detectChanges();

      app.createImage = true;

      fixture.detectChanges();

      expect(app.eventCalled).toHaveBeenCalledTimes(1);
    });

    it('Should create click event handler', async() => {
      spyOn(app, 'eventCalled');

      expect(app.eventCalled).toHaveBeenCalledTimes(0);

      // Get image and click on it
      const image = html.querySelector('image');
      image.dispatchEvent(new MouseEvent('click'));
      fixture.detectChanges();

      expect(app.eventCalled).toHaveBeenCalledTimes(1);
    });

    it('Should create dblclick event handler', async() => {
      spyOn(app, 'eventCalled');

      expect(app.eventCalled).toHaveBeenCalledTimes(0);

      // Get image and double click on it
      const image = html.querySelector('image');
      image.dispatchEvent(new MouseEvent('dblclick'));
      fixture.detectChanges();

      await fixture.whenStable();

      expect(app.eventCalled).toHaveBeenCalledTimes(1);
    });

    it('Should create mouseover event handler', async() => {
      spyOn(app, 'eventCalled');

      expect(app.eventCalled).toHaveBeenCalledTimes(0);

      // Get image and mouse over on it
      const image = html.querySelector('image');
      image.dispatchEvent(new MouseEvent('mouseover'));
      fixture.detectChanges();

      await fixture.whenStable();

      expect(app.eventCalled).toHaveBeenCalledTimes(1);
    });

    it('Should create mouseout event handler', async() => {
      spyOn(app, 'eventCalled');

      expect(app.eventCalled).toHaveBeenCalledTimes(0);

      // Get image and mouse out on it
      const image = html.querySelector('image');
      image.dispatchEvent(new MouseEvent('mouseout'));
      fixture.detectChanges();

      await fixture.whenStable();

      expect(app.eventCalled).toHaveBeenCalledTimes(1);
    });
  });

  describe('ngOnChanges fn tests', () => {
    it('Should call updateImage and update all data but should not reload image in case image is not changed', () => {
      app.width = 5;
      app.height = 8;
      app.x = 3;
      app.y = 5;

      fixture.detectChanges();

      const image = html.querySelector('image');

      expect(image.getAttribute('x')).toEqual('3');
      expect(image.getAttribute('y')).toEqual('5');
      expect(image.getAttribute('width')).toEqual('5');
      expect(image.getAttribute('height')).toEqual('8');
      expect(image.getAttribute('href')).toEqual('https://vvaldersteins.github.io/ngx-svg/assets/dog.png');
      expect(image.getAttribute('class')).toEqual('black-border');

      app.y = 7;

      fixture.detectChanges();

      expect(image.getAttribute('x')).toEqual('3');
      expect(image.getAttribute('y')).toEqual('7');
      expect(image.getAttribute('width')).toEqual('5');
      expect(image.getAttribute('height')).toEqual('8');
      expect(image.getAttribute('href')).toEqual('https://vvaldersteins.github.io/ngx-svg/assets/dog.png');
      expect(image.getAttribute('class')).toEqual('black-border');

      app.height = 10;

      fixture.detectChanges();

      expect(image.getAttribute('x')).toEqual('3');
      expect(image.getAttribute('y')).toEqual('7');
      expect(image.getAttribute('width')).toEqual('5');
      expect(image.getAttribute('height')).toEqual('10');
      expect(image.getAttribute('href')).toEqual('https://vvaldersteins.github.io/ngx-svg/assets/dog.png');
      expect(image.getAttribute('class')).toEqual('black-border');
    });

    it('Should call updateImage and update all data and should reload image in case image is changed', () => {
      app.width = 5;
      app.height = 8;
      app.x = 14;
      app.y = 9;
      app.imageUrl = 'https://vvaldersteins.github.io';

      fixture.detectChanges();

      const image = html.querySelector('image');

      expect(image.getAttribute('x')).toEqual('14');
      expect(image.getAttribute('y')).toEqual('9');
      expect(image.getAttribute('width')).toEqual('5');
      expect(image.getAttribute('height')).toEqual('8');
      expect(image.getAttribute('href')).toEqual('https://vvaldersteins.github.io');
      expect(image.getAttribute('class')).toEqual('black-border');
    });

    describe('Should test class changes', () => {
      it('Should remove existing classes, if they were removed', () => {
        app.classes = [];

        fixture.detectChanges();

        const image = html.querySelector('image');
        expect(image.getAttribute('class')).toEqual('');
      });

      it('Should add new classes if previous classes stay and new ones are added', () => {
        app.classes = ['black-border', 'red-fill'];

        fixture.detectChanges();

        const image = html.querySelector('image');
        expect(image.getAttribute('class')).toEqual('black-border red-fill');
      });

      it('Should add new classes and remove previous classes if previous class is removed and new one is added', () => {
        app.classes = ['red-fill'];

        fixture.detectChanges();

        const image = html.querySelector('image');
        expect(image.getAttribute('class')).toEqual(' red-fill');
      });
    });
  });
});
