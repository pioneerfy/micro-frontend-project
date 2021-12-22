// import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p> */}
      <ul>
        <li><a href="/">主应用</a></li>
        <li><a href="/app-vue2">vue2</a></li>
        <li><a href="/app-vue3">vue3</a></li>
        <li><a href="/app-react">react</a></li>
        <li><a href="/app-angular">angular</a></li>
        {/* <li><a href="/views/index.html">menhu</a></li> */}
        <li><a href="/purehtml">purehtml</a></li>
      </ul>
      {/* </header> */}
      <main id="subapp-container"></main>
    </div>
  );
}

export default App;
