import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';

import Csv from './components/Csv';
import Display from './components/Display';
import Form from './components/Form';
import Products from './components/Products';

function App() {
  return (
    <div className="App">
      <Router>
        <div>
            <Switch>
                <Route exact path="/" component={Products} />
                <Route exact path="/gift_cards" component={Display} />
                <Route exact path="/generate_gift_cards" component={Form} />
                <Route exact path="/generate_csv" component={Csv} />
            </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
