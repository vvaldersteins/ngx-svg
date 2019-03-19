<a href="https://github.com/vvaldersteins/ngx-svg">
  <h1 align="center">ngx-svg</h1>
</a>

<p align="center">Create powerful SVG objects with <a href="https://angular.io">Angular</a>. Based on <a href="http://svgjs.com">svg.js</a> library.</p>

## Table of Contents
1. [Getting Started](#getting-started)
2. [Installation](#installation)
3. [Container](#container)
4. [Elements](#elements)
5. [Demo](#demo)
6. [Troubleshooting](#troubleshooting)
7. [License](#license)

# Getting Started

ngx-svg contains all core svg.js components, so you won't need to include any other external dependencies.

# Installation

Install `ngx-svg` from `npm` using the folowing command line -

```bash
npm install ngx-svg --save
```

This will install latest version of the ngx-svg.

After you have done that, you have to include the component in your module by importing it using the following command -

```
import { NgxSvgModule } from 'ngx-svg';
```

and adding to to the imports of your module -

```

@NgModule({
  declarations: [
    ...
  ],
  imports: [
    ...
    NgxSvgModule
  ],
  providers: [..],
  bootstrap: [...]
})
export class AppModule { }

```

# Container

To start using the ngx-svg you must declare a container object in your view, by using the following element -

```
<svg-container containerId="svg-element">
  ...
</svg-container>

```

Below are explanation of input and output parameters:

```
containerId: Unique id for the svg container. Will be used for drawing the svg container. (MANDATORY)
height: Height of the svg container. (OPTIONAL, Defaults to 200)
showGrid: Indicator if grid image should be shown in the background of svg container. (OPTIONAL, Defaults to false)
hoverable: Indicator if user should be able to see dot on hover, to capture coordinates. (OPTIONAL, Defaults to false)
clickEvent: Is fired when click event happens on the hovered point element. Must have hoverable option enabled. (OUTPUT PARAMETER)
```

# Elements

You can enter as many svg elements as you want per one container. See below the information about the configuration of these elements.

## Line

To add a line element to the svg-container, you must add the following element inside `svg-container` -

```
  <svg-line></svg-line> 
```

You can provide following parameters for the element

```
  borderSize: Numeric value with size of the border. (MANDATORY)
  borderColor: Color of the border. (OPTIONAL, Defaults to '#000')
  x0: Starting point on x axis. (OPTIONAL, Defaults to 0)
  y0: Starting point on y axis. (OPTIONAL, Defaults to 0)
  x1: Ending point on x axis. (OPTIONAL, Defaults to 1)
  y1: Ending point on y axis (OPTIONAL, Defaults to 1)
```

## Rectangular

To add a rectangular element to the svg-container, you must add the following element inside `svg-container` -

```
  <svg-rect></svg-rect> 
```

You can provide following parameters for the element

```
  height: Height of the rectangular. (MANDATORY)
  width: Width of the rectangular. (MANDATORY)
  color: Background color of the rectangular. (OPTIONAL, Defaults to '#000')
  x: Starting point on x axis. (OPTIONAL, Defaults to 0)
  y: Starting point on y axis. (OPTIONAL, Defaults to 0)
```

## Circle

To add a circle element to the svg-container, you must add the following element inside `svg-container` -

```
  <svg-circle></svg-circle> 
```

You can provide following parameters for the element

```
  radius: Radius of the circle. (MANDATORY)
  color: Background color of the circle. (OPTIONAL, Defaults to '#000')
  x: Starting point on x axis. (OPTIONAL, Defaults to 0)
  y: Starting point on y axis. (OPTIONAL, Defaults to 0)
```

## Ellipse

To add an ellipse element to the svg-container, you must add the following element inside `svg-container` -

```
  <svg-ellipse></svg-ellipse> 
```

You can provide following parameters for the element

```
  height: Height of the ellipse. (MANDATORY)
  width: Width of the ellipse. (MANDATORY)
  color: Background color of the ellipse. (OPTIONAL, Defaults to '#000')
  x: Starting point on x axis. (OPTIONAL, Defaults to 0)
  y: Starting point on y axis. (OPTIONAL, Defaults to 0)
```

## Polyline

To add a polyline element to the svg-container, you must add the following element inside `svg-container` -

```
  <svg-polyline></svg-polyline> 
```

You can provide following parameters for the element

```
  points: Array with an array of x,y points. E.g. [[0, 50], [50, 100], [100, 50], [50, 0], [0, 50]]. (MANDATORY)
  borderSize: Size of the border for the polyline. (MANDATORY)
  borderColor: Border color of the polyline. (OPTIONAL, Defaults to '#000')
  fill: Background color of the polyline. (OPTIONAL, Defaults to '#000')
```

## Polygon

To add a polygon element to the svg-container, you must add the following element inside `svg-container` -

```
  <svg-polygon></svg-polygon> 
```

You can provide following parameters for the element

```
  points: Array with an array of x,y points. E.g. [[0, 50], [50, 100], [100, 50], [50, 0]]. (MANDATORY)
  borderSize: Size of the border for the polygon. (MANDATORY)
  borderColor: Border color of the polygon. (OPTIONAL, Defaults to '#000')
  fill: Background color of the polygon. (OPTIONAL, Defaults to '#000')
```

## Events

Each of the above elements has a list of events that are available to be attached.

```
  clickEvent: Is fired when click event happens on the element.
  doubleClickEvent: Is fired when double click event happens on the element.
  mouseOverElement: Is fired when mouse is moved over the element.
  mouseOutElement: Is fired when mouse is moved out of the element.
```

Each of the events returns an instance of `MouseEvent`.

# Demo

You can view demo via this [link](https://vvaldersteins.github.io/ngx-svg/), and browse the code [here](https://github.com/vvaldersteins/ngx-svg/tree/master/src/demo).

# Troubleshooting

In case of any questions or issues, please open a [new question / issue](https://github.com/vvaldersteins/ngx-svg/issues).

# License

ngx-svg is developed under MIT license.
