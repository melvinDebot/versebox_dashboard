import ReactApexChart from "react-apexcharts";
import PropTypes from "prop-types";
import { useMemo } from "react";
import Skeleton from "../Skeleton";
import { VERSEBOX_PALETTE, baseChartOptions } from "./chartTheme";

const AreaChart = ({
  series,
  categories,
  colors = VERSEBOX_PALETTE,
  height = 280,
  loading = false,
  yMin,
  yMax,
}) => {
  const isLoading =
    loading ||
    !Array.isArray(series) ||
    !series[0]?.data ||
    series[0].data.length === 0;

  const options = useMemo(
    () => ({
      ...baseChartOptions,
      chart: { ...baseChartOptions.chart, type: "area", height },
      colors,
      stroke: { curve: "smooth", width: 3 },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.45,
          opacityTo: 0.05,
          stops: [0, 90, 100],
        },
      },
      markers: {
        size: 4,
        colors: ["#FFFFFF"],
        strokeColors: colors,
        strokeWidth: 2,
        hover: { sizeOffset: 3 },
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
        min: yMin,
        max: yMax,
        labels: {
          style: { fontFamily: '"Galano Grotesque", sans-serif', fontSize: "12px" },
        },
      },
    }),
    [categories, colors, height, yMin, yMax],
  );

  if (isLoading) {
    return <Skeleton shape="card" height={height} className="w-full" />;
  }

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="area"
      height={height}
    />
  );
};

AreaChart.propTypes = {
  series: PropTypes.array,
  categories: PropTypes.array,
  colors: PropTypes.arrayOf(PropTypes.string),
  height: PropTypes.number,
  loading: PropTypes.bool,
  yMin: PropTypes.number,
  yMax: PropTypes.number,
};

export default AreaChart;
