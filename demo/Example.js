import React from 'react';
import SplitPane from '../lib/SplitPane';


var Example = React.createClass({

    render: function() {
        return (
            <SplitPane orientation="horizontal" minSize="50">
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