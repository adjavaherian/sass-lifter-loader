var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var NotFoundRoute = Router.NotFoundRoute;
var FrontPage = require('lift-sass!./FrontPage');
var OtherPage = require('lift-sass!./OtherPage');
var YetAnother = require('lift-sass!./YetAnother');
var fb = require('./images/fb-logo-blue.png');
var hp = require('./images/golden-gate-heights-2048.jpg');

module.exports = (
        <Route name="FrontPage" path='/' handler={FrontPage}/>
);
