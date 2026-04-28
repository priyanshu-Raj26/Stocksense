const labelFont = { fontFamily: "'DM Sans', sans-serif" };
const numberFont = { fontFamily: "'JetBrains Mono', monospace" };

function formatDisplayValue(label, value) {
  if (value == null) {
    return "--";
  }

  if (label === "Volatility Score") {
    const volatilityValue = Number(value);

    if (volatilityValue < 0.01) {
      return `🟢 Low Volatility (${volatilityValue.toFixed(4)})`;
    }

    if (volatilityValue <= 0.025) {
      return `🟡 Moderate (${volatilityValue.toFixed(4)})`;
    }

    return `🔴 High Volatility (${volatilityValue.toFixed(4)})`;
  }

  return Number(value).toFixed(2);
}

function SummaryCard({ label, value }) {
  return (
    <div
      className="rounded-xl border border-slate-800 p-4"
      style={{ background: "#1a1a2e" }}
    >
      <p
        className="mb-2 text-xs uppercase tracking-wide"
        style={{ ...labelFont, color: "#e2e8f0" }}
      >
        {label}
      </p>
      <p
        className="text-lg font-semibold"
        style={{ ...numberFont, color: "#00d4aa" }}
      >
        {formatDisplayValue(label, value)}
      </p>
    </div>
  );
}

export default SummaryCard;
