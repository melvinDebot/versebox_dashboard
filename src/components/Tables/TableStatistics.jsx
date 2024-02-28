import { PropTypes } from "prop-types";

import { useState } from "react";

const TableStatistics = ({ numberUser, numberChallenge }) => {
  const [brandData] = useState([
    {
      name: "Challenge",
      visitors: numberChallenge,
      revenues: "3600",
    },
    {
      name: "Users",
      visitors: numberUser,
      revenues: "300",
    },
  ]);

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black ">Top Goals</h4>

      <div className="flex flex-col">
        <div className="grid grid-cols-3 rounded-sm bg-gray-2  sm:grid-cols-5">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Titre
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              actuels
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              goals
            </h5>
          </div>
        </div>

        {brandData.map((brand, key) => (
          <div
            className={`grid grid-cols-3 sm:grid-cols-5 ${
              key === brandData.length - 1
                ? ""
                : "border-b border-stroke dark:border-strokedark"
            }`}
            key={key}
          >
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              <p className="hidden text-black  sm:block">{brand.name}</p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black ">{brand.visitors}</p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-meta-3">{brand.revenues}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableStatistics;

TableStatistics.propTypes = {
  numberUser: PropTypes.number,
  numberChallenge: PropTypes.number,
};
