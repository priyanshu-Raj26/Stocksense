import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCompanies,
  fetchStockData,
  fetchSummary,
  setSelectedSymbol,
} from "../store/slices/stockSlice";

const labelFont = { fontFamily: "'DM Sans', sans-serif" };

function Sidebar() {
  const dispatch = useDispatch();
  const { companies, selectedSymbol, range, loading } = useSelector(
    (state) => state.stock,
  );

  useEffect(() => {
    dispatch(fetchCompanies());
  }, [dispatch]);

  const handleSelect = (symbol) => {
    dispatch(setSelectedSymbol(symbol));
    dispatch(fetchStockData({ symbol, range }));
    dispatch(fetchSummary(symbol));
  };

  const isCompaniesLoading = loading && companies.length === 0;

  return (
    <aside
      className="h-screen w-[220px] border-r border-slate-800 p-4"
      style={{ background: "#1a1a2e" }}
    >
      <div className="mb-4" style={labelFont}>
        <h2 className="text-sm font-semibold tracking-wide text-slate-200">
          Stocks
        </h2>
        <p className="mt-1 text-xs text-slate-400">Pick a company</p>
      </div>

      {isCompaniesLoading ? (
        <p className="text-xs text-slate-500" style={labelFont}>
          Loading companies...
        </p>
      ) : (
        <ul className="space-y-2">
          {companies.map((company) => {
            const isActive = company.symbol === selectedSymbol;

            return (
              <li key={company.symbol}>
                <button
                  type="button"
                  onClick={() => handleSelect(company.symbol)}
                  className="w-full rounded-md px-3 py-2 text-left text-sm transition-colors"
                  style={{
                    ...labelFont,
                    color: isActive ? "#00d4aa" : "#e2e8f0",
                    background: isActive
                      ? "rgba(0, 212, 170, 0.14)"
                      : "transparent",
                    border: isActive
                      ? "1px solid rgba(0, 212, 170, 0.45)"
                      : "1px solid transparent",
                  }}
                >
                  {company.name}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}

export default Sidebar;
