import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import DefaultLayout from "../layout/DefaultLayout";
import { db } from "../../firebase";
import { ref, update } from "firebase/database";
import Alert from "../components/Alert/Alert";
import { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

import ChartLine from "../components/Chart/ChartLine";

const UpdateEvent = () => {
  let { id } = useParams();
  const location = useLocation();

  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();
  const [objectEvent, setObjectEvent] = useState(location.state);

  const setEvent = () => {
    if (objectEvent.title !== "") {
      update(ref(db, `/Events/${id}`), {
        ...objectEvent,
      });
      setShowAlert(true);
      setTimeout(() => {
        navigate(`/dashboard`);
      }, 2000);
    } else {
      alert("Veuillez ajouter une categorie");
    }
  };

  const extractDataFromEventClicksByDay = (eventObject) => {
    if (eventObject && eventObject.clicksByDay) {
      // Vérifie si clicksByDay est un objet et non null
      return Object.keys(eventObject.clicksByDay).map(
        (day) => eventObject.clicksByDay[day].data,
      );
    } else {
      console.error(
        "clicksByDay is not defined or is not an object:",
        eventObject,
      );
      return []; // Retourne un tableau vide si clicksByDay n'est pas un objet
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
      <Breadcrumb pageName="Create event" />
      <ChartLine
        series={[
          {
            name: objectEvent.title,
            data: extractDataFromEventClicksByDay(objectEvent),
          },
        ]}
      />
      <div className="grid grid-cols-1 gap-9 mt-9">
        <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default">
            <div className="border-b border-stroke py-4 px-6.5">
              <h3 className="font-medium text-black ">Update event {id}</h3>
            </div>
            <div className="p-6.5">
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full">
                  <label className="mb-2.5 block text-black ">
                    Name Event <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={objectEvent.title}
                    onChange={(e) => {
                      setObjectEvent({
                        ...objectEvent,
                        title: e.target.value,
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
                    Description <span className="text-meta-1">*</span>
                  </label>
                  <textarea
                    value={objectEvent.description}
                    rows={6}
                    onChange={(e) => {
                      setObjectEvent({
                        ...objectEvent,
                        description: e.target.value,
                      });
                    }}
                    type="text"
                    placeholder="Description"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
                  />
                </div>
              </div>

              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full">
                  <label className="mb-2.5 block text-black ">Link</label>
                  <input
                    type="text"
                    value={objectEvent.link}
                    onChange={(e) => {
                      setObjectEvent({
                        ...objectEvent,
                        link: e.target.value,
                      });
                    }}
                    placeholder="add link"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
                  />
                </div>
              </div>

              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full">
                  <label className="mb-2.5 block text-black ">
                    Link subscriber
                  </label>
                  <input
                    type="text"
                    value={objectEvent.subscriberDiscountLink}
                    onChange={(e) => {
                      setObjectEvent({
                        ...objectEvent,
                        subscriberDiscountLink: e.target.value,
                      });
                    }}
                    placeholder="add link subscriber"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
                  />
                </div>
              </div>

              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full">
                  <label className="mb-2.5 block text-black ">
                    Text subscriber <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={objectEvent.subscriberDiscountText}
                    onChange={(e) => {
                      setObjectEvent({
                        ...objectEvent,
                        subscriberDiscountText: e.target.value,
                      });
                    }}
                    placeholder="add text subscriber"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
                  />
                </div>
              </div>

              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full">
                  <label className="mb-2.5 block text-black ">
                    Location <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={objectEvent.location}
                    onChange={(e) => {
                      setObjectEvent({
                        ...objectEvent,
                        location: e.target.value,
                      });
                    }}
                    placeholder="add location"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
                  />
                </div>
              </div>

              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full">
                  <label className="mb-2.5 block text-black ">
                    start date <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="date"
                    value={objectEvent.startDate}
                    onChange={(e) => {
                      setObjectEvent({
                        ...objectEvent,
                        startDate: e.target.value,
                      });
                    }}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
                  />
                </div>
              </div>

              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full">
                  <label className="mb-2.5 block text-black ">
                    end date <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="date"
                    value={objectEvent.endDate}
                    onChange={(e) => {
                      setObjectEvent({
                        ...objectEvent,
                        endDate: e.target.value,
                      });
                    }}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
                  />
                </div>
              </div>

              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full">
                  <label className="mb-2.5 block text-black ">
                    Link img <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={objectEvent.img}
                    onChange={(e) => {
                      setObjectEvent({
                        ...objectEvent,
                        img: e.target.value,
                      });
                    }}
                    placeholder="add link img"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
                  />
                </div>
              </div>

              <button
                onClick={() => setEvent()}
                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
              >
                Update event
              </button>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default UpdateEvent;
