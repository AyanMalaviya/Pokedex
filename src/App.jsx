import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import PokemonDetail from './Pages/PokemonDetail';
import Favorites from './Pages/Favorites';
import Compare from './Pages/Compare';
import ErrorBoundary from './Components/ErrorBoundary';
import { FavoritesProvider } from './contexts/FavoritesContext';

function App() {
  return (
    <FavoritesProvider>
      <ErrorBoundary>
        <Router basename="/">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pokemon/:name" element={<PokemonDetail />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/compare" element={<Compare />} />
          </Routes>
        </Router>
      </ErrorBoundary>
    </FavoritesProvider>
  );
}

export default App;
