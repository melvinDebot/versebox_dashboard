import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import DefaultLayout from "../layout/DefaultLayout";
import { db } from "../../firebase";
import { ref, update } from "firebase/database";
import { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

import ChartLine from "../components/Chart/ChartLine";

const UpdateProduct = () => {
  let { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [objectProduct, setObjectProduct] = useState(location.state);

  const setProduct = () => {
    if (objectProduct.title !== "") {
      update(ref(db, `/Store/${id}`), {
        ...objectProduct,
      });
      alert("Product updated");
      setTimeout(() => {
        navigate(`/dashboard`);
      }, 2000);
    } else {
      alert("Veuillez ajouter une categorie");
    }
  };

  const extractDataFromEventClicksByDay = (productObject) => {
    if (productObject && productObject.clicksByDay) {
      // Vérifie si clicksByDay est un objet et non null
      return Object.keys(productObject.clicksByDay).map(
        (day) => productObject.clicksByDay[day].data,
      );
    } else {
      console.error(
        "clicksByDay is not defined or is not an object:",
        productObject,
      );
      return []; // Retourne un tableau vide si clicksByDay n'est pas un objet
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Update Product" />
      <ChartLine
        series={[
          {
            name: objectProduct.title,
            data: extractDataFromEventClicksByDay(objectProduct),
          },
        ]}
      />
      <div className="grid grid-cols-1 gap-9">
        <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default">
            <div className="border-b border-stroke py-4 px-6.5">
              <h3 className="font-medium text-black ">Update product {id}</h3>
            </div>
            <div className="p-6.5">
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full">
                  <label className="mb-2.5 block text-black ">
                    Title <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={objectProduct.title}
                    onChange={(e) => {
                      setObjectProduct({
                        ...objectProduct,
                        title: e.target.value,
                      });
                    }}
                    placeholder="add a title"
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
                    rows={6}
                    value={objectProduct.description}
                    onChange={(e) => {
                      setObjectProduct({
                        ...objectProduct,
                        description: e.target.value,
                      });
                    }}
                    type="text"
                    placeholder="add a description"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
                  />
                </div>
              </div>

              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full">
                  <label className="mb-2.5 block text-black ">
                    Link <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={objectProduct.link}
                    onChange={(e) => {
                      setObjectProduct({
                        ...objectProduct,
                        link: e.target.value,
                      });
                    }}
                    placeholder="add a link product"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
                  />
                </div>
              </div>

              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full">
                  <label className="mb-2.5 block text-black ">
                    Link subscriber <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={objectProduct.subscriberDiscountLink}
                    onChange={(e) => {
                      setObjectProduct({
                        ...objectProduct,
                        subscriberDiscountLink: e.target.value,
                      });
                    }}
                    placeholder="add a link subscriber"
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
                    value={objectProduct.subscriberDiscountText}
                    onChange={(e) => {
                      setObjectProduct({
                        ...objectProduct,
                        subscriberDiscountText: e.target.value,
                      });
                    }}
                    placeholder="add a text subscriber"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
                  />
                </div>
              </div>

              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full">
                  <label className="mb-2.5 block text-black ">
                    Price <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    defaultValue={objectProduct.price}
                    onChange={(e) => {
                      setObjectProduct({
                        ...objectProduct,
                        price: parseFloat(e.target.value),
                      });
                    }}
                    placeholder="add a price"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
                  />
                </div>
              </div>

              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full">
                  <label className="mb-2.5 block text-black ">
                    Price Subscriber <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    defaultValue={objectProduct.subcriberPrice}
                    onChange={(e) => {
                      setObjectProduct({
                        ...objectProduct,
                        subcriberPrice: parseFloat(e.target.value),
                      });
                    }}
                    placeholder="add a price subscriber"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
                  />
                </div>
              </div>
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full">
                  <label className="mb-2.5 block text-black ">
                    Score User <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="number"
                    value={objectProduct.score}
                    onChange={(e) => {
                      setObjectProduct({
                        ...objectProduct,
                        score: parseInt(e.target.value, 10),
                      });
                    }}
                    placeholder="add a score user"
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
                    value={objectProduct.img}
                    onChange={(e) => {
                      setObjectProduct({
                        ...objectProduct,
                        img: e.target.value,
                      });
                    }}
                    placeholder="add a link img"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
                  />
                </div>
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black "> Category </label>

                <div className="relative z-20 bg-transparent">
                  <select
                    onChange={(e) => {
                      setObjectProduct({
                        ...objectProduct,
                        category: e.target.value,
                      });
                    }}
                    value={objectProduct.category}
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
                      value="music"
                      className="text-body dark:text-bodydark"
                    >
                      Music
                    </option>
                    <option
                      value="games"
                      className="text-body dark:text-bodydark"
                    >
                      Games
                    </option>
                    <option
                      value="books"
                      className="text-body dark:text-bodydark"
                    >
                      Books
                    </option>
                    <option
                      value="clothes"
                      className="text-body dark:text-bodydark"
                    >
                      Vetements
                    </option>
                    <option
                      value="bag"
                      className="text-body dark:text-bodydark"
                    >
                      Sacs
                    </option>
                    <option
                      value="various"
                      className="text-body dark:text-bodydark"
                    >
                      Divers
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
                onClick={() => setProduct()}
                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
              >
                update product
              </button>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default UpdateProduct;
