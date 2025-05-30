import ReactApexChart from "react-apexcharts";
import { PropTypes } from "prop-types";

const options = {
  chart: {
    fontFamily: "Satoshi, sans-serif",
    type: "donut",
  },
  colors: ["#3C50E0", "#6577F3", "#8FD0EF", "#0FADCF"],
  labels: ["Spiritualité", "Motivation", "Mental", "Relationnel"],
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

const ChartCategory = ({ series }) => {
  const isLoading = !series || !Array.isArray(series) || series.length < 4 || series.some((val) => isNaN(val));

  const categories = [
    { label: "Spiritualité", color: "bg-primary" },
    { label: "Motivation", color: "bg-[#6577F3]" },
    { label: "Mental", color: "bg-[#8FD0EF]" },
    { label: "Relationnel", color: "bg-[#0FADCF]" },
  ];

  return (
    <div className="sm:px-7.5 col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default xl:col-span-8">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          {isLoading ? (
            <div className="h-6 w-32 rounded bg-gray animate-pulse" />
          ) : (
            <h5 className="text-xl font-semibold text-black">
              Visitors Analytics
            </h5>
          )}
        </div>
        <div></div>
      </div>

      <div className="mb-2">
        <div id="chartThree" className="mx-auto flex justify-center">
          {isLoading ? (
            <div className="w-[220px] h-[220px] bg-gray rounded-full animate-pulse" />
          ) : (
            <ReactApexChart options={options} series={series} type="donut" />
          )}
        </div>
      </div>

      <div className="-mx-8 flex flex-wrap items-center justify-center gap-y-3">
        {categories.map((cat, index) => (
          <div className="sm:w-1/2 w-full px-8" key={index}>
            <div className="flex w-full items-center">
              <span className={`mr-2 block h-3 w-full max-w-3 rounded-full ${cat.color}`}></span>
              {isLoading ? (
                <div className="h-4 w-32 rounded bg-gray animate-pulse ml-2" />
              ) : (
                <p className="flex w-full justify-between text-sm font-medium text-black">
                  <span>{cat.label}</span>
                  <span>{series[index]}%</span>
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartCategory;

ChartCategory.propTypes = {
  series: PropTypes.array,
};