import ReactApexChart from "react-apexcharts";
import PropTypes from "prop-types";
import { useMemo } from "react";
import Skeleton from "../Skeleton";
import { VERSEBOX_PALETTE, baseChartOptions } from "./chartTheme";

const BarChart = ({
  series,
  categories,
  colors = VERSEBOX_PALETTE,
  height = 320,
  stacked = false,
  horizontal = false,
  loading = false,
  columnWidth = "40%",
  borderRadius = 8,
}) => {
  const isLoading =
    loading ||
    !Array.isArray(series) ||
    !Array.isArray(series[0]?.data) ||
    series[0].data.length === 0;

  const options = useMemo(
    () => ({
      ...baseChartOptions,
      chart: {
        ...baseChartOptions.chart,
        type: "bar",
        stacked,
        height,
      },
      colors,
      plotOptions: {
        bar: {
          horizontal,
          borderRadius,
          borderRadiusApplication: "end",
          columnWidth,
        },
      },
      xaxis: {
        categories,
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: {
          style: { fontFamily: '"Galano Grotesque", sans-serif', fontSize: "12px" },
        },
      },
      yaxis: {
        labels: {
          style: { fontFamily: '"Galano Grotesque", sans-serif', fontSize: "12px" },
        },
      },
      fill: { opacity: 1 },
    }),
    [categories, colors, stacked, horizontal, height, columnWidth, borderRadius],
  );

  if (isLoading) {
    return (
      <div className="flex items-end gap-4 px-2" style={{ height }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton
            key={i}
            className="flex-1"
            height={`${30 + (i % 4) * 18}%`}
          />
        ))}
      </div>
    );
  }

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="bar"
      height={height}
    />
  );
};

BarChart.propTypes = {
  series: PropTypes.array,
  categories: PropTypes.array,
  colors: PropTypes.arrayOf(PropTypes.string),
  height: PropTypes.number,
  stacked: PropTypes.bool,
  horizontal: PropTypes.bool,
  loading: PropTypes.bool,
  columnWidth: PropTypes.string,
  borderRadius: PropTypes.number,
};

export default BarChart;
