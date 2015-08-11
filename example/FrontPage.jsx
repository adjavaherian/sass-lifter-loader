var React = require('react');
var StyleSheet = require('./scss/FrontPage');
var HeroSection = require('./Hero');

var FrontPage = React.createClass({
    displayName: 'FrontPage',
    render: function() {
        return (
            <div className="FrontPage">
                <Hero />
            </div>
        );
    }
});


module.exports = FrontPage;