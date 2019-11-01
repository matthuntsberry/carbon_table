import React from 'react';
import './app.scss';
import { Route, Switch } from 'react-router-dom';
import { Content } from 'carbon-components-react/lib/components/UIShell';
import TutorialHeader from './components/TutorialHeader';
import RepoPage from './content/RepoPage/RepoPage';

function App() {
  return (
    <>
      <TutorialHeader />
      <Content>
        <Switch>
          <Route exact path="/" component={RepoPage} />
        </Switch>
      </Content>
    </>
  );
}

export default App;
