import './LandingPage.css';
import LandingPage from '/Users/karimelbarbary/Desktop/cos471finalproject/give-forever/src/LandingPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
        </Routes>
    </Router>
  );
}


export default App;
