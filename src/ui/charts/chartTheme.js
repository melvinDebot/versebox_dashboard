export const VERSEBOX_PALETTE = [
  "#D39E54",
  "#2C3E5C",
  "#C16A4D",
  "#6B82A3",
  "#956A33",
  "#DD8E76",
];

export const baseChartOptions = {
  chart: {
    fontFamily: '"Galano Grotesque", system-ui, sans-serif',
    toolbar: { show: false },
    zoom: { enabled: false },
    background: "transparent",
    foreColor: "currentColor",
  },
  dataLabels: { enabled: false },
  grid: {
    borderColor: "rgba(124, 120, 112, 0.15)",
    strokeDashArray: 3,
    padding: { left: 8, right: 8 },
  },
  legend: { show: false },
  tooltip: {
    theme: "light",
    style: { fontFamily: '"Galano Grotesque", sans-serif' },
  },
};
