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

Below are explanation of import and output variables:

```
containerId: Unique id for the svg container. Will be used for drawing the svg container. (MANDATORY)
```

# Elements

## Line

## Rectangular

## Circle

## Ellipsis

## Polyline

## Polygon

# Demo

You can view demo via this link, and browse the code here.

# Troubleshooting

In case of any questions or issues, please open a [new question / issue](https://github.com/vvaldersteins/ngx-svg/issues).

# License

ngx-svg is developed under MIT license.