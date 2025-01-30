import { Routes, Route } from 'react-router-dom';
import Sphere from "./pages/Sphere.jsx";


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Sphere />} />
    </Routes>
  );
};

export default App;
