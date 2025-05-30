import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import DefaultLayout from "../layout/DefaultLayout";
import { db } from "../../firebase";
import { ref, update } from "firebase/database";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFirebase } from "../context/FirebaseContext";

const CreateEvent = () => {
  const [newEvent, setNewEvent] = useState({});
  const { events } = useFirebase();

  const navigate = useNavigate();

  const createEventToBdd = () => {
    if (
      newEvent.title &&
      newEvent.description &&
      newEvent.location &&
      newEvent.startDate &&
      newEvent.endDate &&
      newEvent.img
    ) {
      update(ref(db, `/Events/${events.length}`), {
        ...newEvent,
        link: newEvent.link || "",
        subscriberDiscountLink: newEvent.subscriberDiscountLink || "",
        subscriberDiscountText: newEvent.subscriberDiscountText || "",
        clicksByDay: [
          { day: "Dim", data: 0 },
          { day: "Lun", data: 0 },
          { day: "Mar", data: 0 },
          { day: "Mer", data: 0 },
          { day: "Jeu", data: 0 },
          { day: "Ven", data: 0 },
          { day: "Sam", data: 0 },
        ],
        clicks: 0,
        id: events.length,
      });
      alert("Event created successfully!");
      setTimeout(() => {
        navigate(`/dashboard`);
      }, 2000);
    } else {
      alert("Veuillez remplir tous les champs");
    }
  };
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Create event" />
      <div className="grid grid-cols-1 gap-9">
        <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default">
            <div className="border-b border-stroke py-4 px-6.5">
              <h3 className="font-medium text-black ">Create new event</h3>
            </div>
            <div className="p-6.5">
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full">
                  <label className="mb-2.5 block text-black ">
                    Name Event <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => {
                      setNewEvent({
                        ...newEvent,
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
                    value={newEvent.description}
                    rows={6}
                    onChange={(e) => {
                      setNewEvent({
                        ...newEvent,
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
                    value={newEvent.link}
                    onChange={(e) => {
                      setNewEvent({
                        ...newEvent,
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
                    value={newEvent.subscriberDiscountLink}
                    onChange={(e) => {
                      setNewEvent({
                        ...newEvent,
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
                    value={newEvent.subscriberDiscountText}
                    onChange={(e) => {
                      setNewEvent({
                        ...newEvent,
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
                    value={newEvent.location}
                    onChange={(e) => {
                      setNewEvent({
                        ...newEvent,
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
                    value={newEvent.startDate}
                    onChange={(e) => {
                      setNewEvent({
                        ...newEvent,
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
                    value={newEvent.endDate}
                    onChange={(e) => {
                      setNewEvent({
                        ...newEvent,
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
                    value={newEvent.img}
                    onChange={(e) => {
                      setNewEvent({
                        ...newEvent,
                        img: e.target.value,
                      });
                    }}
                    placeholder="add link img"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
                  />
                </div>
              </div>

              <button
                onClick={() => createEventToBdd()}
                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
              >
                Create event
              </button>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default CreateEvent;
