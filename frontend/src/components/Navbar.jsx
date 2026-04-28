import { NavLink } from "react-router-dom";

const labelFont = { fontFamily: "'DM Sans', sans-serif" };
const accent = "#00d4aa";

function Navbar() {
  return (
    <nav
      className="border-b border-slate-800"
      style={{ background: "#1a1a2e" }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div
          className="text-lg font-bold"
          style={{ color: accent, fontFamily: "'JetBrains Mono', monospace" }}
        >
          StockSense
        </div>

        <div className="flex gap-8">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors ${
                isActive
                  ? "border-b-2 pb-1"
                  : "border-b-2 border-transparent pb-1"
              }`
            }
            style={({ isActive }) => ({
              color: isActive ? accent : "#e2e8f0",
              borderBottomColor: isActive ? accent : "transparent",
              fontFamily: "'DM Sans', sans-serif",
            })}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/compare"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors ${
                isActive
                  ? "border-b-2 pb-1"
                  : "border-b-2 border-transparent pb-1"
              }`
            }
            style={({ isActive }) => ({
              color: isActive ? accent : "#e2e8f0",
              borderBottomColor: isActive ? accent : "transparent",
              fontFamily: "'DM Sans', sans-serif",
            })}
          >
            Compare
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
