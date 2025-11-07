import { PropTypes } from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const TableProduct = ({ list }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [imageLoaded, setImageLoaded] = useState([]);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  // // Filtrer les éléments en fonction du terme de recherche
  const filteredList = Object.values(list).filter(
    (item) =>
      item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleImageLoad = (index) => {
    setImageLoaded((prev) => {
      const newImageLoaded = [...prev];
      newImageLoaded[index] = true;
      return newImageLoaded;
    });
  };

  // Calculer l'index de début et de fin pour la pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);

  // Gérer le changement de page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default transition-colors duration-300 dark:border-strokedark dark:bg-boxdark">
      <div className="py-6 px-4 md:px-6 xl:px-7.5">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Top Products
        </h4>
        <input
          type="text"
          placeholder="Rechercher un product..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full px-4 py-2 mb-4 border border-gray-200 rounded-md transition-colors duration-300 focus:outline-none focus:ring-primary focus:border-primary dark:border-strokedark dark:bg-boxdark-2 dark:text-white dark:placeholder:text-bodydark"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white transition-colors duration-300 dark:bg-boxdark">
          <thead>
            <tr className="w-full border-t border-stroke bg-gray-2 py-4.5 px-4 transition-colors duration-300 dark:border-strokedark dark:bg-boxdark-2 md:px-6 2xl:px-7.5">
              <th className="py-2 px-4 text-left font-medium text-black dark:text-white">
                Product Name
              </th>
              <th className="hidden py-2 px-4 text-left font-medium text-black dark:text-white sm:table-cell">
                Category
              </th>
              <th className="py-2 px-4 text-left font-medium text-black dark:text-white">
                Price
              </th>
              <th className="py-2 px-4 text-left font-medium text-black dark:text-white">
                Sold
              </th>
              <th className="py-2 px-4 text-left font-medium text-black dark:text-white">
                ID
              </th>
              <th className="py-2 px-4 text-left font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((product, key) => (
              <tr
                className="border-t border-stroke dark:border-strokedark"
                key={key}
              >
                <td className="py-2 px-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {!imageLoaded[key] && (
                      <div
                        role="status"
                        className="flex items-center justify-center h-56 max-w-sm rounded-lg animate-pulse bg-gray-700"
                      >
                        <svg
                          className="w-10 h-10 text-gray-200 dark:text-gray-600"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 16 20"
                        >
                          <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                          <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z" />
                        </svg>
                      </div>
                    )}
                    <img
                      src={product.img}
                      alt="Product"
                      className={`object-cover w-28 rounded-md ${imageLoaded[key] ? "block" : "hidden"}`}
                      onLoad={() => handleImageLoad(key)}
                    />

                    <p className="text-sm text-black dark:text-bodydark">
                      {product.title}
                    </p>
                  </div>
                </td>
                <td className="py-2 px-4 hidden sm:table-cell">
                  <p className="text-sm text-black dark:text-bodydark">
                    {product.category}
                  </p>
                </td>
                <td className="py-2 px-4">
                  <p className="text-sm text-black dark:text-bodydark">
                    {product.price}€
                  </p>
                </td>
                <td className="py-2 px-4">
                  <p className="text-sm text-meta-3">
                    {product.subcriberPrice}€
                  </p>
                </td>
                <td className="py-2 px-4">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400">
                    {product.id}
                  </span>
                </td>
                <td className="py-2 px-4">
                  <button
                    onClick={() =>
                      navigate(`/update-product/${key}`, { state: product })
                    }
                    type="button"
                    className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:focus:ring-yellow-900"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4 space-x-2 flex-wrap gap-5">
        {Array.from(
          { length: Math.ceil(filteredList.length / itemsPerPage) },
          (_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`px-3 py-1 font-medium border border-gray-300 rounded-md transition-colors duration-300 focus:outline-none dark:border-strokedark ${currentPage === index + 1 ? "bg-primary text-white" : "hover:bg-gray-100 dark:hover:bg-boxdark-2"}`}
            >
              {index + 1}
            </button>
          ),
        )}
      </div>
    </div>
  );
};

export default TableProduct;

TableProduct.propTypes = {
  list: PropTypes.array,
};
