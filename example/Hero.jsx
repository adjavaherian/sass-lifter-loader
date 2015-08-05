//var React = require('react');
var StyleSheet = require('./scss/Hero');

var Hero = React.createClass({
    displayName: 'Hero',
    render: function() {
        return (
            <div className="Hero">
                <p>My hero</p>
            </div>
        );
    }
});


module.exports = Hero;