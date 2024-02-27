import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import DefaultLayout from "../layout/DefaultLayout";
import { db } from "../../firebase";
import { ref, update } from "firebase/database";
import Alert from "../components/Alert/Alert";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFirebase } from "../context/FirebaseContext";

const CreateEvent = () => {
  const [objectChallenge, setObjectChallenge] = useState({});
  const { events } = useFirebase();
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();
  const setEvent = () => {
    if (objectChallenge.title !== "") {
      update(ref(db, `/Events/${events.length}`), {
        ...objectChallenge,
        link: objectChallenge.link || "",
        subscriberDiscountLink: objectChallenge.subscriberDiscountLink || "",
        subscriberDiscountText: objectChallenge.subscriberDiscountText || "",
      });
      setShowAlert(true);
      setTimeout(() => {
        navigate(`/dashboard`);
      }, 2000);
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
                    value={objectChallenge.title}
                    onChange={(e) => {
                      setObjectChallenge({
                        ...objectChallenge,
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
                    value={objectChallenge.description}
                    rows={6}
                    onChange={(e) => {
                      setObjectChallenge({
                        ...objectChallenge,
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
                    value={objectChallenge.link}
                    onChange={(e) => {
                      setObjectChallenge({
                        ...objectChallenge,
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
                    value={objectChallenge.subscriberDiscountLink}
                    onChange={(e) => {
                      setObjectChallenge({
                        ...objectChallenge,
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
                    value={objectChallenge.subscriberDiscountText}
                    onChange={(e) => {
                      setObjectChallenge({
                        ...objectChallenge,
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
                    value={objectChallenge.location}
                    onChange={(e) => {
                      setObjectChallenge({
                        ...objectChallenge,
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
                    value={objectChallenge.startDate}
                    onChange={(e) => {
                      setObjectChallenge({
                        ...objectChallenge,
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
                    value={objectChallenge.endDate}
                    onChange={(e) => {
                      setObjectChallenge({
                        ...objectChallenge,
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
                    value={objectChallenge.img}
                    onChange={(e) => {
                      setObjectChallenge({
                        ...objectChallenge,
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
