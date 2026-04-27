import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import store from "./store";

function DashboardPlaceholder() {
  return <div className="p-6 text-slate-100">Dashboard page placeholder</div>;
}

function ComparePlaceholder() {
  return <div className="p-6 text-slate-100">Compare page placeholder</div>;
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="min-h-screen" style={{ background: "#0f1117" }}>
          <Routes>
            <Route path="/" element={<DashboardPlaceholder />} />
            <Route path="/compare" element={<ComparePlaceholder />} />
          </Routes>
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
