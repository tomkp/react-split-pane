# React Split Pane

Split-Pane component built with [React](http://facebook.github.io/react), can be split vertically or horizontally.

```
npm install react-split-pane
```

[![Build Status](https://img.shields.io/travis/tomkp/react-split-pane/master.svg?style=flat-square)](https://travis-ci.org/tomkp/react-split-pane)
[![Coverage Status](https://img.shields.io/coveralls/tomkp/react-split-pane/master.svg?style=flat-square)](https://coveralls.io/r/tomkp/react-split-pane)


Check out the [demos](http://react-split-pane.surge.sh/)


```html
   <SplitPane split="vertical" minSize={50} defaultSize={100}>
       <div></div>
       <div></div>
   </SplitPane>
```

```html
    <SplitPane split="vertical" minSize={50}>
        <div></div>
        <SplitPane split="horizontal">
            <div></div>
            <div></div>
        </SplitPane>
    </SplitPane>
```

### Primary pane

By dragging 'draggable' surface you can change size of the first pane.
The first pane keeps then its size while the second pane is resized by browser window.
By default it is the left pane for 'vertical' SplitPane and the top pane for 'horizontal' SplitPane.
If you want to keep size of the second pane and let the first pane to shrink or grow by browser window dimensions,
set SplitPane prop `primary` to `second`. In case of 'horizontal' SplitPane the height of bottom pane remains the same.

Resizing can be disabled by passing the `allowResize` prop as `false` (`allowResize={false}`). Resizing is enabled by default.

You can also set the size of the pane using the `size` prop. Note that a size set through props ignores the `defaultSize` and `minSize` properties.

In this example right pane keeps its width 200px while user is resizing browser window.

```html
    <SplitPane split="vertical" defaultSize={200} primary="second">
        <div></div>
        <div></div>
    </SplitPane>
```

### maxSize
You can limit the maximal size of the 'fixed' pane using the maxSize parameter with a positive value (measured in pixels but state just a number).
If you wrap the SplitPane into a container component (yes you can, just remember the container has to have the relative or absolute positioning),
then you'll need to limit the movement of the splitter (resizer) at the end of the SplitPane (otherwise it can be dragged outside the SplitPane
and you don't catch it never more). For this purpose use the maxSize parameter with value 0. When dragged the splitter/resizer will stop at the border
of the SplitPane component and think this you'll be able to pick it again and drag it back then.
And more: if you set the maxSize to negative value (e.g. -200), then the splitter stops 200px before the border (in other words it sets the minimal
size of the 'resizable' pane in this case). This can be useful also in the full-screen case of use.

### step
You can use the step prop to only allow resizing in fixed increments.

### Persisting Positions

Each SplitPane accepts an onChange function prop.  Used in conjunction with
defaultSize and a persistence layer, you can ensure that your splitter choices
survive a refresh of your app.

For example, if you are comfortable with the trade-offs of localStorage, you
could do something like the following:

```html
    <SplitPane split="vertical" minSize={50}
               defaultSize={ parseInt(localStorage.getItem('splitPos'), 10) }
               onChange={ size => localStorage.setItem('splitPos', size) }>
        <div></div>
        <div></div>
    </SplitPane>
```

Disclaimer: localStorage has a variety of performance trade-offs.  Browsers such
as Firefox have now optimized localStorage use so that they will asynchronously
initiate a read of all saved localStorage data for an origin once they know the
page will load.  If the data has not fully loaded by the time code accesses
localStorage, the code will cause the page's main thread to block until the
database load completes.  When the main thread is blocked, no other JS code will
run or layout will occur.  In multiprocess browsers and for users with fast
disk storage, this will be less of a problem.  You *are* likely to get yelled at
if you use localStorage.

A potentially better idea is to use something like
https://github.com/mozilla/localForage although hooking it up will be slightly
more involved.  You are likely to be admired by all for judiciously avoiding
use of localStorage.

### Resizing callbacks

If you need more control over resizing, SplitPane can notify you about when resizing started
and when it ended through two callbacks: `onDragStarted` and `onDragFinished`.

### Example styling

This gives a single pixel wide divider, but with a 'grabbable' surface of 11 pixels.

Thanks to ```background-clip: padding-box;``` for making transparent borders possible.


```css

    .Resizer {
        background: #000;
        opacity: .2;
        z-index: 1;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
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
    }

    .Resizer.vertical:hover {
        border-left: 5px solid rgba(0, 0, 0, 0.5);
        border-right: 5px solid rgba(0, 0, 0, 0.5);
    }
    .Resizer.disabled {
      cursor: not-allowed;
    }
    .Resizer.disabled:hover {
      border-color: transparent;
    }

 ```
### Inline Styles

You can also pass inline styles to the components via props. These are:

 * `paneStyle` - Styling to be applied to both panes
 * `pane1Style` - Styling to be applied to the first pane, with precedence over `paneStyle`
 * `pane2Style` - Styling to be applied to the second pane, with precedence over `paneStyle`
 * `resizerStyle` - Styling to be applied to the resizer bar

### Alternatives 
This library does a great job of providing a simple, straightforward API, but it doesn't do everything! 
Some other great split pane libraries exist out there as well if you want to check em out: 
 - https://github.com/leefsmp/Re-Flex (Good for triple pane layouts and subcomponent measurements)
 - https://github.com/palantir/react-mosaic (Good for advanced drag/drop + extra goodies)

### Contributing

I'm always happy to receive Pull Requests for contributions of any kind. 

If possible / necessary then please try and include a test and/or update the examples.
  
Thanks, Tom  
  
