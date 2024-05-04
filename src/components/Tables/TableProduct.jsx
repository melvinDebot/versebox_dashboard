import { PropTypes } from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const TableProduct = ({ list }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;
  const navigate = useNavigate();

  // // Filtrer les éléments en fonction du terme de recherche
  const filteredList = Object.values(list).filter(
    (item) =>
      item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Calculer l'index de début et de fin pour la pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);

  // Gérer le changement de page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default">
      <div className="py-6 px-4 md:px-6 xl:px-7.5">
        <h4 className="text-xl font-semibold text-black ">Top Products</h4>
        <input
          type="text"
          placeholder="Rechercher un product..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full px-4 py-2 mb-4 border border-gray-200 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
        />
      </div>

      <div className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
        <div className="col-span-3 flex items-center">
          <p className="font-medium">Product Name</p>
        </div>
        <div className="col-span-2 hidden items-center sm:flex">
          <p className="font-medium">Category</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Price</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Sold</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Actions</p>
        </div>
      </div>

      {currentItems.map((product, key) => (
        <div
          className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
          key={key}
        >
          <div className="col-span-3 flex items-center">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className=" rounded-md">
                <img src={product.img} alt="Product" className="object-cover" />
              </div>
              <p className="text-sm text-black ">{product.title}</p>
            </div>
          </div>
          <div className="col-span-2 hidden items-center sm:flex">
            <p className="text-sm text-black ">{product.category}</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="text-sm text-black ">{product.price}€</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="text-sm text-meta-3 ">{product.subcriberPrice}€</p>
          </div>
          <div className="col-span-1 flex items-center">
            <button
              onClick={() =>
                navigate(`/update-product/${key}`, { state: product })
              }
              type="button"
              className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
            >
              Edit
            </button>
          </div>
        </div>
      ))}
      <div className="flex justify-center mt-4 space-x-2 flex-wrap gap-5">
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

export default TableProduct;

TableProduct.propTypes = {
  list: PropTypes.array,
};
