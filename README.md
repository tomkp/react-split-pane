# React Split Pane

Split-Pane component built with [React](http://facebook.github.io/react), can be split vertically or horizontally.

Check out the [demo](http://zonked-knife.surge.sh/)


```html
   <SplitPane split="vertical" minSize="50">
       <div></div>
       <div></div>
   </SplitPane>
```

```html
    <SplitPane split="vertical" minSize="50">
        <div></div>
        <SplitPane split="horizontal">
            <div></div>
            <div></div>
        </SplitPane>
    </SplitPane>
```

### Example styling

This gives a single pixel wide divider, but with a 'grabbable' surface of 11 pixels.

Thanks to ```background-clip: padding-box;``` for making transparent borders possible.


```css
    .Resizer {
        background: #000;
        opacity: .2;
        z-index: 1;
        -moz-background-clip: padding;
        -webkit-background-clip: padding;
        background-clip: padding-box;
    }

     .Resizer:hover {
        -webkit-transition: all 2s ease;
        transition: all 2s ease;
    }

     .Resizer.horizontal {
        height: 11px;
        margin: -5px 0;
        border-top: 5px solid rgba(255, 255, 255, 0);
        border-bottom: 5px solid rgba(255, 255, 255, 0);
        cursor: row-resize;
        width: 100%;
    }

    .Resizer.horizontal:hover {
        border-top: 5px solid rgba(0, 0, 0, 0.5);
        border-bottom: 5px solid rgba(0, 0, 0, 0.5);
    }

    .Resizer.vertical {
        width: 11px;
        margin: 0 -5px;
        border-left: 5px solid rgba(255, 255, 255, 0);
        border-right: 5px solid rgba(255, 255, 255, 0);
        cursor: col-resize;
        height: 100%;
    }

    .Resizer.vertical:hover {
        border-left: 5px solid rgba(0, 0, 0, 0.5);
        border-right: 5px solid rgba(0, 0, 0, 0.5);
    }
 ```

***

[![Build Status](https://img.shields.io/travis/tomkp/react-split-pane/master.svg?style=flat-square)](https://travis-ci.org/tomkp/react-split-pane)
[![Coverage Status](https://img.shields.io/coveralls/tomkp/react-calendar-pane/master.svg?style=flat-square)](https://coveralls.io/r/tomkp/react-split-pane)
