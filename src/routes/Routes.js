import React from 'react'
import { Router, Route, Switch, Redirect } from 'react-router-dom'

import LangSelector from '../common/LangSelector'
import EsperView from '../views/EsperView'

class Routes extends React.Component {

  buildRoutes = () => {
    return [
      <Route component={ EsperView } key={ 0 } path='/espers' />,
      <Redirect from='/*' key={ 1 } to='/espers' />
    ];
  }

  render() {
    const routes = this.buildRoutes();

    return (
      <div>
        <LangSelector />
        <Router history={ this.props.history }>
          <Switch>
            { routes }
          </Switch>
        </Router>
      </div>
    );
  }
}
export default Routes;