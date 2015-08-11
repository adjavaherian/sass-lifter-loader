var React = require('react');
var StyleSheet = require('./scss/Footer');

var Footer = React.createClass({
    displayName: 'Footer',
    render: function() {
        return (
            <div className="Footer">
                <p>.with love.</p>
            </div>
        );
    }
});


module.exports = Footer;