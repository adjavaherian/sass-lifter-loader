import React from 'react';
import StyleSheet from './scss/FrontPage';

class es7 extends React.Component {
    constructor (props) {
        super(props);
    }

    handleClick = () => {
        return (typeof(window) !== 'undefined') ? window.location='tel:' + this.state.phone : null;
    }

    render () {
        return (
            <div className="es7">
            </div>
        );
    }
}

export default es7;