import 'core-js/es6';
import React from 'react';
import sinon from 'sinon';
import chai from 'chai';

import SplitPane from '../src/SplitPane';
import Pane from '../src/Pane';
import Resizer from '../src/Resizer';
import asserter from './assertions/Asserter';

const assert = chai.assert;

describe('SplitPane', () => {
  
  afterEach(function() {
    asserter.unmountComponent();
  });

  describe('Plain divs', () => {

    describe('horizontal', () => {
      it('2 divs', () => {
        const jsx = (
          <SplitPane split='horizontal'>
            <div>one</div>
            <div>two</div>
          </SplitPane>
        );
  
        asserter(jsx, {height: 601})
          .assertOrientation('horizontal')
          .assertNumberOfPanes(2)
          .assertNumberOfResizers(1)
          .assertSizes(['1', '1'])
          .assertSizesPx([300, 300])
        ;
      });
    
      it('3 divs', () => {
        const jsx = (
          <SplitPane split='horizontal'>
            <div>one</div>
            <div>two</div>
            <div>three</div>
          </SplitPane>
        );
    
        asserter(jsx, {height: 602})
          .assertOrientation('horizontal')
          .assertNumberOfPanes(3)
          .assertNumberOfResizers(2)
          .assertSizes(['1', '1', '1'])
          .assertSizesPx([200, 200, 200])
        ;
      });
    });
  
    describe('vertical', () => {
      it('2 divs', () => {
        const jsx = (
          <SplitPane>
            <div>one</div>
            <div>two</div>
          </SplitPane>
        );
    
        asserter(jsx, {width: 601})
          .assertOrientation('vertical')
          .assertNumberOfPanes(2)
          .assertNumberOfResizers(1)
          .assertSizes(['1', '1'])
          .assertSizesPx([300, 300])
        ;
      });
    
      it('3 divs', () => {
        const jsx = (
          <SplitPane>
            <div>one</div>
            <div>two</div>
            <div>three</div>
          </SplitPane>
        );
    
        asserter(jsx, {width: 602})
          .assertOrientation('vertical')
          .assertNumberOfPanes(3)
          .assertNumberOfResizers(2)
          .assertSizes(['1', '1', '1'])
          .assertSizesPx([200, 200, 200])
        ;
      });
    })
  });
  
  
  describe('Panes', () => {

    it('should update component when new props receive', () => {
      let jsx = (
        <SplitPane>
          <Pane initialSize='200px'>one</Pane>
          <Pane>two</Pane>
          <Pane>three</Pane>
        </SplitPane>
      );
  
      asserter(jsx, {width: 602})
        .assertSizes(['200px', '1', '1'])
        .assertSizesPx([200, 200, 200])
      ;

      jsx = (
        <SplitPane>
          <Pane initialSize='50%'>one</Pane>
          <Pane>two</Pane>
        </SplitPane>
      );

      asserter(jsx, {width: 601})
        .assertSizes(['50%', '1'])
        .assertSizesPx([300, 300])
        .dragResizer(0, {x: -150})
        .assertSizes(['25.00%', '1'])
        .assertSizesPx([150, 450])
      ;

    });
  
    describe('horizontal', () => {
      it('2 Panes', () => {
        const jsx = (
          <SplitPane split='horizontal'>
            <Pane>one</Pane>
            <Pane>two</Pane>
          </SplitPane>
        );
    
        asserter(jsx, {height: 601})
          .assertOrientation('horizontal')
          .assertNumberOfPanes(2)
          .assertNumberOfResizers(1)
          .assertSizes(['1', '1'])
          .assertSizesPx([300, 300])
        ;
      });
    
    
      it('3 Panes', () => {
        const jsx = (
          <SplitPane split='horizontal'>
            <Pane>one</Pane>
            <Pane>two</Pane>
            <Pane>three</Pane>
          </SplitPane>
        );
    
        asserter(jsx, {height: 602})
          .assertOrientation('horizontal')
          .assertNumberOfPanes(3)
          .assertNumberOfResizers(2)
          .assertSizes(['1', '1', '1'])
          .assertSizesPx([200, 200, 200])
        ;
      });
    });
  
    describe('vertical', () => {
      it('2 Panes', () => {
        const jsx = (
          <SplitPane>
            <Pane>one</Pane>
            <Pane>two</Pane>
          </SplitPane>
        );
    
        asserter(jsx, {width: 601})
          .assertOrientation('vertical')
          .assertNumberOfPanes(2)
          .assertNumberOfResizers(1)
          .assertSizes(['1', '1'])
          .assertSizesPx([300, 300])
        ;
      });
    
    
      it('3 Panes', () => {
        const jsx = (
          <SplitPane>
            <Pane>one</Pane>
            <Pane>two</Pane>
            <Pane>three</Pane>
          </SplitPane>
        );
    
        asserter(jsx, {width: 602})
          .assertOrientation('vertical')
          .assertNumberOfPanes(3)
          .assertNumberOfResizers(2)
          .assertSizes(['1', '1', '1'])
          .assertSizesPx([200, 200, 200])
        ;
      });
    });
  });
  
  
  describe('Initial sizes', () => {
  
    describe('horizontal', () => {
      it('first Pane has initial size, px', () => {
        const jsx = (
          <SplitPane split='horizontal'>
            <Pane initialSize='200px'>one</Pane>
            <Pane>two</Pane>
          </SplitPane>
        );
    
        asserter(jsx, {height: 601})
          .assertOrientation('horizontal')
          .assertNumberOfPanes(2)
          .assertNumberOfResizers(1)
          .assertSizes(['200px', '1'])
          .assertSizesPx([200, 400])
        ;
      });
    
      it('second Pane has initial size, px', () => {
        const jsx = (
          <SplitPane split='horizontal'>
            <Pane>one</Pane>
            <Pane initialSize='200px'>two</Pane>
          </SplitPane>
        );
    
        asserter(jsx, {height: 601})
          .assertOrientation('horizontal')
          .assertNumberOfPanes(2)
          .assertNumberOfResizers(1)
          .assertSizes(['1', '200px'])
          .assertSizesPx([400, 200])
        ;
      });
    
      it('first Pane has initial size, %', () => {
        const jsx = (
          <SplitPane split='horizontal'>
            <Pane initialSize='20%'>one</Pane>
            <Pane>two</Pane>
          </SplitPane>
        );
    
        asserter(jsx, {height: 601})
          .assertOrientation('horizontal')
          .assertNumberOfPanes(2)
          .assertNumberOfResizers(1)
          .assertSizes(['20%', '1'])
          .assertSizesPx([120, 480])
        ;
      });
    
      it('Panes have initial size, ratio', () => {
        const jsx = (
          <SplitPane split='horizontal'>
            <Pane initialSize='2'>one</Pane>
            <Pane initialSize={3}>two</Pane>
          </SplitPane>
        );
    
        asserter(jsx, {height: 601})
          .assertOrientation('horizontal')
          .assertNumberOfPanes(2)
          .assertNumberOfResizers(1)
          .assertSizes(['2', '3'])
          .assertSizesPx([240, 360])
        ;
      });
    
      it('multiple panes have initial sizes, different units', () => {
        const jsx = (
          <SplitPane split='horizontal'>
            <Pane initialSize='50%'>one</Pane>
            <Pane>two</Pane>
            <Pane initialSize='200px'>three</Pane>
          </SplitPane>
        );
    
        asserter(jsx, {height: 602})
          .assertOrientation('horizontal')
          .assertNumberOfPanes(3)
          .assertNumberOfResizers(2)
          .assertSizes(['50%', '1', '200px'])
          .assertSizesPx([300, 100, 200])
        ;
      });
    });
  
    describe('vertical', () => {
      it('first Pane has initial size, px', () => {
        const jsx = (
          <SplitPane>
            <Pane initialSize='200px'>one</Pane>
            <Pane>two</Pane>
          </SplitPane>
        );
    
        asserter(jsx, {width: 601})
          .assertOrientation('vertical')
          .assertNumberOfPanes(2)
          .assertNumberOfResizers(1)
          .assertSizes(['200px', '1'])
          .assertSizesPx([200, 400])
        ;
      });
    
      it('second Pane has initial size, px', () => {
        const jsx = (
          <SplitPane>
            <Pane>one</Pane>
            <Pane initialSize='200px'>two</Pane>
          </SplitPane>
        );
    
        asserter(jsx, {width: 601})
          .assertOrientation('vertical')
          .assertNumberOfPanes(2)
          .assertNumberOfResizers(1)
          .assertSizes(['1', '200px'])
          .assertSizesPx([400, 200])
        ;
      });
    
      it('first Pane has initial size, %', () => {
        const jsx = (
          <SplitPane>
            <Pane initialSize='20%'>one</Pane>
            <Pane>two</Pane>
          </SplitPane>
        );
    
        asserter(jsx, {width: 601})
          .assertOrientation('vertical')
          .assertNumberOfPanes(2)
          .assertNumberOfResizers(1)
          .assertSizes(['20%', '1'])
          .assertSizesPx([120, 480])
        ;
      });
    
      it('Panes have initial size, ratio', () => {
        const jsx = (
          <SplitPane>
            <Pane initialSize='2'>one</Pane>
            <Pane initialSize={3}>two</Pane>
          </SplitPane>
        );
    
        asserter(jsx, {width: 601})
          .assertOrientation('vertical')
          .assertNumberOfPanes(2)
          .assertNumberOfResizers(1)
          .assertSizes(['2', '3'])
          .assertSizesPx([240, 360])
        ;
      });
    
      it('multiple panes have initial sizes, different units', () => {
        const jsx = (
          <SplitPane>
            <Pane initialSize='50%'>one</Pane>
            <Pane>two</Pane>
            <Pane initialSize='200px'>three</Pane>
          </SplitPane>
        );
    
        asserter(jsx, {width: 602})
          .assertOrientation('vertical')
          .assertNumberOfPanes(3)
          .assertNumberOfResizers(2)
          .assertSizes(['50%', '1', '200px'])
          .assertSizesPx([300, 100, 200])
        ;
      });
    });
  });
  
  
  describe('Minimum sizes', () => {
  
    describe('horizontal', () => {
      it('first Pane has minimum size, px', () => {
  
        const jsx = (
          <SplitPane split='horizontal'>
            <Pane minSize='200px'>one</Pane>
            <Pane>two</Pane>
          </SplitPane>
        );
    
        asserter(jsx, {height: 601})
          .assertOrientation('horizontal')
          .assertNumberOfPanes(2)
          .assertNumberOfResizers(1)
          .assertSizes(['1', '1'])
          .assertSizesPx([300, 300])
        ;
      });
    
      it('second Pane has minimum size, px', () => {
    
        const jsx = (
          <SplitPane split='horizontal'>
            <Pane>one</Pane>
            <Pane minSize='350px'>two</Pane>
          </SplitPane>
        );
    
        asserter(jsx, {height: 601})
          .assertOrientation('horizontal')
          .assertNumberOfPanes(2)
          .assertNumberOfResizers(1)
          .assertSizes(['1', '1'])
          .assertSizesPx([250, 350])
        ;
      });
    
      it('first Pane has minimum size, %', () => {
    
        const jsx = (
          <SplitPane split='horizontal'>
            <Pane minSize='60%'>one</Pane>
            <Pane>two</Pane>
          </SplitPane>
        );
    
        asserter(jsx, {height: 601})
          .assertOrientation('horizontal')
          .assertNumberOfPanes(2)
          .assertNumberOfResizers(1)
          .assertSizes(['1', '1'])
          .assertSizesPx([360, 240])
        ;
      });
    
      it('multiple panes have minimum size', () => {
    
        const jsx = (
          <SplitPane split='horizontal'>
            <Pane minSize='200px'>one</Pane>
            <Pane>two</Pane>
            <Pane minSize='35%'>two</Pane>
          </SplitPane>
        );
    
        asserter(jsx, {height: 602})
          .assertOrientation('horizontal')
          .assertNumberOfPanes(3)
          .assertNumberOfResizers(2)
          .assertSizes(['1', '1', '1'])
          .assertSizesPx([200, 190, 210])
        ;
      });
    
      it('panes have minimum size, initial size', () => {
    
        const jsx = (
          <SplitPane split='horizontal'>
            <Pane initialSize='1' minSize='210px'>one</Pane>
            <Pane initialSize='2'>two</Pane>
          </SplitPane>
        );
    
        asserter(jsx, {height: 601})
          .assertOrientation('horizontal')
          .assertNumberOfPanes(2)
          .assertNumberOfResizers(1)
          .assertSizes(['1', '2'])
          .assertSizesPx([210, 390])
        ;
      });
    });
  
    describe('vertical', () => {
      it('first Pane has minimum size, px', () => {
  
        const jsx = (
          <SplitPane>
            <Pane minSize='200px'>one</Pane>
            <Pane>two</Pane>
          </SplitPane>
        );
    
        asserter(jsx, {width: 601})
          .assertOrientation('vertical')
          .assertNumberOfPanes(2)
          .assertNumberOfResizers(1)
          .assertSizes(['1', '1'])
          .assertSizesPx([300, 300])
        ;
      });
    
      it('second Pane has minimum size, px', () => {
    
        const jsx = (
          <SplitPane>
            <Pane>one</Pane>
            <Pane minSize='350px'>two</Pane>
          </SplitPane>
        );
    
        asserter(jsx, {width: 601})
          .assertOrientation('vertical')
          .assertNumberOfPanes(2)
          .assertNumberOfResizers(1)
          .assertSizes(['1', '1'])
          .assertSizesPx([250, 350])
        ;
      });
    
      it('first Pane has minimum size, %', () => {
    
        const jsx = (
          <SplitPane>
            <Pane minSize='60%'>one</Pane>
            <Pane>two</Pane>
          </SplitPane>
        );
    
        asserter(jsx, {width: 601})
          .assertOrientation('vertical')
          .assertNumberOfPanes(2)
          .assertNumberOfResizers(1)
          .assertSizes(['1', '1'])
          .assertSizesPx([360, 240])
        ;
      });
    
      it('multiple panes have minimum size', () => {
    
        const jsx = (
          <SplitPane>
            <Pane minSize='200px'>one</Pane>
            <Pane>two</Pane>
            <Pane minSize='35%'>two</Pane>
          </SplitPane>
        );
    
        asserter(jsx, {width: 602})
          .assertOrientation('vertical')
          .assertNumberOfPanes(3)
          .assertNumberOfResizers(2)
          .assertSizes(['1', '1', '1'])
          .assertSizesPx([200, 190, 210])
        ;
      });
    
      it('panes have minimum size, initial size', () => {
    
        const jsx = (
          <SplitPane>
            <Pane minSize='210px'>one</Pane>
            <Pane initialSize='2'>two</Pane>
          </SplitPane>
        );
    
        asserter(jsx, {width: 601})
          .assertOrientation('vertical')
          .assertNumberOfPanes(2)
          .assertNumberOfResizers(1)
          .assertSizes(['1', '2'])
          .assertSizesPx([210, 390])
        ;
      });
    });
  });
  
  
  describe('Maximum sizes', () => {
  
    describe('horizontal', () => {
      it('first Pane has maximum size, px', () => {
  
        const jsx = (
          <SplitPane split='horizontal'>
            <Pane maxSize='200px'>one</Pane>
            <Pane>two</Pane>
          </SplitPane>
        );
    
        asserter(jsx, {height: 601})
          .assertOrientation('horizontal')
          .assertNumberOfPanes(2)
          .assertNumberOfResizers(1)
          .assertSizes(['1', '1'])
          .assertSizesPx([200, 400])
        ;
      });
    
      it('second Pane has maximum size, px', () => {
    
        const jsx = (
          <SplitPane split='horizontal'>
            <Pane>one</Pane>
            <Pane maxSize='200px'>two</Pane>
          </SplitPane>
        );
    
        asserter(jsx, {height: 601})
          .assertOrientation('horizontal')
          .assertNumberOfPanes(2)
          .assertNumberOfResizers(1)
          .assertSizes(['1', '1'])
          .assertSizesPx([400, 200])
        ;
      });
    
      it('first Pane has maximum size, %', () => {
    
        const jsx = (
          <SplitPane split='horizontal'>
            <Pane maxSize='30%'>one</Pane>
            <Pane>two</Pane>
          </SplitPane>
        );
    
        asserter(jsx, {height: 601})
          .assertOrientation('horizontal')
          .assertNumberOfPanes(2)
          .assertNumberOfResizers(1)
          .assertSizes(['1', '1'])
          .assertSizesPx([180, 420])
        ;
      });
    
      it('multiple panes have maximum size', () => {
    
        const jsx = (
          <SplitPane split='horizontal'>
            <Pane maxSize='150px'>one</Pane>
            <Pane>two</Pane>
            <Pane maxSize='30%'>two</Pane>
          </SplitPane>
        );
    
        asserter(jsx, {height: 602})
          .assertOrientation('horizontal')
          .assertNumberOfPanes(3)
          .assertNumberOfResizers(2)
          .assertSizes(['1', '1', '1'])
          .assertSizesPx([150, 270, 180])
        ;
      });
    
      it('panes have minimum size, initial size', () => {
    
        const jsx = (
          <SplitPane split='horizontal'>
            <Pane maxSize='200px' initialSize='60%'>one</Pane>
            <Pane>two</Pane>
          </SplitPane>
        );
    
        asserter(jsx, {height: 601})
          .assertOrientation('horizontal')
          .assertNumberOfPanes(2)
          .assertNumberOfResizers(1)
          .assertSizes(['60%', '1'])
          .assertSizesPx([200, 400])
        ;
      });
    });
  
    describe('vertical', () => {
      it('first Pane has maximum size, px', () => {
  
        const jsx = (
          <SplitPane>
            <Pane maxSize='200px'>one</Pane>
            <Pane>two</Pane>
          </SplitPane>
        );
    
        asserter(jsx, {width: 601})
          .assertOrientation('vertical')
          .assertNumberOfPanes(2)
          .assertNumberOfResizers(1)
          .assertSizes(['1', '1'])
          .assertSizesPx([200, 400])
        ;
      });
    
      it('second Pane has maximum size, px', () => {
    
        const jsx = (
          <SplitPane>
            <Pane>one</Pane>
            <Pane maxSize='200px'>two</Pane>
          </SplitPane>
        );
    
        asserter(jsx, {width: 601})
          .assertOrientation('vertical')
          .assertNumberOfPanes(2)
          .assertNumberOfResizers(1)
          .assertSizes(['1', '1'])
          .assertSizesPx([400, 200])
        ;
      });
    
      it('first Pane has maximum size, %', () => {
    
        const jsx = (
          <SplitPane>
            <Pane maxSize='30%'>one</Pane>
            <Pane>two</Pane>
          </SplitPane>
        );
    
        asserter(jsx, {width: 601})
          .assertOrientation('vertical')
          .assertNumberOfPanes(2)
          .assertNumberOfResizers(1)
          .assertSizes(['1', '1'])
          .assertSizesPx([180, 420])
        ;
      });
    
      it('multiple panes have maximum size', () => {
    
        const jsx = (
          <SplitPane>
            <Pane maxSize='150px'>one</Pane>
            <Pane>two</Pane>
            <Pane maxSize='30%'>two</Pane>
          </SplitPane>
        );
    
        asserter(jsx, {width: 602})
          .assertOrientation('vertical')
          .assertNumberOfPanes(3)
          .assertNumberOfResizers(2)
          .assertSizes(['1', '1', '1'])
          .assertSizesPx([150, 270, 180])
        ;
      });
    
      it('panes have minimum size, initial size', () => {
    
        const jsx = (
          <SplitPane>
            <Pane maxSize='200px' initialSize='60%'>one</Pane>
            <Pane>two</Pane>
          </SplitPane>
        );
    
        asserter(jsx, {width: 601})
          .assertOrientation('vertical')
          .assertNumberOfPanes(2)
          .assertNumberOfResizers(1)
          .assertSizes(['60%', '1'])
          .assertSizesPx([200, 400])
        ;
      });
    });
  });
  
  
  describe('Drag resizer', () => {
  
    describe('horizontal', () => {
  
      it('2 divs', () => {
        const jsx = (
          <SplitPane split='horizontal'>
            <div>one</div>
            <div>two</div>
          </SplitPane>
        );
  
        asserter(jsx, {height: 601})
          .assertSizes(['1', '1'])
          .assertSizesPx([300, 300])
          .dragResizer(0, {y: -100})
          .assertSizes(['20000', '40000'])
          .assertSizesPx([200, 400])
        ;
      });
  
      it('2 Panes', () => {
        const jsx = (
          <SplitPane split='horizontal'>
            <Pane>one</Pane>
            <Pane>two</Pane>
          </SplitPane>
        );
  
        asserter(jsx, {height: 601})
          .assertSizes(['1', '1'])
          .assertSizesPx([300, 300])
          .dragResizer(0, {y: -100})
          .assertSizes(['20000', '40000'])
          .assertSizesPx([200, 400])
        ;
      });
  
      it('2 Panes, should persists initial size unit, px', () => {
        const jsx = (
          <SplitPane split='horizontal'>
            <Pane initialSize='200px'>one</Pane>
            <Pane>two</Pane>
          </SplitPane>
        );
  
        asserter(jsx, {height: 601})
          .assertSizes(['200px', '1'])
          .assertSizesPx([200, 400])
          .dragResizer(0, {y: 100})
          .assertSizes(['300.00px', '1'])
          .assertSizesPx([300, 300])
        ;
      });
  
      it('2 Panes, should persists initial size unit, %', () => {
        const jsx = (
          <SplitPane split='horizontal'>
            <Pane initialSize='30%'>one</Pane>
            <Pane>two</Pane>
          </SplitPane>
        );
  
        asserter(jsx, {height: 601})
          .assertSizes(['30%', '1'])
          .assertSizesPx([180, 420])
          .dragResizer(0, {y: 120})
          .assertSizes(['50.00%', '1'])
          .assertSizesPx([300, 300])
        ;
      });
  
      it('2 Panes - resized all the way', () => {
        const jsx = (
          <SplitPane split='horizontal'>
            <div>one</div>
            <div>two</div>
          </SplitPane>
        );
  
        asserter(jsx, {height: 601})
          .assertSizesPx([300, 300])
          .assertSizes(['1', '1'])
          .dragResizer(0, {y: 300})
          .assertSizes(['60000', '0'])
          .assertSizesPx([600, 0])
        ;
      });
  
      it('2 panes - over resized, top', () => {
        const jsx = (
          <SplitPane split='horizontal'>
            <Pane initialSize='20%'>one</Pane>
            <Pane>two</Pane>
          </SplitPane>
        );
  
        asserter(jsx, {height: 601})
          .assertSizesPx([120, 480])
          .assertSizes(['20%', '1'])
          .dragResizer(0, {y: -200})
          .assertSizes(['0.00%', '1'])
          .assertSizesPx([0, 600])
        ;
      });
  
      it('2 panes - over resized, bottom', () => {
        const jsx = (
          <SplitPane split='horizontal'>
            <div>one</div>
            <div>two</div>
          </SplitPane>
        );
  
        asserter(jsx, {height: 601})
          .assertSizesPx([300, 300])
          .assertSizes(['1', '1'])
          .dragResizer(0, {y: 400})
          .assertSizes(['60000', '0'])
          .assertSizesPx([600, 0])
        ;
      });
  
  
      it('2 Panes - resize, first pane has max px size', () => {
        const jsx = (
          <SplitPane split='horizontal'>
            <Pane maxSize='400px'>one</Pane>
            <Pane>two</Pane>
          </SplitPane>
        );
  
        asserter(jsx, {height: 601})
          .assertSizesPx([300, 300])
          .assertSizes(['1', '1'])
          .dragResizer(0, {y: 300})
          .assertSizes(['40000', '20000'])
          .assertSizesPx([400, 200])
        ;
      });
  
      it('2 Panes - resize, second pane has min px size', () => {
        const jsx = (
          <SplitPane split='horizontal'>
            <Pane>one</Pane>
            <Pane minSize='200px'>two</Pane>
          </SplitPane>
        );
  
        asserter(jsx, {height: 601})
          .assertSizesPx([300, 300])
          .assertSizes(['1', '1'])
          .dragResizer(0, {y: 300})
          .assertSizes(['40000', '20000'])
          .assertSizesPx([400, 200])
        ;
      });
  
      it('2 Panes - resize, first pane has min px size', () => {
        const jsx = (
          <SplitPane split='horizontal'>
            <Pane minSize='200px'>one</Pane>
            <Pane>two</Pane>
          </SplitPane>
        );
  
        asserter(jsx, {height: 601})
          .assertSizesPx([300, 300])
          .assertSizes(['1', '1'])
          .dragResizer(0, {y: -300})
          .assertSizes(['20000', '40000'])
          .assertSizesPx([200, 400])
        ;
      });
  
      it('2 Panes - resize, second pane has max px size', () => {
        const jsx = (
          <SplitPane split='horizontal'>
            <Pane>one</Pane>
            <Pane maxSize='400px'>two</Pane>
          </SplitPane>
        );
  
        asserter(jsx, {height: 601})
          .assertSizesPx([300, 300])
          .assertSizes(['1', '1'])
          .dragResizer(0, {y: -300})
          .assertSizes(['20000', '40000'])
          .assertSizesPx([200, 400])
        ;
      });
  
      it('2 Panes - resize, max % size', () => {
        const jsx = (
          <SplitPane split='horizontal'>
            <Pane maxSize='60%'>one</Pane>
            <Pane>two</Pane>
          </SplitPane>
        );
  
        asserter(jsx, {height: 601})
          .assertSizesPx([300, 300])
          .assertSizes(['1', '1'])
          .dragResizer(0, {y: 300})
          .assertSizes(['36000', '24000'])
          .assertSizesPx([360, 240])
        ;
      });
  
      it('2 Panes - resize, min % size', () => {
        const jsx = (
          <SplitPane split='horizontal'>
            <Pane minSize='30%'>one</Pane>
            <Pane>two</Pane>
          </SplitPane>
        );
  
        asserter(jsx, {height: 601})
          .assertSizesPx([300, 300])
          .assertSizes(['1', '1'])
          .dragResizer(0, {y: -300})
          .assertSizes(['18000', '42000'])
          .assertSizesPx([180, 420])
        ;
      });
    });
  
  
    describe('vertical', () => {
  
      it('2 divs', () => {
        const jsx = (
          <SplitPane>
            <div>one</div>
            <div>two</div>
          </SplitPane>
        );
  
        asserter(jsx, {width: 601})
          .assertSizes(['1', '1'])
          .assertSizesPx([300, 300])
          .dragResizer(0, {x: 100})
          .assertSizes(['40000', '20000'])
          .assertSizesPx([400, 200])
        ;
      });
  
      it('2 Panes', () => {
        const jsx = (
          <SplitPane>
            <Pane>one</Pane>
            <Pane>two</Pane>
          </SplitPane>
        );
  
        asserter(jsx, {width: 601})
          .assertSizesPx([300, 300])
          .assertSizes(['1', '1'])
          .dragResizer(0, {x: 100})
          .assertSizes(['40000', '20000'])
          .assertSizesPx([400, 200])
        ;
      });
  
      it('2 Panes, should persists initial size unit, px', () => {
        const jsx = (
          <SplitPane>
            <Pane initialSize='200px'>one</Pane>
            <Pane>two</Pane>
          </SplitPane>
        );
  
        asserter(jsx, {width: 601})
          .assertSizes(['200px', '1'])
          .assertSizesPx([200, 400])
          .dragResizer(0, {x: 100})
          .assertSizes(['300.00px', '1'])
          .assertSizesPx([300, 300])
        ;
      });
  
      it('2 Panes, should persists initial size unit, %', () => {
        const jsx = (
          <SplitPane>
            <Pane initialSize='30%'>one</Pane>
            <Pane>two</Pane>
          </SplitPane>
        );
  
        asserter(jsx, {width: 601})
          .assertSizes(['30%', '1'])
          .assertSizesPx([180, 420])
          .dragResizer(0, {x: 120})
          .assertSizes(['50.00%', '1'])
          .assertSizesPx([300, 300])
        ;
      });
  
      it('2 Panes - resized all the way', () => {
        const jsx = (
          <SplitPane>
            <div>one</div>
            <div>two</div>
          </SplitPane>
        );
  
        asserter(jsx, {width: 601})
          .assertSizesPx([300, 300])
          .assertSizes(['1', '1'])
          .dragResizer(0, {x: 300})
          .assertSizes(['60000', '0'])
          .assertSizesPx([600, 0])
        ;
      });
  
      it('2 panes - over resized, left', () => {
        const jsx = (
          <SplitPane>
            <Pane initialSize='20%'>one</Pane>
            <Pane>two</Pane>
          </SplitPane>
        );
  
        asserter(jsx, {width: 601})
          .assertSizesPx([120, 480])
          .assertSizes(['20%', '1'])
          .dragResizer(0, {x: -200})
          .assertSizes(['0.00%', '1'])
          .assertSizesPx([0, 600])
        ;
      });
  
      it('2 panes - over resized, right', () => {
        const jsx = (
          <SplitPane>
            <div>one</div>
            <div>two</div>
          </SplitPane>
        );
  
        asserter(jsx, {width: 601})
          .assertSizesPx([300, 300])
          .assertSizes(['1', '1'])
          .dragResizer(0, {x: 400})
          .assertSizes(['60000', '0'])
          .assertSizesPx([600, 0])
        ;
      });
  
  
      it('2 Panes - resize, first pane has max px size', () => {
        const jsx = (
          <SplitPane>
            <Pane maxSize='400px'>one</Pane>
            <Pane>two</Pane>
          </SplitPane>
        );
  
        asserter(jsx, {width: 601})
          .assertSizesPx([300, 300])
          .assertSizes(['1', '1'])
          .dragResizer(0, {x: 300})
          .assertSizes(['40000', '20000'])
          .assertSizesPx([400, 200])
        ;
      });
  
      it('2 Panes - resize, second pane has min px size', () => {
        const jsx = (
          <SplitPane>
            <Pane>one</Pane>
            <Pane minSize='200px'>two</Pane>
          </SplitPane>
        );
  
        asserter(jsx, {width: 601})
          .assertSizesPx([300, 300])
          .assertSizes(['1', '1'])
          .dragResizer(0, {x: 300})
          .assertSizes(['40000', '20000'])
          .assertSizesPx([400, 200])
        ;
      });
  
      it('2 Panes - resize, first pane has min px size', () => {
        const jsx = (
          <SplitPane>
            <Pane minSize='200px'>one</Pane>
            <Pane>two</Pane>
          </SplitPane>
        );
  
        asserter(jsx, {width: 601})
          .assertSizesPx([300, 300])
          .assertSizes(['1', '1'])
          .dragResizer(0, {x: -300})
          .assertSizes(['20000', '40000'])
          .assertSizesPx([200, 400])
        ;
      });
  
      it('2 Panes - resize, second pane has max px size', () => {
        const jsx = (
          <SplitPane>
            <Pane>one</Pane>
            <Pane maxSize='400px'>two</Pane>
          </SplitPane>
        );
  
        asserter(jsx, {width: 601})
          .assertSizesPx([300, 300])
          .assertSizes(['1', '1'])
          .dragResizer(0, {x: -300})
          .assertSizes(['20000', '40000'])
          .assertSizesPx([200, 400])
        ;
      });
  
      it('2 Panes - resize, max % size', () => {
        const jsx = (
          <SplitPane>
            <Pane maxSize='60%'>one</Pane>
            <Pane>two</Pane>
          </SplitPane>
        );
  
        asserter(jsx, {width: 601})
          .assertSizesPx([300, 300])
          .assertSizes(['1', '1'])
          .dragResizer(0, {x: 300})
          .assertSizes(['36000', '24000'])
          .assertSizesPx([360, 240])
        ;
      });
  
      it('2 Panes - resize, min % size', () => {
        const jsx = (
          <SplitPane>
            <Pane minSize='30%'>one</Pane>
            <Pane>two</Pane>
          </SplitPane>
        );
  
        asserter(jsx, {width: 601})
          .assertSizesPx([300, 300])
          .assertSizes(['1', '1'])
          .dragResizer(0, {x: -300})
          .assertSizes(['18000', '42000'])
          .assertSizesPx([180, 420])
        ;
      });
    });
  
  
    describe('multiple horizontal Panes', () => {
  
      describe('horizontal', () => {
  
        it('first resizer', () => {
          const jsx = (
            <SplitPane split='horizontal'>
              <Pane>one</Pane>
              <Pane>two</Pane>
              <Pane>three</Pane>
              <Pane>four</Pane>
            </SplitPane>
          );
    
          asserter(jsx, {height: 403})
            .assertSizes(['1', '1', '1', '1'])
            .assertSizesPx([100, 100, 100, 100])
            .dragResizer(0, {y: 50})
            .assertSizes(['15000', '5000', '10000', '10000'])
            .assertSizesPx([150, 50, 100, 100])
          ;
        });
  
        it('second resizer', () => {
          const jsx = (
            <SplitPane split='horizontal'>
              <Pane>one</Pane>
              <Pane>two</Pane>
              <Pane>three</Pane>
              <Pane>four</Pane>
            </SplitPane>
          );
    
          asserter(jsx, {height: 403})
            .assertSizes(['1', '1', '1', '1'])
            .assertSizesPx([100, 100, 100, 100])
            .dragResizer(1, {y: 50})
            .assertSizes(['10000', '15000', '5000', '10000'])
            .assertSizesPx([100, 150, 50, 100])
          ;
        });
  
        it('second pane oversized, bottom', () => {
          const jsx = (
            <SplitPane split='horizontal'>
              <Pane>one</Pane>
              <Pane>two</Pane>
              <Pane>three</Pane>
              <Pane>four</Pane>
            </SplitPane>
          );
  
          asserter(jsx, {height: 403})
            .assertSizes(['1', '1', '1', '1'])
            .assertSizesPx([100, 100, 100, 100])
            .dragResizer(1, {y: 100})
            .assertSizes(['10000', '20000', '0', '10000'])
            .assertSizesPx([100, 200, 0, 100])
          ;
        });
  
        it('second pane oversized, top', () => {
          const jsx = (
            <SplitPane split='horizontal'>
              <Pane>one</Pane>
              <Pane>two</Pane>
              <Pane>three</Pane>
              <Pane>four</Pane>
            </SplitPane>
          );
  
          asserter(jsx, {height: 403})
            .assertSizes(['1', '1', '1', '1'])
            .assertSizesPx([100, 100, 100, 100])
            .dragResizer(1, {y: -100})
            .assertSizes(['10000', '0', '20000', '10000'])
            .assertSizesPx([100, 0, 200, 100])
          ;
        });
      });
  
      describe('vertical', () => {
  
        it('first resizer', () => {
          const jsx = (
            <SplitPane>
              <Pane>one</Pane>
              <Pane>two</Pane>
              <Pane>three</Pane>
              <Pane>four</Pane>
            </SplitPane>
          );
    
          asserter(jsx, {width: 403})
            .assertSizes(['1', '1', '1', '1'])
            .assertSizesPx([100, 100, 100, 100])
            .dragResizer(0, {x: 50})
            .assertSizes(['15000', '5000', '10000', '10000'])
            .assertSizesPx([150, 50, 100, 100])
          ;
        });
  
        it('second resizer', () => {
          const jsx = (
            <SplitPane>
              <Pane>one</Pane>
              <Pane>two</Pane>
              <Pane>three</Pane>
              <Pane>four</Pane>
            </SplitPane>
          );
    
          asserter(jsx, {width: 403})
            .assertSizes(['1', '1', '1', '1'])
            .assertSizesPx([100, 100, 100, 100])
            .dragResizer(1, {x: 50})
            .assertSizes(['10000', '15000', '5000', '10000'])
            .assertSizesPx([100, 150, 50, 100])
          ;
        });
  
        it('second pane oversized, right', () => {
          const jsx = (
            <SplitPane>
              <Pane>one</Pane>
              <Pane>two</Pane>
              <Pane>three</Pane>
              <Pane>four</Pane>
            </SplitPane>
          );
  
          asserter(jsx, {width: 403})
            .assertSizes(['1', '1', '1', '1'])
            .assertSizesPx([100, 100, 100, 100])
            .dragResizer(1, {x: 100})
            .assertSizes(['10000', '20000', '0', '10000'])
            .assertSizesPx([100, 200, 0, 100])
          ;
        });
  
        it('second pane oversized, left', () => {
          const jsx = (
            <SplitPane>
              <Pane>one</Pane>
              <Pane>two</Pane>
              <Pane>three</Pane>
              <Pane>four</Pane>
            </SplitPane>
          );
  
          asserter(jsx, {width: 403})
            .assertSizes(['1', '1', '1', '1'])
            .assertSizesPx([100, 100, 100, 100])
            .dragResizer(1, {x: -100})
            .assertSizes(['10000', '0', '20000', '10000'])
            .assertSizesPx([100, 0, 200, 100])
          ;
        });
      });
    });
  
  });
  
  describe('event handling', () => {
    
    it('onResizeStart', () => {
      const onResizeStart = sinon.spy();
      const onChange = sinon.spy();
      const onResizeEnd = sinon.spy();
  
      const jsx = (
        <SplitPane
          onResizeStart={onResizeStart}
          onChange={onChange}
          onResizeEnd={onResizeEnd}
        >
          <Pane initialSize='200px'>one</Pane>
          <Pane>two</Pane>
          <Pane>three</Pane>
        </SplitPane>
      );
  
      asserter(jsx, {width: 602})
          .assertSizes(['200px', '1', '1'])
          .dragResizer(0, {x: 100})
          .assertSizes(['300.00px', '10000', '20000'])
        ;
  
      assert(onResizeStart.withArgs().calledOnce);
      assert(onChange.withArgs(['300.00px', '10000', '20000']).calledOnce);
      assert(onResizeEnd.withArgs(['300.00px', '10000', '20000']).calledOnce);
    });
  
  });

});