import ReactApexChart from "react-apexcharts";
import { PropTypes } from "prop-types";

const options = {
  chart: {
    fontFamily: "Satoshi, sans-serif",
    type: "donut",
  },
  colors: ["#21B7EC", "#106EE3"],
  labels: ["Homme", "Femme"],
  legend: {
    show: false,
    position: "bottom",
  },
  plotOptions: {
    pie: {
      donut: {
        size: "65%",
        background: "transparent",
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  responsive: [
    {
      breakpoint: 2600,
      options: {
        chart: {
          width: 380,
        },
      },
    },
    {
      breakpoint: 640,
      options: {
        chart: {
          width: 200,
        },
      },
    },
  ],
};

const ChartGender = ({ series }) => {
  const loading =
    !series ||
    !Array.isArray(series) ||
    series.length < 2 ||
    series.some((val) => isNaN(val));

  return (
    <div className="sm:px-7.5 col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default transition-colors duration-300 xl:col-span-8">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          {loading ? (
            <div className="h-6 w-28 rounded bg-gray animate-pulse" />
          ) : (
            <h5 className="text-xl font-semibold text-black transition-colors duration-300">
              Gender User
            </h5>
          )}
        </div>
        <div></div>
      </div>

      <div className="mb-2">
        <div
          id="chartThree"
          className="mx-auto flex justify-center min-h-[250px] items-center"
        >
          {loading ? (
            <div className="w-full h-[250px] bg-gray rounded animate-pulse" />
          ) : (
            <ReactApexChart options={options} series={series} type="donut" />
          )}
        </div>
      </div>

      <div className="-mx-8 flex flex-wrap items-center justify-center gap-y-3">
        <div className="sm:w-1/2 w-full px-8">
          <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#21B7EC]"></span>
            <p className="flex w-full justify-between text-sm font-medium text-black transition-colors duration-300">
              <span> Homme </span>
              <span>{loading ? "--" : `${series[0]}%`}</span>
            </p>
          </div>
        </div>
        <div className="sm:w-1/2 w-full px-8">
          <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#106EE3]"></span>
            <p className="flex w-full justify-between text-sm font-medium text-black transition-colors duration-300">
              <span> Femme </span>
              <span>{loading ? "--" : `${series[1]}%`}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartGender;

ChartGender.propTypes = {
  series: PropTypes.array,
};
