import React from 'react';
import SplitPane from '../src/SplitPane';


var Example = React.createClass({

    render: function() {
        return (
            <SplitPane  bSize="900">
                <div></div>
                <SplitPane orientation="vertical">
                    <div></div>
                    <div></div>
                </SplitPane>
            </SplitPane>
        );
    }

});

React.render(<Example />, document.body);