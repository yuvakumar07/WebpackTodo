import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TodoApp from './components/TodoApp';
import Users from './components/Users';

function App() {
  return (
    <Router>
      <div className="app">
        <div className="container">
          <header className="header">
            <h1>Full Stack App</h1>
            <p className="subtitle">React + Node.js + Webpack on Same Port</p>

            <nav className="nav">
              <Link to="/" className="nav-link">Todos</Link>
              <Link to="/users" className="nav-link">Users</Link>
            </nav>
          </header>

          <Routes>
            <Route path="/" element={<TodoApp />} />
            <Route path="/users" element={<Users />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
