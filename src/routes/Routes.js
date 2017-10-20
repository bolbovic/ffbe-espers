import React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';

import EsperView from '../views/EsperView';
import FilesView from '../views/FilesView';
import LangSelector from '../common/LangSelector';

class Routes extends React.Component {
  buildRoutes = () => {
    return [
      <Route component={EsperView} key={0} path="/espers" />,
      <Route component={FilesView} key={0} path="/files" />,
      <Redirect from="/*" key={1} to="/espers" />
    ];
  };

  render() {
    const routes = this.buildRoutes();

    return (
      <div>
        <LangSelector />
        <Router history={this.props.history}>
          <Switch>{routes}</Switch>
        </Router>
      </div>
    );
  }
}
export default Routes;
