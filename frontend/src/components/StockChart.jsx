import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useSelector } from "react-redux";

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

function StockChart() {
  const { stockData } = useSelector((state) => state.stock);

  if (!stockData.length) {
    return (
      <div
        className="flex h-[400px] items-center justify-center rounded-xl border border-slate-800"
        style={{ background: "#1a1a2e" }}
      >
        <p className="text-sm text-slate-400" style={labelFont}>
          Select a company to view chart
        </p>
      </div>
    );
  }

  const labels = stockData.map((point) => {
    const date = new Date(point.date);
    return date.toLocaleDateString("en-US", { day: "2-digit", month: "short" });
  });
  const closeSeries = stockData.map((point) => point.close);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Close Price",
        data: closeSeries,
        tension: 0.4,
        borderColor: "#00d4aa",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: "#00d4aa",
        fill: true,
        backgroundColor: (context) => {
          const { chart } = context;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            return "rgba(0, 212, 170, 0.20)";
          }

          const gradient = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom,
          );
          gradient.addColorStop(0, "rgba(0, 212, 170, 0.35)");
          gradient.addColorStop(1, "rgba(0, 212, 170, 0.02)");
          return gradient;
        },
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        displayColors: false,
        backgroundColor: "#121724",
        titleColor: "#e2e8f0",
        bodyColor: "#e2e8f0",
        callbacks: {
          title: (items) => `Date: ${items[0].label}`,
          label: (context) => {
            const point = stockData[context.dataIndex];
            const close = Number(point.close).toFixed(2);
            const dailyReturn =
              point.daily_return == null
                ? "--"
                : `${(Number(point.daily_return) * 100).toFixed(2)}%`;
            return `Close: ${close} | Return: ${dailyReturn}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#94a3b8",
          maxTicksLimit: 8,
          font: {
            family: "DM Sans",
          },
        },
        grid: {
          color: "rgba(148, 163, 184, 0.09)",
        },
      },
      y: {
        ticks: {
          color: "#94a3b8",
          callback: (value) => Number(value).toFixed(0),
          font: {
            family: "JetBrains Mono",
          },
        },
        grid: {
          color: "rgba(148, 163, 184, 0.09)",
        },
      },
    },
  };

  return (
    <div
      className="h-[400px] rounded-xl border border-slate-800 p-4"
      style={{ background: "#1a1a2e" }}
    >
      <p className="mb-3 text-sm text-slate-200" style={labelFont}>
        Price Trend
      </p>
      <div className="h-[330px]" style={numberFont}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}

export default StockChart;
