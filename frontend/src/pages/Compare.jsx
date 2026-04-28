import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanies, fetchCompareData } from "../store/slices/stockSlice";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const labelFont = { fontFamily: "'DM Sans', sans-serif" };
const numberFont = { fontFamily: "'JetBrains Mono', monospace" };
const accent = "#00d4aa";
const secondary = "#9d84ff";

function Compare() {
  const dispatch = useDispatch();
  const { companies, compareData, loading } = useSelector(
    (state) => state.stock,
  );

  const [symbol1, setSymbol1] = useState("");
  const [symbol2, setSymbol2] = useState("");

  useEffect(() => {
    dispatch(fetchCompanies());
  }, [dispatch]);

  const handleCompare = () => {
    if (symbol1 && symbol2 && symbol1 !== symbol2) {
      dispatch(fetchCompareData({ symbol1, symbol2 }));
    }
  };

  const hasCompareData =
    compareData?.data &&
    compareData.data[symbol1]?.length &&
    compareData.data[symbol2]?.length;

  const chartLabels = hasCompareData
    ? compareData.data[symbol1].map((point) => {
        const date = new Date(point.date);
        return date.toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
        });
      })
    : [];

  const series1 = hasCompareData
    ? compareData.data[symbol1].map((p) => p.close)
    : [];
  const series2 = hasCompareData
    ? compareData.data[symbol2].map((p) => p.close)
    : [];

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: symbol1,
        data: series1,
        tension: 0.4,
        borderColor: accent,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: accent,
        fill: false,
      },
      {
        label: symbol2,
        data: series2,
        tension: 0.4,
        borderColor: secondary,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: secondary,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: "#e2e8f0",
          font: {
            family: "DM Sans",
            size: 13,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(15, 17, 23, 0.95)",
        titleColor: "#e2e8f0",
        bodyColor: "#e2e8f0",
        borderColor: "rgba(0, 212, 170, 0.3)",
        borderWidth: 1,
        callbacks: {
          title: (items) => `Date: ${items[0].label}`,
          label: (context) => {
            const symbol = context.dataset.label;
            const value = Number(context.parsed.y).toFixed(2);
            return `${symbol}: ${value}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#94a3b8",
          maxTicksLimit: 8,
        },
        grid: {
          color: "rgba(148, 163, 184, 0.08)",
        },
      },
      y: {
        ticks: {
          color: "#94a3b8",
        },
        grid: {
          color: "rgba(148, 163, 184, 0.08)",
        },
      },
    },
  };

  return (
    <div
      className="min-h-screen p-6"
      style={{ background: "#0f1117", color: "#e2e8f0" }}
    >
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-2xl font-bold" style={labelFont}>
          Stock Comparison
        </h1>

        <div
          className="mb-6 rounded-xl border border-slate-800/80 p-4"
          style={{ background: "#1a1a2e" }}
        >
          <p className="mb-4 text-sm text-slate-400" style={labelFont}>
            Select two stocks to compare
          </p>

          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[200px]">
              <label
                className="mb-2 block text-xs uppercase tracking-wide text-slate-400"
                style={labelFont}
              >
                Stock 1
              </label>
              <select
                value={symbol1}
                onChange={(e) => setSymbol1(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm text-slate-200"
                style={{ fontFamily: "DM Sans, sans-serif" }}
              >
                <option value="">Choose a stock...</option>
                {companies.map((company) => (
                  <option key={company.symbol} value={company.symbol}>
                    {company.symbol} - {company.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label
                className="mb-2 block text-xs uppercase tracking-wide text-slate-400"
                style={labelFont}
              >
                Stock 2
              </label>
              <select
                value={symbol2}
                onChange={(e) => setSymbol2(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm text-slate-200"
                style={{ fontFamily: "DM Sans, sans-serif" }}
              >
                <option value="">Choose a stock...</option>
                {companies.map((company) => (
                  <option key={company.symbol} value={company.symbol}>
                    {company.symbol} - {company.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleCompare}
                disabled={
                  !symbol1 || !symbol2 || symbol1 === symbol2 || loading
                }
                className="rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
                style={{
                  background:
                    symbol1 && symbol2 && symbol1 !== symbol2
                      ? accent
                      : "#404656",
                  color:
                    symbol1 && symbol2 && symbol1 !== symbol2
                      ? "#041717"
                      : "#94a3b8",
                  fontFamily: "DM Sans, sans-serif",
                }}
              >
                {loading ? "Loading..." : "Compare"}
              </button>
            </div>
          </div>
        </div>

        {hasCompareData && (
          <>
            <div
              className="mb-6 flex items-center justify-between rounded-xl border border-slate-800/80 p-4"
              style={{ background: "#1a1a2e" }}
            >
              <h2 className="text-lg font-semibold" style={labelFont}>
                Correlation Analysis
              </h2>
              <div
                className="rounded-lg px-3 py-2 text-sm font-medium"
                style={{
                  background: "rgba(0, 212, 170, 0.15)",
                  color: accent,
                  fontFamily: "JetBrains Mono, monospace",
                  border: "1px solid rgba(0, 212, 170, 0.3)",
                }}
              >
                Correlation: {Number(compareData.correlation).toFixed(4)}
              </div>
            </div>

            <div
              className="h-[450px] rounded-xl border border-slate-800/80 p-4"
              style={{ background: "#1a1a2e" }}
            >
              <Line data={chartData} options={options} />
            </div>
          </>
        )}

        {!hasCompareData &&
          symbol1 &&
          symbol2 &&
          symbol1 !== symbol2 &&
          !loading && (
            <div
              className="flex h-[450px] items-center justify-center rounded-xl border border-dashed border-slate-700"
              style={{
                background: "#1a1a2e",
                color: "#94a3b8",
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              Unable to load comparison data
            </div>
          )}
      </div>
    </div>
  );
}

export default Compare;
