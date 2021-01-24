/**
 * Import Angular libraries.
 */
import { TestBed, ComponentFixture, tick, fakeAsync, waitForAsync } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';

/**
 * Import custom components.
 */
import { SvgContainerComponent } from './svg-container.component';

describe('SVG Container Component', () => {
  let app: SvgContainerComponent;
  let fixture: ComponentFixture<SvgContainerComponent>;
  let html: HTMLElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [
        SvgContainerComponent
      ]
    }).compileComponents();

    // Let's assign variables
    fixture = TestBed.createComponent(SvgContainerComponent);
    app = fixture.componentInstance;
    html = fixture.nativeElement;
  }));

  it('Should create SVG Container component instance', () => {
    expect(app).toBeTruthy();
  });

  describe('ngOnChanges fn tests', () => {
    describe('viewBox input parameter change tests', () => {
      it('Should update viewBox input property if it is changed', () => {
        app.containerId = 'test-id';
        fixture.detectChanges();
        const changes = {
          viewBox: new SimpleChange(undefined, [10, 10, 500, 600], true)
        };

        app.ngOnChanges(changes);

        expect(app.viewBox).toEqual([10, 10, 500, 600]);
      });

      it('Should assign correct viewBox value to the new one', () => {
        app.containerId = 'test-id';
        fixture.detectChanges();
        const changes = {
          viewBox: new SimpleChange(undefined, [10, 10, 500, 600], true)
        };

        app.ngOnChanges(changes);

        const container = app.getContainer();

        expect(container).toBeDefined();
        expect(container.attr().viewBox).toEqual('10 10 500 600');
      });

      it('Should remove viewBox value in case it has less values than 4', () => {
        app.containerId = 'test-id';
        fixture.detectChanges();
        const changes = {
          viewBox: new SimpleChange([10, 10, 500, 600], [10, 10, 500], false)
        };

        app.ngOnChanges(changes);

        const container = app.getContainer();

        expect(container).toBeDefined();
        expect(container.attr().viewBox).toBeUndefined();
      });
    });

    describe('height input parameter change tests', () => {
      it('Should update height input parameter', () => {
        app.containerId = 'test-id';
        fixture.detectChanges();
        const changes = {
          height: new SimpleChange(200, 100, true)
        };

        app.ngOnChanges(changes);

        expect(app.height).toEqual(100);
      });

      it('Should set correct size of the svg container', () => {
        app.containerId = 'test-id';
        fixture.detectChanges();
        const changes = {
          height: new SimpleChange(200, 100, true)
        };

        app.ngOnChanges(changes);

        const container = app.getContainer();

        expect(container).toBeDefined();
        expect(container.attr().width).toEqual('100%');
        expect(container.attr().height).toEqual(100);
      });
    });

    describe('showGrid and grid parameter change tests', () => {
      it('Should not set grid parameters if we have set the showGrid to false', () => {
        app.containerId = 'test-id';
        fixture.detectChanges();
        const changes = {
          showGrid: new SimpleChange(true, false, false)
        };

        app.ngOnChanges(changes);

        const container = app.getContainer();

        expect(container).toBeDefined();
        expect(container.children().length).toEqual(0);
      });

      describe('Default grid property tests', () => {
        beforeEach(() => {
          app.containerId = 'test-id';
          fixture.detectChanges();
          const changes = {
            showGrid: new SimpleChange(false, true, true)
          };

          app.ngOnChanges(changes);
        });

        it('Should set pattern if we have set the showGrid to true', () => {
          const container = app.getContainer();

          expect(container).toBeDefined();
          expect(container.children().length).toEqual(2);

          // Let's get the pattern
          const pattern = container.children()[0].children()[0];

          // Let's check the pattern properties
          expect(pattern).toBeDefined();
          expect(pattern.attr().width).toEqual(10);
          expect(pattern.attr().height).toEqual(10);

          // Let's retrieve the pattern block element
          const patternBlock = pattern.children()[0];

          // Let's check the pattern block properties
          expect(patternBlock).toBeDefined();
          expect(patternBlock.attr().width).toEqual(10);
          expect(patternBlock.attr().height).toEqual(10);
          expect(patternBlock.attr().fill).toEqual('transparent');
          expect(patternBlock.attr().stroke).toEqual('black');
        });

        it('Should create a custom grid element and add it to the svg container', () => {
          const container = app.getContainer();

          expect(container).toBeDefined();
          expect(container.children().length).toEqual(2);

          // Let's get the grid
          const grid = container.children()[1];

          // Let's get the pattern id
          const patternId = container.children()[0].children()[0].id();

          expect(grid).toBeDefined();
          expect(grid.attr().width).toEqual('100%');
          expect(grid.attr().height).toEqual('100%');
          expect(grid.attr().fill).toEqual(`url(#${patternId})`);
        });
      });

      describe('Custom grid property tests', () => {
        beforeEach(() => {
          app.containerId = 'test-id';
          app.showGrid = true;
          fixture.detectChanges();
          const changes = {
            grid: new SimpleChange(
              { width: 10, height: 10, strokeColor: 'black' },
              { width: 30, height: 20, strokeColor: 'red' },
              true
            )
          };

          app.ngOnChanges(changes);
        });

        it('Should set pattern if we have set the showGrid to true', () => {
          const container = app.getContainer();

          expect(container).toBeDefined();
          expect(container.children().length).toEqual(2);

          // Let's get the pattern
          const pattern = container.children()[0].children()[0];

          // Let's check the pattern properties
          expect(pattern).toBeDefined();
          expect(pattern.attr().width).toEqual(30);
          expect(pattern.attr().height).toEqual(20);

          // Let's retrieve the pattern block element
          const patternBlock = pattern.children()[0];

          // Let's check the pattern block properties
          expect(patternBlock).toBeDefined();
          expect(patternBlock.attr().width).toEqual(30);
          expect(patternBlock.attr().height).toEqual(20);
          expect(patternBlock.attr().fill).toEqual('transparent');
          expect(patternBlock.attr().stroke).toEqual('red');
        });

        it('Should create a custom grid element and add it to the svg container', () => {
          const container = app.getContainer();

          expect(container).toBeDefined();
          expect(container.children().length).toEqual(2);

          // Let's get the grid
          const grid = container.children()[1];

          // Let's get the pattern id
          const patternId = container.children()[0].children()[0].id();

          expect(grid).toBeDefined();
          expect(grid.attr().width).toEqual('100%');
          expect(grid.attr().height).toEqual('100%');
          expect(grid.attr().fill).toEqual(`url(#${patternId})`);
        });
      });
    });

    describe('hoverable and pointSize parameter change tests', () => {
      it('Should update visibility of .svg-hover-point element if hoverable value changes from false to true', () => {
        app.containerId = 'test-id';
        app.hoverable = false;
        fixture.detectChanges();

        // Let's retrieve svg hover point element
        let svgHoverPoint = html.querySelector('.svg-hover-point');

        // Initially element should be invisible
        expect(svgHoverPoint).toBeNull();

        const changes = {
          hoverable: new SimpleChange(false, true, true)
        };

        app.ngOnChanges(changes);

        // Let's retrieve container
        const container = html.querySelector('#test-id');
        container.dispatchEvent(new MouseEvent('mouseenter'));
        fixture.detectChanges();

        svgHoverPoint = html.querySelector('.svg-hover-point');

        // Now element should be visible, since we changed the hoverable
        expect(svgHoverPoint).not.toBeNull();
      });

      it('Should have the default width and height for the point size in case it is not changed', () => {
        app.containerId = 'test-id';
        app.hoverable = false;
        app.mouseInContainer = true;
        fixture.detectChanges();

        const changes = {
          hoverable: new SimpleChange(false, true, true)
        };

        app.ngOnChanges(changes);

        // Let's retrieve container
        const container = html.querySelector('#test-id');
        container.dispatchEvent(new MouseEvent('mouseenter'));
        fixture.detectChanges();

        // Let's retrieve svg hover point element
        const svgHoverPoint = html.querySelector('.svg-hover-point');

        // Now element should be visible, since we changed the hoverable
        expect(svgHoverPoint).not.toBeNull();
        expect(getComputedStyle(svgHoverPoint).getPropertyValue('width')).toEqual('10px');
        expect(getComputedStyle(svgHoverPoint).getPropertyValue('height')).toEqual('10px');
      });

      it('Should have the custom width and height for the point size in case it is changed', () => {
        app.containerId = 'test-id';
        app.hoverable = true;
        app.mouseInContainer = true;
        fixture.detectChanges();

        const changes = {
          pointSize: new SimpleChange(10, 20, true)
        };

        app.ngOnChanges(changes);

        // Let's retrieve container
        const container = html.querySelector('#test-id');
        container.dispatchEvent(new MouseEvent('mouseenter'));
        fixture.detectChanges();

        // Let's retrieve svg hover point element
        const svgHoverPoint = html.querySelector('.svg-hover-point');

        // Now element should be visible, since we changed the hoverable
        expect(svgHoverPoint).not.toBeNull();
        expect(getComputedStyle(svgHoverPoint).getPropertyValue('width')).toEqual('20px');
        expect(getComputedStyle(svgHoverPoint).getPropertyValue('height')).toEqual('20px');
      });

      it('Should not update visibility of .svg-hover-point element if hoverable value changes from false to true but mouse is not within the container', () => {
        app.containerId = 'test-id';
        app.hoverable = false;
        fixture.detectChanges();

        // Let's retrieve svg hover point element
        let svgHoverPoint = html.querySelector('.svg-hover-point');

        // Initially element should be invisible
        expect(svgHoverPoint).toBeNull();

        const changes = {
          hoverable: new SimpleChange(false, true, true)
        };

        app.ngOnChanges(changes);

        fixture.detectChanges();

        svgHoverPoint = html.querySelector('.svg-hover-point');

        // Element still should not be visible, since mouse is not within the container
        expect(svgHoverPoint).toBeNull();
      });
    });
  });

  describe('ngAfterViewInit fn tests', () => {
    it('Should set correct svg properties if viewBox is not specified', () => {
      app.containerId = 'test-id';
      app.height = 200;
      fixture.detectChanges();

      const container = app.getContainer();

      expect(container).toBeDefined();
      expect(container.parent().id()).toEqual('test-id');
      expect(container.attr().width).toEqual('100%');
      expect(container.attr().height).toEqual(200);
      expect(container.attr().viewBox).toBeUndefined();
    });

    it('Should set correct svg properties if viewBox is specified', () => {
      app.containerId = 'test-id';
      app.height = 200;
      app.viewBox = [10, 10, 500, 600];
      fixture.detectChanges();

      const container = app.getContainer();

      expect(container).toBeDefined();
      expect(container.parent().id()).toEqual('test-id');
      expect(container.attr().width).toEqual('100%');
      expect(container.attr().height).toEqual(200);
      expect(container.attr().viewBox).toEqual('10 10 500 600');
    });
    
    it('Should call onInitialize event emitter and return created svg element', () => {
      spyOn(app.onInitialize, 'emit');
      app.containerId = 'test-id';
      app.height = 200;
      app.viewBox = [10, 10, 500, 600];
      fixture.detectChanges();

      const container = app.getContainer();
      
      expect(app.onInitialize.emit).toHaveBeenCalledTimes(1);
      expect(app.onInitialize.emit).toHaveBeenCalledWith(container);
    });

    describe('Should test setGridPattern outcome', () => {
      it('Should not set grid parameters if we have set the showGrid to false', () => {
        app.containerId = 'test-id';
        app.height = 200;
        app.viewBox = [10, 10, 500, 600];
        app.showGrid = false;
        fixture.detectChanges();

        const container = app.getContainer();

        expect(container).toBeDefined();
        expect(container.children().length).toEqual(0);
      });

      describe('Default grid property tests', () => {
        beforeEach(() => {
          app.containerId = 'test-id';
          app.height = 200;
          app.viewBox = [10, 10, 500, 600];
          app.showGrid = true;
          fixture.detectChanges();
        });

        it('Should set pattern if we have set the showGrid to true', () => {
          const container = app.getContainer();

          expect(container).toBeDefined();
          expect(container.children().length).toEqual(2);

          // Let's get the pattern
          const pattern = container.children()[0].children()[0];

          // Let's check the pattern properties
          expect(pattern).toBeDefined();
          expect(pattern.attr().width).toEqual(10);
          expect(pattern.attr().height).toEqual(10);

          // Let's retrieve the pattern block element
          const patternBlock = pattern.children()[0];

          // Let's check the pattern block properties
          expect(patternBlock).toBeDefined();
          expect(patternBlock.attr().width).toEqual(10);
          expect(patternBlock.attr().height).toEqual(10);
          expect(patternBlock.attr().fill).toEqual('transparent');
          expect(patternBlock.attr().stroke).toEqual('black');
        });

        it('Should create a custom grid element and add it to the svg container', () => {
          const container = app.getContainer();

          expect(container).toBeDefined();
          expect(container.children().length).toEqual(2);

          // Let's get the grid
          const grid = container.children()[1];

          // Let's get the pattern id
          const patternId = container.children()[0].children()[0].id();

          expect(grid).toBeDefined();
          expect(grid.attr().width).toEqual('100%');
          expect(grid.attr().height).toEqual('100%');
          expect(grid.attr().fill).toEqual(`url(#${patternId})`);
        });
      });

      describe('Custom grid property tests', () => {
        beforeEach(() => {
          app.containerId = 'test-id';
          app.height = 200;
          app.viewBox = [10, 10, 500, 600];
          app.showGrid = true;
          app.grid = {
            height: 20,
            width: 30,
            strokeColor: 'red'
          };
          fixture.detectChanges();
        });

        it('Should set pattern if we have set the showGrid to true', () => {
          const container = app.getContainer();

          expect(container).toBeDefined();
          expect(container.children().length).toEqual(2);

          // Let's get the pattern
          const pattern = container.children()[0].children()[0];

          // Let's check the pattern properties
          expect(pattern).toBeDefined();
          expect(pattern.attr().width).toEqual(30);
          expect(pattern.attr().height).toEqual(20);

          // Let's retrieve the pattern block element
          const patternBlock = pattern.children()[0];

          // Let's check the pattern block properties
          expect(patternBlock).toBeDefined();
          expect(patternBlock.attr().width).toEqual(30);
          expect(patternBlock.attr().height).toEqual(20);
          expect(patternBlock.attr().fill).toEqual('transparent');
          expect(patternBlock.attr().stroke).toEqual('red');
        });

        it('Should create a custom grid element and add it to the svg container', () => {
          const container = app.getContainer();

          expect(container).toBeDefined();
          expect(container.children().length).toEqual(2);

          // Let's get the grid
          const grid = container.children()[1];

          // Let's get the pattern id
          const patternId = container.children()[0].children()[0].id();

          expect(grid).toBeDefined();
          expect(grid.attr().width).toEqual('100%');
          expect(grid.attr().height).toEqual('100%');
          expect(grid.attr().fill).toEqual(`url(#${patternId})`);
        });
      });
    });
  });

  describe('Container mouse enter and leave event tests', () => {
    it('Should set mouseInContainer to true and emit mouseOverEvent on mouse enter on the container', () => {
      app.containerId = 'test-id';
      app.mouseInContainer = false;
      spyOn(app.mouseOverEvent, 'emit');
      fixture.detectChanges();

      // Let's retrieve container
      const container = html.querySelector('#test-id');
      container.dispatchEvent(new MouseEvent('mouseenter'));
      fixture.detectChanges();

      expect(app.mouseInContainer).toBeTruthy();
      expect(app.mouseOverEvent.emit).toHaveBeenCalledTimes(1);
      expect(app.mouseOverEvent.emit).toHaveBeenCalledWith(new MouseEvent('mouseenter'));
    });

    it('Should set mouseInContainer to false and emit mouseOutEvent on mouse out of the container', () => {
      app.containerId = 'test-id';
      app.mouseInContainer = true;
      spyOn(app.mouseOutEvent, 'emit');
      fixture.detectChanges();

      // Let's retrieve container
      const container = html.querySelector('#test-id');
      container.dispatchEvent(new MouseEvent('mouseleave'));
      fixture.detectChanges();

      expect(app.mouseInContainer).toBeFalsy();
      expect(app.mouseOutEvent.emit).toHaveBeenCalledTimes(1);
      expect(app.mouseOutEvent.emit).toHaveBeenCalledWith(new MouseEvent('mouseleave'));
    });

    it('Should call adjustPointPosition and adjustMouseMovePosition fn on mouse move', () => {
      app.containerId = 'test-id';
      app.mouseInContainer = false;
      spyOn(app, 'adjustPointPosition');
      spyOn(app, 'adjustMouseMovePosition');
      fixture.detectChanges();

      // Let's retrieve container
      const container = html.querySelector('#test-id');
      container.dispatchEvent(new MouseEvent('mousemove'));
      fixture.detectChanges();

      expect(app.mouseInContainer).toBeTruthy();
      expect(app.adjustPointPosition).toHaveBeenCalledTimes(1);
      expect(app.adjustPointPosition).toHaveBeenCalledWith(new MouseEvent('mousemove'));
      expect(app.adjustMouseMovePosition).toHaveBeenCalledTimes(1);
      expect(app.adjustMouseMovePosition).toHaveBeenCalledWith(new MouseEvent('mousemove'));
    });
  });

  it('Should test that _triggerCoordinateChange is set to false on onPointHover fn', () => {
    app.containerId = 'test-id';
    app.hoverable = true;
    app.pointXCoordinate = 10;
    app.pointYCoordinate = 10;
    fixture.detectChanges();

    spyOn(app.mouseMoveEvent, 'emit');

    app.adjustPointPosition(new MouseEvent('mousemove'));

    // Let's simulate point hover
    app.onPointHover();

    // Let's simulate adjust mouse move position
    app.adjustMouseMovePosition(new MouseEvent('mousemove'));

    expect(app.mouseMoveEvent.emit).toHaveBeenCalledTimes(0);
  });

  describe('adjustPointPosition fn tests', () => {
    it('Should not set point x and y coordinates and triggerCoordinateChange should remain false in case hoverable is false', () => {
      app.containerId = 'test-id';
      app.hoverable = false;
      spyOn(app.mouseMoveEvent, 'emit');
      fixture.detectChanges();

      app.adjustPointPosition(new MouseEvent('mousemove'));

      app.adjustMouseMovePosition(new MouseEvent('mousemove'));

      // Let's check if point x and y coordinates have been set
      // They shouldn't be
      expect(app.pointXCoordinate).toBeUndefined();
      expect(app.pointYCoordinate).toBeUndefined();

      // It should call mouseMoveEvent with event variables (_triggerCoordinateChange should be set to false)
      expect(app.mouseMoveEvent.emit).toHaveBeenCalledTimes(1);
      expect(app.mouseMoveEvent.emit).toHaveBeenCalledWith({
        x: 0,
        y: 0
      });
    });

    it('Should set point x and y coordinates and triggerCoordinateChange should be changed in case hoverable is true', () => {
      app.containerId = 'test-id';
      app.hoverable = true;
      spyOn(app.mouseMoveEvent, 'emit');
      fixture.detectChanges();

      app.adjustPointPosition(new MouseEvent('mousemove'));

      app.adjustPointPosition(new MouseEvent('mousemove'));

      app.adjustMouseMovePosition(new MouseEvent('mousemove'));

      // Let's check if point x and y coordinates have been set
      // They shouldn't be
      expect(app.pointXCoordinate).toEqual(-5);
      expect(app.pointYCoordinate).toEqual(-5);

      // It should call mouseMoveEvent with event variables (_triggerCoordinateChange should be set to false)
      expect(app.mouseMoveEvent.emit).toHaveBeenCalledTimes(1);
      expect(app.mouseMoveEvent.emit).toHaveBeenCalledWith({
        x: 0,
        y: 0
      });
    });
  });

  it('Should emit doubleClickEvent and set _singleClickHappened to false on onPointDoubleClick', fakeAsync(() => {
    app.pointXCoordinate = 10;
    app.pointYCoordinate = 10;
    app.containerId = 'test-id';
    fixture.detectChanges();
    spyOn(app.doubleClickEvent, 'emit');
    spyOn(app.clickEvent, 'emit');

    app.onPointClick();
    app.onPointDoubleClick();
    tick(300);

    expect(app.doubleClickEvent.emit).toHaveBeenCalledTimes(1);
    expect(app.doubleClickEvent.emit).toHaveBeenCalledWith({
      x: 15,
      y: 15
    });
    expect(app.clickEvent.emit).toHaveBeenCalledTimes(0);
  }));

  it('Should emit clickEvent and set _singleClickHappened to true on onPointClick', fakeAsync(() => {
    app.pointXCoordinate = 10;
    app.pointYCoordinate = 10;
    app.containerId = 'test-id';
    fixture.detectChanges();
    spyOn(app.clickEvent, 'emit');

    app.onPointClick();
    tick(300);

    expect(app.clickEvent.emit).toHaveBeenCalledTimes(1);
    expect(app.clickEvent.emit).toHaveBeenCalledWith({
      x: 15,
      y: 15
    });
  }));
});
