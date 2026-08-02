import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ForecastPage from "./pages/ForecastPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/forecast/:lat/:lon" element={<ForecastPage />} />
    </Routes>
  );
};

export default App;
