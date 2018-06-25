import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { FixedSizeGrid as Grid } from 'react-window';

import './styles.css';

class App extends Component {
  gridRef = React.createRef();

  render() {
    return (
      <Fragment>
        <div>
          <button
            className="ExampleButton"
            onClick={this.scrollToRow100Column50Auto}
          >
            Scroll to row 100, column 50 (align: auto)
          </button>
          <button
            className="ExampleButton"
            onClick={this.scrollToRow300Column150Start}
          >
            Scroll to row 300, column 150 (align: start)
          </button>
          <button
            className="ExampleButton"
            onClick={this.scrollToRow350Column200End}
          >
            Scroll to row 350, column 200 (align: end)
          </button>
          <button
            className="ExampleButton"
            onClick={this.scrollToRow200Column100Center}
          >
            Scroll to row 200, column 100 (align: center)
          </button>
        </div>
        <Grid
          className="Grid"
          columnCount={1000}
          columnWidth={100}
          height={150}
          ref={this.gridRef}
          rowCount={1000}
          rowHeight={35}
          width={300}
        >
          {({ columnIndex, key, rowIndex, style }) => (
            <div
              className={
                columnIndex % 2
                  ? rowIndex % 2 === 0
                    ? 'GridItemOdd'
                    : 'GridItemEven'
                  : rowIndex % 2
                    ? 'GridItemOdd'
                    : 'GridItemEven'
              }
              key={key}
              style={style}
            >
              r{rowIndex}, c{columnIndex}
            </div>
          )}
        </Grid>
      </Fragment>
    );
  }

  scrollToRow100Column50Auto = () => {
    this.gridRef.current.scrollToItem({
      columnIndex: 50,
      rowIndex: 100,
    });
  };

  scrollToRow300Column150Start = () => {
    this.gridRef.current.scrollToItem({
      align: 'start',
      columnIndex: 150,
      rowIndex: 300,
    });
  };

  scrollToRow350Column200End = () => {
    this.gridRef.current.scrollToItem({
      align: 'end',
      columnIndex: 200,
      rowIndex: 350,
    });
  };

  scrollToRow200Column100Center = () => {
    this.gridRef.current.scrollToItem({
      align: 'center',
      columnIndex: 100,
      rowIndex: 200,
    });
  };
}

ReactDOM.render(<App />, document.getElementById('root'));
