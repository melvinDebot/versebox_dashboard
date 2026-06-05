import ReactApexChart from "react-apexcharts";
import PropTypes from "prop-types";
import { useMemo } from "react";
import Skeleton from "../Skeleton";
import { VERSEBOX_PALETTE, baseChartOptions } from "./chartTheme";

const DonutChart = ({
  series,
  labels,
  colors = VERSEBOX_PALETTE,
  height = 240,
  showLegend = true,
  loading = false,
  centerLabel,
  centerValue,
}) => {
  const isLoading =
    loading ||
    !Array.isArray(series) ||
    series.length === 0 ||
    series.some((v) => Number.isNaN(v));

  const options = useMemo(
    () => ({
      ...baseChartOptions,
      chart: { ...baseChartOptions.chart, type: "donut" },
      colors,
      labels,
      stroke: { width: 0 },
      plotOptions: {
        pie: {
          donut: {
            size: "72%",
            background: "transparent",
            labels: {
              show: Boolean(centerLabel || centerValue),
              name: {
                show: Boolean(centerLabel),
                fontSize: "12px",
                fontWeight: 500,
                color: "currentColor",
                offsetY: 18,
              },
              value: {
                show: Boolean(centerValue !== undefined),
                fontSize: "28px",
                fontWeight: 600,
                color: "currentColor",
                offsetY: -10,
                formatter: () => centerValue ?? "",
              },
              total: {
                show: Boolean(centerLabel),
                label: centerLabel,
                color: "currentColor",
                formatter: () => centerValue ?? "",
              },
            },
          },
        },
      },
    }),
    [colors, labels, centerLabel, centerValue],
  );

  if (isLoading) {
    return (
      <div
        className="mx-auto flex items-center justify-center"
        style={{ height }}
      >
        <Skeleton shape="circle" width={height - 24} height={height - 24} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-[280px]">
        <ReactApexChart
          options={options}
          series={series}
          type="donut"
          height={height}
        />
      </div>
      {showLegend && labels && (
        <ul className="mt-4 grid w-full grid-cols-2 gap-x-4 gap-y-2">
          {labels.map((label, index) => (
            <li
              key={label}
              className="flex items-center justify-between text-body-sm text-ink-subtle"
            >
              <span className="flex items-center gap-2">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                {label}
              </span>
              <span className="font-medium text-ink">{series[index]}%</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

DonutChart.propTypes = {
  series: PropTypes.arrayOf(PropTypes.number),
  labels: PropTypes.arrayOf(PropTypes.string),
  colors: PropTypes.arrayOf(PropTypes.string),
  height: PropTypes.number,
  showLegend: PropTypes.bool,
  loading: PropTypes.bool,
  centerLabel: PropTypes.string,
  centerValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default DonutChart;
