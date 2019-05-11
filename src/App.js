import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';

import Form from './components/Form';
import Products from './components/Products';

function App() {
  return (
    <div className="App">
      <Router>
        <div>
            <Switch>
                <Route exact path="/" component={Products} />
                <Route exact path="/generate_gift_cards" component={Form} />
            </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
