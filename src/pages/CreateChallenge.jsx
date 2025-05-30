import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import DefaultLayout from "../layout/DefaultLayout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFirebase } from "../context/FirebaseContext";
import { db } from "../../firebase";
import { ref, update } from "firebase/database";
import Alert from "../components/Alert/Alert";

const CreateChallenge = () => {
  const { data } = useFirebase();
  const navigate = useNavigate();
  const [newChallenge, setNewChallenge] = useState({});
  const [showAlert, setShowAlert] = useState(false);

  const createChallengeToBdd = () => {
    if (
      newChallenge.verse &&
      newChallenge.verseText &&
      newChallenge.verseDescription &&
      newChallenge.challenge &&
      newChallenge.point &&
      newChallenge.level &&
      newChallenge.categories &&
      newChallenge.categories.length > 0
    ) {
      update(
        ref(
          db,
          `/dataIHM/${newChallenge.categories[0]}/${data[newChallenge.categories[0]].length}/`,
        ),
        {
          ...newChallenge,
          categories:
            newChallenge?.categories[0] === "relationel"
              ? ["relationnel"]
              : [newChallenge.categories[0]],
          like: 0,
          unlike: 0,
        },
      );
      setShowAlert(true);
      setTimeout(() => {
        navigate(`/dashboard`);
      }, 3000);
    } else {
      alert("Veuillez remplir tous les champs");
    }
  };

  return (
    <DefaultLayout>
      {showAlert && (
        <Alert
          message="Challenge updated successfully"
          type="success"
          show={showAlert}
          description="Your challenge has been updated successfully. You will be redirected to the dashboard in a few seconds.."
        />
      )}
      <Breadcrumb pageName="Create challenge" />
      <div className="grid grid-cols-1 gap-9">
        <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default">
            <div className="border-b border-stroke py-4 px-6.5">
              <h3 className="font-medium text-black ">Create new challenge</h3>
            </div>
            <div className="p-6.5">
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black ">
                    Verset <span className="text-meta-1">*</span>
                  </label>
                  <input
                    value={newChallenge.verse}
                    type="text"
                    placeholder="Mathieu 2:11"
                    onChange={(e) => {
                      setNewChallenge({
                        ...newChallenge,
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
                  value={newChallenge.verseText}
                  placeholder="Type your content"
                  onChange={(e) => {
                    setNewChallenge({
                      ...newChallenge,
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
                    setNewChallenge({
                      ...newChallenge,
                      verseDescription: e.target.value,
                    });
                  }}
                  value={newChallenge.verseDescription}
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
                    setNewChallenge({
                      ...newChallenge,
                      challenge: e.target.value,
                    });
                  }}
                  value={newChallenge.challenge}
                  placeholder="Type your challenge"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
                ></textarea>
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black "> Category </label>

                <div className="relative z-20 bg-transparent">
                  <select
                    onChange={(e) => {
                      setNewChallenge({
                        ...newChallenge,
                        categories: [e.target.value],
                      });
                    }}
                    className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary `}
                  >
                    <option value="" className="text-body dark:text-bodydark">
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
                    <option
                      value="professionnel"
                      className="text-body dark:text-bodydark"
                    >
                      Professionnel
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
                    value={newChallenge.point}
                    onChange={(e) => {
                      setNewChallenge({
                        ...newChallenge,
                        point: parseInt(e.target.value, 10),
                      });
                    }}
                    className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary`}
                  >
                    <option value="" className="text-body dark:text-bodydark">
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
                <label className="mb-2.5 block text-black"> Level </label>

                <div className="relative z-20 bg-transparent">
                  <select
                    value={newChallenge.level}
                    onChange={(e) => {
                      setNewChallenge({
                        ...newChallenge,
                        level: e.target.value,
                      });
                    }}
                    className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary`}
                  >
                    <option value="" className="text-body dark:text-bodydark">
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
                onClick={() => createChallengeToBdd()}
                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
              >
                Create challenge
              </button>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default CreateChallenge;
