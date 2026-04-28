import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTopMovers } from "../store/slices/stockSlice";

const labelFont = { fontFamily: "'DM Sans', sans-serif" };
const numberFont = { fontFamily: "'JetBrains Mono', monospace" };

function formatPercent(value) {
  return `${(value * 100).toFixed(2)}%`;
}

function TopMovers() {
  const dispatch = useDispatch();
  const { topMovers } = useSelector((state) => state.stock);

  useEffect(() => {
    dispatch(fetchTopMovers());
  }, [dispatch]);

  const gainers = topMovers?.gainers || [];
  const losers = topMovers?.losers || [];

  return (
    <section
      className="rounded-xl border border-slate-800 p-4"
      style={{ background: "#1a1a2e" }}
    >
      <h3 className="mb-3 text-sm text-slate-200" style={labelFont}>
        Top Movers
      </h3>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <p
            className="mb-2 text-xs uppercase tracking-wide text-slate-400"
            style={labelFont}
          >
            Gainers
          </p>
          {gainers.length === 0 ? (
            <p className="text-xs text-slate-500" style={labelFont}>
              No data for today
            </p>
          ) : (
            <ul className="space-y-2">
              {gainers.map((item) => (
                <li
                  key={item.symbol}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-slate-200" style={labelFont}>
                    {item.symbol}
                  </span>
                  <span
                    className="font-medium"
                    style={{ ...numberFont, color: "#00d4aa" }}
                  >
                    ▲ {formatPercent(item.daily_return)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <p
            className="mb-2 text-xs uppercase tracking-wide text-slate-400"
            style={labelFont}
          >
            Losers
          </p>
          {losers.length === 0 ? (
            <p className="text-xs text-slate-500" style={labelFont}>
              No data for today
            </p>
          ) : (
            <ul className="space-y-2">
              {losers.map((item) => (
                <li
                  key={item.symbol}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-slate-200" style={labelFont}>
                    {item.symbol}
                  </span>
                  <span
                    className="font-medium"
                    style={{ ...numberFont, color: "#ff4d6d" }}
                  >
                    ▼ {formatPercent(item.daily_return)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

export default TopMovers;
