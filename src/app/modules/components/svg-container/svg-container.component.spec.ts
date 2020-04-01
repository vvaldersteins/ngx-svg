/**
 * Import Angular libraries.
 */
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';

/**
 * Import custom components.
 */
import { SvgContainerComponent } from './svg-container.component';

describe('SVG Container Component', () => {
  let app: SvgContainerComponent;
  let fixture: ComponentFixture<SvgContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [
        SvgContainerComponent
      ]
    }).compileComponents();

    // Let's assign variables
    fixture = TestBed.createComponent(SvgContainerComponent);
    app = fixture.componentInstance;
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

    /**
     * =============
     * =============
     * =============
     * =============
     * =============
     * TODO: Finalize this test
     * =============
     * =============
     * =============
     * =============
     * =============
     */
    describe('hoverable and pointSize parameter change tests', () => {
      it('Should update HTML view with .svg-hover-point element if hoverable value changes to true', () => {
        app.containerId = 'test-id';
        app.hoverable = false;
        fixture.detectChanges();
        const changes = {
          hoverable: new SimpleChange(false, true, true)
        };

        app.ngOnChanges(changes);
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
});
