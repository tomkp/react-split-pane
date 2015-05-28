# react-split-pane

Split-Pane component built with [React](http://facebook.github.io/react), can be split vertically or horizontally.

Check out the [demo](http://zonked-knife.surge.sh/)


```html
   <SplitPane orientation="horizontal" minSize="50">
       <div></div>
       <div></div>
   </SplitPane>
```

```html
    <SplitPane orientation="horizontal" minSize="50">
        <div></div>
        <SplitPane orientation="vertical">
            <div></div>
            <div></div>
        </SplitPane>
    </SplitPane>
```
##Sizing elements

### minSize property

default = 11 (size of the resizer)

This property allows you to set the minimum size of a SplitPane. For example, if you set minSize={30} it will not allow the first panel to get smaller than 30 pixels.

```html
   <SplitPane orientation="horizontal" minSize="50">
       <div></div>
       <div></div>
   </SplitPane>
```

### maxSize property
default = size of your screen 

This property allows you to set the maximum size of a SplitPane. For example, if you set maxSize={300} it will not allow the second panel to get smaller than 300 pixels.

```html
   <SplitPane orientation="horizontal" maxSize="50">
       <div></div>
       <div></div>
   </SplitPane>
```


### defaultSize property

This property allows you to set the initial size of SplitPane. For example, if you set defaultSize={300} when your app will render your first panel will have 300px size.

```html
   <SplitPane orientation="horizontal" defaultSize="50">
       <div></div>
       <div></div>
   </SplitPane>
```

#####You can combine or use separetly each of those properties.




##Example styling

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

     .Resizer.vertical {
        height: 11px;
        margin: -5px 0;
        border-top: 5px solid rgba(255, 255, 255, 0);
        border-bottom: 5px solid rgba(255, 255, 255, 0);
        cursor: row-resize;
        width: 100%;
    }

    .Resizer.vertical:hover {
        border-top: 5px solid rgba(0, 0, 0, 0.5);
        border-bottom: 5px solid rgba(0, 0, 0, 0.5);
    }

    .Resizer.horizontal {
        width: 11px;
        margin: 0 -5px;
        border-left: 5px solid rgba(255, 255, 255, 0);
        border-right: 5px solid rgba(255, 255, 255, 0);
        cursor: col-resize;
        height: 100%;
    }

    .Resizer.horizontal:hover {
        border-left: 5px solid rgba(0, 0, 0, 0.5);
        border-right: 5px solid rgba(0, 0, 0, 0.5);
    }
 ```

***

[![Build Status](https://travis-ci.org/tomkp/react-split-pane.png)](https://travis-ci.org/tomkp/react-split-pane)
[![Coverage Status](https://coveralls.io/repos/tomkp/react-split-pane/badge.svg)](https://coveralls.io/r/tomkp/react-split-pane)
