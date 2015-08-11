var React = require('react');
var StyleSheet = require('./scss/OtherPage');
var HeroSection = require('./Hero');

var OtherPage = React.createClass({
    displayName: 'OtherPage',
    render: function() {
        return (
            <div className="OtherPage">
                <Hero />
            </div>
        );
    }
});


module.exports = OtherPage;