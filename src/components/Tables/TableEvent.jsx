import { PropTypes } from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const TableEvent = ({ list }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;
  const navigate = useNavigate();

  // // Filtrer les éléments en fonction du terme de recherche
  const filteredList = list.filter(
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
        <h4 className="text-xl font-semibold text-black ">Event list</h4>
        <input
          type="text"
          placeholder="Rechercher un event..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full px-4 py-2 mb-4 border border-gray-200 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
        />
      </div>

      <div className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
        <div className="col-span-2 flex items-center">
          <p className="font-medium">Event Name</p>
        </div>
        <div className="col-span-1 hidden items-center sm:flex">
          <p className="font-medium">Date</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Épinglé</p>
        </div>
        <div className="col-span-2 flex items-center">
          <p className="font-medium">Location</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Actions</p>
        </div>
      </div>

      {currentItems.map((event, key) => (
        <div
          className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
          key={key}
        >
          <div className="col-span-2 flex items-center">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className=" rounded-md">
                <img
                  src={event.img}
                  alt="Product"
                  className="object-cover w-28"
                />
                <p className="text-sm text-black ">{event.title}</p>
              </div>
            </div>
          </div>
          <div className="col-span-1 hidden items-center sm:flex">
            <p className="text-sm text-black ">{event.startDate}</p>
          </div>
          <div className="col-span-1 hidden items-center sm:flex">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
              {event.pin ? "pin" : "none"}
            </span>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="text-sm text-black ">
              {event.subscriberDiscountText}
            </p>
          </div>
          <div className="col-span-2 flex items-center">
            <p className="text-sm ">{event.location}</p>
          </div>
          <div className="col-span-1 flex items-center">
            <button
              onClick={() => navigate(`/update-event/${key}`, { state: event })}
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

export default TableEvent;

TableEvent.propTypes = {
  list: PropTypes.array,
};
