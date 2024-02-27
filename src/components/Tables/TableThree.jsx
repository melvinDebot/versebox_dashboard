import { useState } from "react";
import { PropTypes } from "prop-types";

const TableThree = ({ list }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

  // // Filtrer les éléments en fonction du terme de recherche
  const filteredList = Object.values(list).filter(
    (item) =>
      item.user &&
      item.user.uuidUser &&
      item.user.uuidUser.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Calculer l'index de début et de fin pour la pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);

  // Gérer le changement de page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <input
          type="text"
          placeholder="Rechercher un verset..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full px-4 py-2 mb-4 border border-gray-200 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
        />
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black  xl:pl-11">
                Uuid
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black ">
                name
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black ">
                score
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, key) => (
              <tr key={key}>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black ">
                    {item.user.uuidUser}
                  </h5>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black ">{item.user.nameUser}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black ">{item.user.score}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from(
          { length: Math.ceil(filteredList.length / itemsPerPage) },
          (_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`px-3 py-1 font-medium border border-gray-300 rounded-md focus:outline-none ${currentPage === index + 1 ? "bg-primary text-white" : "hover:bg-gray-100"}`}
            >
              {index + 1}
            </button>
          ),
        )}
      </div>
    </div>
  );
};

export default TableThree;

TableThree.propTypes = {
  list: PropTypes.object,
}
