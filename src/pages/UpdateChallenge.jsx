import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import DefaultLayout from "../layout/DefaultLayout";
import { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { ref, update } from "firebase/database";
import Alert from "../components/Alert/Alert";

const UpdateChallenge = () => {
  const navigate = useNavigate();
  let { id } = useParams();
  const location = useLocation();
  const [objectChallenge, setObjectChallenge] = useState(location.state);
  const [showAlert, setShowAlert] = useState(false);

  const setChallenge = () => {
    if (location.state.categories[0] != undefined) {
      update(ref(db, `/dataIHM/${location.state.categories[0]}/${id}/`), {
        ...objectChallenge,
        categories:
          location.state.categories[0] === "relationel"
            ? ["relationnel"]
            : location.state.categories[0],
        like: 0,
        unlike: 0,
      });
      setShowAlert(true);
      setTimeout(() => {
        navigate(`/dashboard`);
      }, 3000);
    } else {
      alert("Veuillez ajouter une categorie");
    }
  };

  return (
    <DefaultLayout>
      {showAlert && (
        <Alert
          message="Challenge updated successfully"
          type="success"
          description="Lorem Ipsum is simply dummy text of the printing and typesetting
            industry."
        />
      )}
      <Breadcrumb
        pageName={`challenge ${id} ${location.state.categories[0]}`}
      />
      <div className="grid grid-cols-1 gap-9">
        <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default">
            <div className="border-b border-stroke py-4 px-6.5">
              <h3 className="font-medium text-black ">Update challenge</h3>
            </div>
            <div className="p-6.5">
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black ">
                    Verset <span className="text-meta-1">*</span>
                  </label>
                  <input
                    value={location.state.verse}
                    type="text"
                    placeholder="Mathieu 2:11"
                    onChange={(e) => {
                      setObjectChallenge({
                        ...objectChallenge,
                        verse: e.target.value,
                      });
                    }}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="mb-2.5 block text-black ">
                  Content <span className="text-meta-1">*</span>
                </label>
                <textarea
                  rows={6}
                  value={location.state.verseText}
                  placeholder="Type your content"
                  onChange={(e) => {
                    setObjectChallenge({
                      ...objectChallenge,
                      verseText: e.target.value,
                    });
                  }}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
                ></textarea>
              </div>
              <div className="mb-6">
                <label className="mb-2.5 block text-black ">
                  Explication <span className="text-meta-1">*</span>
                </label>
                <textarea
                  rows={6}
                  onChange={(e) => {
                    setObjectChallenge({
                      ...objectChallenge,
                      verseDescription: e.target.value,
                    });
                  }}
                  value={location.state.verseDescription}
                  placeholder="Type your explication"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
                ></textarea>
              </div>
              <div className="mb-6">
                <label className="mb-2.5 block text-black ">
                  Challenge <span className="text-meta-1">*</span>
                </label>
                <textarea
                  rows={6}
                  onChange={(e) => {
                    setObjectChallenge({
                      ...objectChallenge,
                      challenge: e.target.value,
                    });
                  }}
                  value={location.state.challenge}
                  placeholder="Type your challenge"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
                ></textarea>
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black "> Category </label>

                <div className="relative z-20 bg-transparent">
                  <select
                    value={location.state.categories[0]}
                    onChange={(e) => {
                      setObjectChallenge({
                        ...objectChallenge,
                        categories: [e.target.value],
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
                <label className="mb-2.5 block text-black "> Points </label>

                <div className="relative z-20 bg-transparent">
                  <select
                    value={location.state.point ? location.state.point : ""}
                    onChange={(e) => {
                      setObjectChallenge({
                        ...objectChallenge,
                        point: parseInt(e.target.value, 10),
                      });
                    }}
                    className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary`}
                  >
                    <option
                      value=""
                      disabled
                      className="text-body dark:text-bodydark"
                    >
                      Select your points
                    </option>
                    <option value={6} className="text-body dark:text-bodydark">
                      6
                    </option>
                    <option value={8} className="text-body dark:text-bodydark">
                      8
                    </option>
                    <option value={9} className="text-body dark:text-bodydark">
                      9
                    </option>
                    <option value={12} className="text-body dark:text-bodydark">
                      12
                    </option>
                    <option value={15} className="text-body dark:text-bodydark">
                      15
                    </option>
                    <option value={17} className="text-body dark:text-bodydark">
                      17
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
                <label className="mb-2.5 block text-black "> Level </label>

                <div className="relative z-20 bg-transparent">
                  <select
                    value={location.state.level ? location.state.level : ""}
                    onChange={(e) => {
                      setObjectChallenge({
                        ...objectChallenge,
                        level: e.target.value,
                      });
                    }}
                    className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary`}
                  >
                    <option
                      value=""
                      disabled
                      className="text-body dark:text-bodydark"
                    >
                      Select your level
                    </option>
                    <option
                      value="bronze"
                      className="text-body dark:text-bodydark"
                    >
                      Bronze
                    </option>
                    <option
                      value="silver"
                      className="text-body dark:text-bodydark"
                    >
                      Silver
                    </option>
                    <option
                      value="gold"
                      className="text-body dark:text-bodydark"
                    >
                      Gold
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

              <button
                onClick={() => setChallenge()}
                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
              >
                Update challenge
              </button>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default UpdateChallenge;
