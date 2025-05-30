import { useNavigate } from "react-router-dom";
import { PropTypes } from "prop-types";

const TableChallenge = ({ list }) => {
  const navigation = useNavigate();

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black  xl:pl-11">
                Category
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black ">
                Number Challenge
              </th>

              <th className="py-4 px-4 font-medium text-black ">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(list).map((item, key) => (
              <tr key={key}>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black ">
                    {Object.keys(list)[key]}
                  </h5>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black ">
                    {Object.values(list)[key].length}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <div className="flex items-center space-x-3.5">
                    <button
                      onClick={() =>
                        navigation(
                          `/tables-challenges/${Object.keys(list)[key]}`,
                        )
                      }
                      type="button"
                      className="flex gap-0.5 focus:outline-none text-white bg-sky-400 hover:bg-sky-500 focus:ring-4 focus:ring-sky-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
                    >
                      Voir
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableChallenge;

TableChallenge.propTypes = {
  list: PropTypes.array,
};
