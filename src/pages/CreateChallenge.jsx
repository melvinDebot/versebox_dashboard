import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import DefaultLayout from "../layout/DefaultLayout";
import { useState } from "react";

const CreateChallenge = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedPoints] = useState(null);
  const [selectedLevel] = useState("");
  const [isOptionSelected, setIsOptionSelected] = useState(false);

  const changeTextColor = () => {
    setIsOptionSelected(true);
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Create challenge" />
      <div className="grid grid-cols-1 gap-9">
        <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default">
            <div className="border-b border-stroke py-4 px-6.5">
              <h3 className="font-medium text-black ">Create new challenge</h3>
            </div>
            <form action="#">
              <div className="p-6.5">
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black ">
                      Verset <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Mathieu 2:11"
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
                    placeholder="Type your content"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
                  ></textarea>
                </div>
                <div className="mb-6">
                  <label className="mb-2.5 block text-black ">
                    Explication <span className="text-meta-1">*</span>
                  </label>
                  <textarea
                    rows={6}
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
                    placeholder="Type your challenge"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
                  ></textarea>
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black "> Category </label>

                  <div className="relative z-20 bg-transparent">
                    <select
                      value={selectedOption}
                      onChange={(e) => {
                        setSelectedOption(e.target.value);
                        changeTextColor();
                      }}
                      className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary ${
                        isOptionSelected ? "text-black " : ""
                      }`}
                    >
                      <option
                        value=""
                        disabled
                        className="text-body dark:text-bodydark"
                      >
                        Select your category
                      </option>
                      <option
                        value="USA"
                        className="text-body dark:text-bodydark"
                      >
                        Motivation
                      </option>
                      <option
                        value="UK"
                        className="text-body dark:text-bodydark"
                      >
                        Relationnel
                      </option>
                      <option
                        value="Canada"
                        className="text-body dark:text-bodydark"
                      >
                        Mental
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
                      value={selectedPoints}
                      onChange={(e) => {
                        console.log(e.target.value);
                      }}
                      className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary ${
                        isOptionSelected ? "text-black " : ""
                      }`}
                    >
                      <option
                        value=""
                        disabled
                        className="text-body dark:text-bodydark"
                      >
                        Select your points
                      </option>
                      <option
                        value="USA"
                        className="text-body dark:text-bodydark"
                      >
                        1
                      </option>
                      <option
                        value="UK"
                        className="text-body dark:text-bodydark"
                      >
                        2
                      </option>
                      <option
                        value="Canada"
                        className="text-body dark:text-bodydark"
                      >
                        3
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
                      value={selectedLevel}
                      onChange={(e) => {
                        console.log(e.target.value);
                      }}
                      className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary ${
                        isOptionSelected ? "text-black " : ""
                      }`}
                    >
                      <option
                        value=""
                        disabled
                        className="text-body dark:text-bodydark"
                      >
                        Select your level
                      </option>
                      <option
                        value="USA"
                        className="text-body dark:text-bodydark"
                      >
                        bronze
                      </option>
                      <option
                        value="UK"
                        className="text-body dark:text-bodydark"
                      >
                        argent
                      </option>
                      <option
                        value="Canada"
                        className="text-body dark:text-bodydark"
                      >
                        gold
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

                <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                  Create challenge
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default CreateChallenge;
