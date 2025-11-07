import { useState } from "react";
import { PropTypes } from "prop-types";
import { useNavigate } from "react-router-dom";
import { db } from "../../../firebase";
import { ref, remove } from "firebase/database";

const TableUser = ({ list }) => {
  const [copiedUuid, setCopiedUuid] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;
  const navigate = useNavigate();

  const handleDelete = (path) => {
    // Créer une référence à l'objet avec le chemin spécifié dans Firebase
    const itemRef = ref(db, `users/${path}`);

    // Supprimer l'objet
    remove(itemRef)
      .then(() => {
        console.log("Suppression réussie!");
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression:", error);
      });
  };

  const confirmDelete = (path) => {
    // Afficher une boîte de dialogue de confirmation
    if (window.confirm("Voulez-vous vraiment supprimer cet élément ?")) {
      handleDelete(path);
    }
  };

  const handleCopy = (uuidUser) => {
    const copyText = document.getElementById(`npm-install-${uuidUser}`);
    navigator.clipboard
      .writeText(copyText.value)
      .then(() => {
        setCopiedUuid(uuidUser);
        setTimeout(() => setCopiedUuid(null), 2000); // Reset after 2 seconds
      })
      .catch((err) => console.error("Failed to copy!", err));
  };

  // // Filtrer les éléments en fonction du terme de recherche
  const filteredList = Object.values(list).filter(
    (item) =>
      item.user &&
      item.user.email &&
      item.user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Calculer l'index de début et de fin pour la pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);

  // Gérer le changement de page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default transition-colors duration-300 dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <input
          type="text"
          placeholder="Rechercher un email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full px-4 py-2 mb-4 border border-gray-200 rounded-md transition-colors duration-300 focus:outline-none focus:ring-primary focus:border-primary dark:border-strokedark dark:bg-boxdark-2 dark:text-white dark:placeholder:text-bodydark"
        />
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left transition-colors duration-300 dark:bg-boxdark-2">
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Email
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                name
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Streaks
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Points
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Uuid user
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Edit
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, key) => (
              <tr key={key}>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-bodydark">
                    {item.user.email}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-bodydark">
                    {item.user.nameUser}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                    {item.user.streaks || 0}
                  </span>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    {item.user.score || 0}
                  </span>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <div className="grid grid-cols-8 gap-2 w-full max-w-[23rem]">
                    <label className="sr-only">Label</label>
                    <input
                      id={`npm-install-${item.user.uuidUser}`}
                      type="text"
                      className="truncate col-span-6 bg-gray-50 border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-strokedark dark:bg-boxdark-2 dark:text-bodydark dark:placeholder:text-bodydark dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={item.user.uuidUser}
                      disabled
                    />
                    <button
                      onClick={() => handleCopy(item.user.uuidUser)}
                      data-copy-to-clipboard-target={item.user.uuidUser}
                      className={`col-span-2 text-white ${copiedUuid !== item.user.uuidUser ? "bg-blue-700" : "bg-green-700"} font-medium rounded-lg text-sm w-full sm:w-auto py-2.5 text-center items-center inline-flex justify-center`}
                    >
                      {copiedUuid !== item.user.uuidUser ? (
                        <span id="default-message">
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
                              d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z"
                            />
                          </svg>
                        </span>
                      ) : (
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
                            d="m4.5 12.75 6 6 9-13.5"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <button
                    onClick={() =>
                      navigate(`/update-user/${item.user.uuidUser}`, {
                        state: item.user,
                      })
                    }
                    type="button"
                    className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => confirmDelete(item.user.uuidUser)}
                    type="button"
                    className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                  >
                    Delete
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

export default TableUser;

TableUser.propTypes = {
  list: PropTypes.object,
};
