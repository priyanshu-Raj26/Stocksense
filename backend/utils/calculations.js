function dailyReturn(open, close) {
  if (!open || open === 0) return null;
  return parseFloat(((close - open) / open).toFixed(4));
}

function movingAverage(prices, window = 7) {
  if (prices.length < window) return null;
  const slice = prices.slice(prices.length - window);
  const sum = slice.reduce((acc, val) => acc + val, 0);
  return parseFloat((sum / window).toFixed(2));
}

function volatilityScore(returns) {
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance =
    returns.reduce((acc, r) => acc + Math.pow(r - mean, 2), 0) / returns.length;
  return parseFloat(Math.sqrt(variance).toFixed(4));
}

function pearsonCorrelation(arr1, arr2) {
  const n = Math.min(arr1.length, arr2.length);
  const mean1 = arr1.reduce((a, b) => a + b, 0) / n;
  const mean2 = arr2.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let den1 = 0;
  let den2 = 0;

  for (let i = 0; i < n; i++) {
    num += (arr1[i] - mean1) * (arr2[i] - mean2);
    den1 += Math.pow(arr1[i] - mean1, 2);
    den2 += Math.pow(arr2[i] - mean2, 2);
  }

  return parseFloat((num / Math.sqrt(den1 * den2)).toFixed(4));
}

module.exports = {
  dailyReturn,
  movingAverage,
  volatilityScore,
  pearsonCorrelation,
};
