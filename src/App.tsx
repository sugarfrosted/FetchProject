import React from 'react';
import logo from './logo.svg';
import './App.css';
import DogApiSession from './api/data/DogApi';

function App() {

  async function debugging() {
    const test = new DogApiSession();
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={(event) => {console.log("click"); debugging();}} >Text</button>
      </header>
    </div>
  );
}

export default App;
