import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Compare from "./pages/Compare";
import store from "./store";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="min-h-screen" style={{ background: "#0f1117" }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/compare" element={<Compare />} />
          </Routes>
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
