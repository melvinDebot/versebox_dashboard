import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import DefaultLayout from "../layout/DefaultLayout";
import { db } from "../../firebase";
import { ref, update } from "firebase/database";
import { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

const UpdateUser = () => {
  let { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [objectUser, setObjectUser] = useState(location.state);

  const setUser = () => {
    if (objectUser.title !== "") {
      update(ref(db, `/users/${id}/user`), {
        ...objectUser,
      });
      alert("User updated successfully!");
      setTimeout(() => {
        navigate(`/dashboard`);
      }, 2000);
    } else {
      alert("Veuillez ajouter une categorie");
    }
  };

  const revertDateFormat = (dateString) => {
    // Vérifier si la chaîne de caractères est non vide
    if (!dateString) {
      return null;
    }

    // Séparer la date initiale en année, mois et jour
    const parts = dateString.split("-");

    // Vérifier si la date est valide (doit avoir trois parties)
    if (parts.length !== 3) {
      return null;
    }

    const year = parts[0];
    const month = parts[1];
    const day = parts[2];

    // Concaténer les parties dans le nouveau format "JJ/MM/AAAA"
    return `${day}/${month}/${year}`;
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="UPDATE USER" />
      <div className="grid grid-cols-1 gap-9">
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default">
            <div className="border-b border-stroke py-4 px-6.5">
              <h3 className="font-medium text-black ">Update user {id}</h3>
            </div>
            <div className="p-6.5">
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full">
                  <label className="mb-2.5 block text-black ">
                    Name User <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={objectUser.nameUser}
                    onChange={(e) => {
                      setObjectUser({
                        ...objectUser,
                        nameUser: e.target.value,
                      });
                    }}
                    placeholder="Name Event"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
                  />
                </div>
              </div>

              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full">
                  <label className="mb-2.5 block text-black ">
                    Avatar style
                  </label>
                  <input
                    type="text"
                    value={objectUser.avatarStyle}
                    onChange={(e) => {
                      setObjectUser({
                        ...objectUser,
                        avatarStyle: e.target.value,
                      });
                    }}
                    placeholder="add link"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
                  />
                </div>
              </div>

              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full">
                  <label className="mb-2.5 block text-black ">Date</label>
                  <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    type="date"
                    id="start"
                    name="trip-start"
                    onChange={(e) => {
                      setObjectUser({
                        ...objectUser,
                        dateOfTheDay: revertDateFormat(e.target.value),
                      });
                    }}
                  />
                </div>
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black "> Category </label>

                <div className="relative z-20 bg-transparent">
                  <select
                    value={objectUser.category}
                    onChange={(e) => {
                      setObjectUser({
                        ...objectUser,
                        category: [e.target.value],
                      });
                    }}
                    className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary `}
                  >
                    <option
                      value=""
                      disabled
                      className="text-body dark:text-bodydark"
                    >
                      Select your category
                    </option>
                    <option
                      value="amour"
                      className="text-body dark:text-bodydark"
                    >
                      Amour
                    </option>
                    <option
                      value="familial"
                      className="text-body dark:text-bodydark"
                    >
                      Familial
                    </option>
                    <option
                      value="finances"
                      className="text-body dark:text-bodydark"
                    >
                      Finances
                    </option>
                    <option
                      value="mental"
                      className="text-body dark:text-bodydark"
                    >
                      Mental
                    </option>
                    <option
                      value="motivation"
                      className="text-body dark:text-bodydark"
                    >
                      Motivation
                    </option>
                    <option
                      value="organisation"
                      className="text-body dark:text-bodydark"
                    >
                      Organisation
                    </option>
                    <option
                      value="relationel"
                      className="text-body dark:text-bodydark"
                    >
                      Relationnel
                    </option>
                    <option
                      value="santé"
                      className="text-body dark:text-bodydark"
                    >
                      Santé
                    </option>
                    <option
                      value="spiritualité"
                      className="text-body dark:text-bodydark"
                    >
                      Spiritualité
                    </option>
                  </select>

                  <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                    <svg
                      className="fill-current"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.8">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                          fill=""
                        ></path>
                      </g>
                    </svg>
                  </span>
                </div>
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black "> Cerified </label>
                <label
                  htmlFor="toggle3"
                  className="flex cursor-pointer select-none items-center"
                >
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="toggle3"
                      className="sr-only"
                      onChange={() => {
                        setObjectUser({
                          ...objectUser,
                          isCertified: !objectUser.isCertified,
                        });
                      }}
                    />
                    <div className="block h-8 w-14 rounded-full bg-meta-9 dark:bg-[#5A616B]"></div>
                    <div
                      className={`dot absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition ${
                        objectUser.isCertified &&
                        "!right-1 !translate-x-full !bg-primary dark:!bg-white"
                      }`}
                    >
                      <span
                        className={`hidden ${objectUser.isCertified && "!block"}`}
                      >
                        <svg
                          className="fill-white dark:fill-black"
                          width="11"
                          height="8"
                          viewBox="0 0 11 8"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                            fill=""
                            stroke=""
                            strokeWidth="0.4"
                          ></path>
                        </svg>
                      </span>
                      <span className={`${objectUser.isCertified && "hidden"}`}>
                        <svg
                          className="h-4 w-4 stroke-current"
                          fill="none"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                      </span>
                    </div>
                  </div>
                </label>
              </div>

              <button
                onClick={() => setUser()}
                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
              >
                Update user
              </button>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default UpdateUser;
