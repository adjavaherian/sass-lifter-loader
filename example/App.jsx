var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var NotFoundRoute = Router.NotFoundRoute;
var FrontPage = require('lift-sass!./FrontPage');

module.exports = (
        <Route name="FrontPage" path='/' handler={FrontPage}/>
);
