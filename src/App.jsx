import './App.css';
import Home from './Pages/Home';

function App() {
  return (
    <div>
      {/* Header is now only rendered inside Home */}
      <Home />
    </div>
  );
}

export default App;
