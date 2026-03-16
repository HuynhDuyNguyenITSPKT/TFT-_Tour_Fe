import { h } from 'preact';
import { Router } from 'preact-router';
import Home from './pages/Home';
import Login from './pages/Login';
import Rules from './pages/Rules';
import './app.css';

export function App() {
  return (
    <div id="app">
      <Router>
        <Home path="/" />
        <Login path="/login" />
        <Rules path="/rules" />
      </Router>
    </div>
  );
}
