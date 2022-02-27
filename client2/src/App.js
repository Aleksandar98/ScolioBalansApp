
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Home from './Stranice/Home'
import Grupe from './Stranice/Grupe'
import Evidencija from './Stranice/Evidencija'
import './App.css';
import Upisivanje from './Stranice/Upisivanje'
import Placanje from './Stranice/Placanje'

function App() {
  return (
    <Router>
    <Switch>
      <Route exact path='/' component={Home} />
      <Route path='/placanje' component={Placanje} />
      <Route path='/upisivanje' component={Upisivanje} />
      <Route path='/evidencija' component={Evidencija} />
    </Switch>
  </Router>
  );
}

export default App;
