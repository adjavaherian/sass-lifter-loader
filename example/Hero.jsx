var React = require('react');
var StyleSheet = require('./scss/Hero');
var Footer = require('./Footer');

var Hero = React.createClass({
    displayName: 'Hero',
    render: function() {
        return (
            <div className="Hero">
                <p>My hero</p>
                <Footer/>
            </div>
        );
    }
});


module.exports = Hero;