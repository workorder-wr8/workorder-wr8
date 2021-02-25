import logo from './logo.svg';
import routes from './routes'
import './App.css';
import Header from './Components/Header/Header'

function App() {
  console.warn = () => {}
  return (
    <div className="App">
      <Header />
      {routes}
    </div>
  );
}

export default App;
