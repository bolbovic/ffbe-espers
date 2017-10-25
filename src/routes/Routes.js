import React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';

import EsperView from '../views/EsperView';
import FilesView from '../views/FilesView';
import LangSelector from '../common/LangSelector';

class Routes extends React.Component {
  buildRoutes = () => [
    <Route component={EsperView} key={0} path="/esper/:id/:evol/:level" />,
    <Route component={EsperView} key={1} path="/espers" />,
    <Route component={FilesView} key={2} path="/files" />,
    <Redirect from="/*" key={1} to="/espers" />
  ];

  render() {
    return (
      <div>
        <LangSelector />
        <Router history={this.props.history}>
          <Switch>{this.buildRoutes()}</Switch>
        </Router>
      </div>
    );
  }
}

Routes.propTypes = {
  history: React.PropTypes.object
};
export default Routes;
