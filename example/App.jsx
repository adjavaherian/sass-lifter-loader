//var React = require('react');
//var Router = require('react-router');
//var Route = Router.Route;
//var NotFoundRoute = Router.NotFoundRoute;
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var FrontPage = require('lift-sass!./FrontPage');
var OtherPage = require('lift-sass!./OtherPage');
var YetAnother = require('lift-sass!./YetAnother');
import es7 from 'lift-sass!./es7';
var fb = require('./images/fb-logo-blue.png');
var hp = require('./images/golden-gate-heights-2048.jpg');

module.exports = (
        <Route name="FrontPage" path='/' handler={FrontPage}/>
);

console.log(fb);