import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../components/Sidebar";
import StockChart from "../components/StockChart";
import SummaryCard from "../components/SummaryCard";
import TopMovers from "../components/TopMovers";
import { fetchStockData, setRange } from "../store/slices/stockSlice";

const labelFont = { fontFamily: "'DM Sans', sans-serif" };

function Dashboard() {
  const dispatch = useDispatch();
  const { selectedSymbol, range, summary } = useSelector(
    (state) => state.stock,
  );

  const rangeOptions = useMemo(() => [30, 90, 180], []);

  const handleRangeChange = (nextRange) => {
    dispatch(setRange(nextRange));

    if (selectedSymbol) {
      dispatch(fetchStockData({ symbol: selectedSymbol, range: nextRange }));
    }
  };

  return (
    <div className="flex min-h-screen" style={{ background: "#0f1117" }}>
      <Sidebar />

      <main className="flex-1 p-6 text-slate-200">
        <TopMovers />

        <div className="mt-5 flex flex-wrap gap-2">
          {rangeOptions.map((option) => {
            const active = range === option;

            return (
              <button
                key={option}
                type="button"
                onClick={() => handleRangeChange(option)}
                className="rounded-md px-4 py-2 text-sm transition-colors"
                style={{
                  ...labelFont,
                  color: active ? "#001a14" : "#e2e8f0",
                  background: active ? "#00d4aa" : "#1a1a2e",
                  border: active
                    ? "1px solid #00d4aa"
                    : "1px solid rgba(148, 163, 184, 0.24)",
                }}
              >
                {option} Days
              </button>
            );
          })}
        </div>

        <div className="mt-5">
          {!selectedSymbol ? (
            <div
              className="flex h-[400px] items-center justify-center rounded-xl border border-slate-800"
              style={{ background: "#1a1a2e" }}
            >
              <p className="text-sm text-slate-400" style={labelFont}>
                ← Select a stock from the sidebar
              </p>
            </div>
          ) : (
            <StockChart />
          )}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard label="52w High" value={summary.week52_high} />
          <SummaryCard label="52w Low" value={summary.week52_low} />
          <SummaryCard label="Avg Close" value={summary.avg_close} />
          <SummaryCard
            label="Volatility Score"
            value={summary.volatility_score}
          />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
