import CardDataStats from "../components/Card/CardDataStats";
import ChartThree from "../components/Chart/ChartCategory";
import ChartGender from "../components/Chart/ChartGender";
import ChartAge from "../components/Chart/ChartAge";
import DefaultLayout from "../layout/DefaultLayout";
import { useFirebase } from "../context/FirebaseContext";
import TableChallenge from "../components/Tables/TableChallenge";
import { db } from "../../firebase";
import { ref, update } from "firebase/database";

const Dashboard = () => {
  const { data, users, events, store, dataNavBar, getListCodes } =
    useFirebase();

  const TotalData = () => {
    let number = 0;
    Object.values(data).map((item) => {
      number = number + item.length;
    });

    return number;
  };

  function countUsersByCategory(users) {
    const categoriesCount = {};

    // Parcourir tous les utilisateurs
    Object.values(users).forEach((user) => {
      const category = user.user.category;

      // Vérifier si la catégorie existe déjà dans le compteur, sinon initialiser à zéro
      if (!categoriesCount[category]) {
        categoriesCount[category] = 0;
      }

      // Incrémenter le compteur pour cette catégorie
      categoriesCount[category]++;
    });

    // Créer un tableau des nombres d'utilisateurs par catégorie
    const countsArray = Object.values(categoriesCount);

    return countsArray;
  }

  function countGenders(usersArray) {
    let maleCount = 0;
    let femaleCount = 0;

    // Parcourir chaque objet dans le tableau
    usersArray.forEach((userObject) => {
      // Accéder à l'objet utilisateur et vérifier le champ 'gender'
      if (userObject.user.gender === "man") {
        maleCount++; // Incrémenter le compteur pour les hommes
      } else if (userObject.user.gender === "women") {
        femaleCount++; // Incrémenter le compteur pour les femmes
      }
    });

    // Retourner un tableau avec les deux compteurs
    return [maleCount, femaleCount];
  }

  function calculateAgeRanges(usersArray) {
    const yearCounts = {};

    // Parcourir chaque utilisateur pour compter les années de naissance
    usersArray.forEach((userObject) => {
      const birthDate = userObject.user.age;
      if (birthDate) {
        const year = new Date(birthDate).getFullYear();
        if (yearCounts[year]) {
          yearCounts[year]++;
        } else {
          yearCounts[year] = 1;
        }
      }
    });

    // Transformer l'objet yearCounts en un tableau d'objets
    const yearData = Object.keys(yearCounts).map((year) => ({
      year: parseInt(year, 10),
      count: yearCounts[year],
    }));

    // Calculer l'âge actuel des utilisateurs
    const currentYear = new Date().getFullYear();
    const ageRanges = [0, 0, 0, 0]; // [15-17, 18-25, 26-35, 36-40]

    yearData.forEach(({ year, count }) => {
      const age = currentYear - year;
      if (age >= 15 && age <= 17) {
        ageRanges[0] += count;
      } else if (age >= 18 && age <= 25) {
        ageRanges[1] += count;
      } else if (age >= 26 && age <= 35) {
        ageRanges[2] += count;
      } else if (age >= 36 && age <= 40) {
        ageRanges[3] += count;
      }
    });

    // Créer le tableau d'objet pour le résultat final
    return [{ name: "âge", data: ageRanges }];
  }

  const counts = countUsersByCategory(users);

  const toggleEventCard = () => {
    const eventCardRef = ref(db, "isActiveGame");
    update(eventCardRef, { isActiveEvent: !dataNavBar.isActiveEvent });
  };

  const toggleStoreCard = () => {
    const storeCardRef = ref(db, "isActiveGame");
    update(storeCardRef, { isActiveStore: !dataNavBar.isActiveStore });
  };

  const activeGameCard = () => {
    const gameCardRef = ref(db, "isActiveGame");
    update(gameCardRef, { isActivated: !dataNavBar.isActivated });
  };

  return (
    <DefaultLayout>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats
          title="Total users"
          total={Object.values(users).length}
          rate="0.43%"
          levelUp
        >
          <svg
            className="fill-primary "
            width="22"
            height="18"
            viewBox="0 0 22 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.18418 8.03751C9.31543 8.03751 11.0686 6.35313 11.0686 4.25626C11.0686 2.15938 9.31543 0.475006 7.18418 0.475006C5.05293 0.475006 3.2998 2.15938 3.2998 4.25626C3.2998 6.35313 5.05293 8.03751 7.18418 8.03751ZM7.18418 2.05626C8.45605 2.05626 9.52168 3.05313 9.52168 4.29063C9.52168 5.52813 8.49043 6.52501 7.18418 6.52501C5.87793 6.52501 4.84668 5.52813 4.84668 4.29063C4.84668 3.05313 5.9123 2.05626 7.18418 2.05626Z"
              fill=""
            />
            <path
              d="M15.8124 9.6875C17.6687 9.6875 19.1468 8.24375 19.1468 6.42188C19.1468 4.6 17.6343 3.15625 15.8124 3.15625C13.9905 3.15625 12.478 4.6 12.478 6.42188C12.478 8.24375 13.9905 9.6875 15.8124 9.6875ZM15.8124 4.7375C16.8093 4.7375 17.5999 5.49375 17.5999 6.45625C17.5999 7.41875 16.8093 8.175 15.8124 8.175C14.8155 8.175 14.0249 7.41875 14.0249 6.45625C14.0249 5.49375 14.8155 4.7375 15.8124 4.7375Z"
              fill=""
            />
            <path
              d="M15.9843 10.0313H15.6749C14.6437 10.0313 13.6468 10.3406 12.7874 10.8563C11.8593 9.61876 10.3812 8.79376 8.73115 8.79376H5.67178C2.85303 8.82814 0.618652 11.0625 0.618652 13.8469V16.3219C0.618652 16.975 1.13428 17.4906 1.7874 17.4906H20.2468C20.8999 17.4906 21.4499 16.9406 21.4499 16.2875V15.4625C21.4155 12.4719 18.9749 10.0313 15.9843 10.0313ZM2.16553 15.9438V13.8469C2.16553 11.9219 3.74678 10.3406 5.67178 10.3406H8.73115C10.6562 10.3406 12.2374 11.9219 12.2374 13.8469V15.9438H2.16553V15.9438ZM19.8687 15.9438H13.7499V13.8469C13.7499 13.2969 13.6468 12.7469 13.4749 12.2313C14.0937 11.7844 14.8499 11.5781 15.6405 11.5781H15.9499C18.0812 11.5781 19.8343 13.3313 19.8343 15.4625V15.9438H19.8687Z"
              fill=""
            />
          </svg>
        </CardDataStats>
        <CardDataStats
          title="Total Challenge"
          total={TotalData()}
          rate="4.35%"
          levelUp
        >
          <svg
            className="fill-primary "
            width="20"
            height="22"
            viewBox="0 0 20 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.7531 16.4312C10.3781 16.4312 9.27808 17.5312 9.27808 18.9062C9.27808 20.2812 10.3781 21.3812 11.7531 21.3812C13.1281 21.3812 14.2281 20.2812 14.2281 18.9062C14.2281 17.5656 13.0937 16.4312 11.7531 16.4312ZM11.7531 19.8687C11.2375 19.8687 10.825 19.4562 10.825 18.9406C10.825 18.425 11.2375 18.0125 11.7531 18.0125C12.2687 18.0125 12.6812 18.425 12.6812 18.9406C12.6812 19.4219 12.2343 19.8687 11.7531 19.8687Z"
              fill=""
            />
            <path
              d="M5.22183 16.4312C3.84683 16.4312 2.74683 17.5312 2.74683 18.9062C2.74683 20.2812 3.84683 21.3812 5.22183 21.3812C6.59683 21.3812 7.69683 20.2812 7.69683 18.9062C7.69683 17.5656 6.56245 16.4312 5.22183 16.4312ZM5.22183 19.8687C4.7062 19.8687 4.2937 19.4562 4.2937 18.9406C4.2937 18.425 4.7062 18.0125 5.22183 18.0125C5.73745 18.0125 6.14995 18.425 6.14995 18.9406C6.14995 19.4219 5.73745 19.8687 5.22183 19.8687Z"
              fill=""
            />
            <path
              d="M19.0062 0.618744H17.15C16.325 0.618744 15.6031 1.23749 15.5 2.06249L14.95 6.01562H1.37185C1.0281 6.01562 0.684353 6.18749 0.443728 6.46249C0.237478 6.73749 0.134353 7.11562 0.237478 7.45937C0.237478 7.49374 0.237478 7.49374 0.237478 7.52812L2.36873 13.9562C2.50623 14.4375 2.9531 14.7812 3.46873 14.7812H12.9562C14.2281 14.7812 15.3281 13.8187 15.5 12.5469L16.9437 2.26874C16.9437 2.19999 17.0125 2.16562 17.0812 2.16562H18.9375C19.35 2.16562 19.7281 1.82187 19.7281 1.37499C19.7281 0.928119 19.4187 0.618744 19.0062 0.618744ZM14.0219 12.3062C13.9531 12.8219 13.5062 13.2 12.9906 13.2H3.7781L1.92185 7.56249H14.7094L14.0219 12.3062Z"
              fill=""
            />
          </svg>
        </CardDataStats>
        <CardDataStats
          title="Total Product"
          total={Object.values(store).length}
          rate="2.59%"
          levelUp
        >
          <svg
            className="fill-primary "
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21.1063 18.0469L19.3875 3.23126C19.2157 1.71876 17.9438 0.584381 16.3969 0.584381H5.56878C4.05628 0.584381 2.78441 1.71876 2.57816 3.23126L0.859406 18.0469C0.756281 18.9063 1.03128 19.7313 1.61566 20.3844C2.20003 21.0375 2.99066 21.3813 3.85003 21.3813H18.1157C18.975 21.3813 19.8 21.0031 20.35 20.3844C20.9 19.7656 21.2094 18.9063 21.1063 18.0469ZM19.2157 19.3531C18.9407 19.6625 18.5625 19.8344 18.15 19.8344H3.85003C3.43753 19.8344 3.05941 19.6625 2.78441 19.3531C2.50941 19.0438 2.37191 18.6313 2.44066 18.2188L4.12503 3.43751C4.19378 2.71563 4.81253 2.16563 5.56878 2.16563H16.4313C17.1532 2.16563 17.7719 2.71563 17.875 3.43751L19.5938 18.2531C19.6282 18.6656 19.4907 19.0438 19.2157 19.3531Z"
              fill=""
            />
            <path
              d="M14.3345 5.29375C13.922 5.39688 13.647 5.80938 13.7501 6.22188C13.7845 6.42813 13.8189 6.63438 13.8189 6.80625C13.8189 8.35313 12.547 9.625 11.0001 9.625C9.45327 9.625 8.1814 8.35313 8.1814 6.80625C8.1814 6.6 8.21577 6.42813 8.25015 6.22188C8.35327 5.80938 8.07827 5.39688 7.66577 5.29375C7.25327 5.19063 6.84077 5.46563 6.73765 5.87813C6.6689 6.1875 6.63452 6.49688 6.63452 6.80625C6.63452 9.2125 8.5939 11.1719 11.0001 11.1719C13.4064 11.1719 15.3658 9.2125 15.3658 6.80625C15.3658 6.49688 15.3314 6.1875 15.2626 5.87813C15.1595 5.46563 14.747 5.225 14.3345 5.29375Z"
              fill=""
            />
          </svg>
        </CardDataStats>
        <CardDataStats
          title="Total Events"
          total={Object.values(events).length}
          rate="0.95%"
          levelDown
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            strokeWidth="1.5"
            stroke="currentColor"
            className="fill-primary"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
            />
          </svg>
        </CardDataStats>
      </div>

      <div className="rounded-sm border border-stroke bg-white shadow-default my-3">
        <div className="border-b border-stroke py-4 px-6.5">
          <h3 className="font-medium text-black">Game in the app</h3>
        </div>
        <div className="flex flex-row flex-wrap gap-5.5 p-6.5 justify-between">
          <div className="flex flex-col items-center">
            <label className="inline-flex items-center me-5 cursor-pointer">
              <input
                type="checkbox"
                value={dataNavBar.isActivated}
                className="sr-only peer"
                checked={dataNavBar.isActivated || false}
                onChange={() => activeGameCard()}
              />
              <div
                style={{ backgroundColor: "grey" }}
                className="relative w-11 h-6 rounded-full peer peer-focus:ring-4 peer-focus:ring-red-300 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"
              ></div>
              <span className="ms-3 text-sm font-medium text-gray-900">
                {dataNavBar.isActivated
                  ? "Game is active"
                  : "Game is desactive"}
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="rounded-sm border border-stroke bg-white shadow-default my-3">
        <div className="border-b border-stroke py-4 px-6.5">
          <h3 className="font-medium text-black">Toggle Navbar</h3>
        </div>
        <div className="flex flex-row flex-wrap gap-5.5 p-6.5 justify-between">
          <div className="flex flex-col items-center">
            <label className="inline-flex items-center me-5 cursor-pointer">
              <input
                type="checkbox"
                value={dataNavBar.isActiveEvent}
                className="sr-only peer"
                checked={dataNavBar.isActiveEvent || false}
                onChange={() => toggleEventCard()}
              />
              <div
                style={{ backgroundColor: "grey" }}
                className="relative w-11 h-6 rounded-full peer peer-focus:ring-4 peer-focus:ring-red-300 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"
              ></div>
              <span className="ms-3 text-sm font-medium text-gray-900">
                {dataNavBar.isActiveEvent
                  ? "Event is active"
                  : "Event is desactive"}
              </span>
            </label>
          </div>

          <div className="flex flex-col items-center">
            <label className="inline-flex items-center me-5 cursor-pointer">
              <input
                type="checkbox"
                value={dataNavBar.isActiveStore}
                className="sr-only peer"
                checked={dataNavBar.isActiveStore || false}
                onChange={() => toggleStoreCard()}
              />
              <div
                style={{ backgroundColor: "grey" }}
                className="relative w-11 h-6 rounded-full peer peer-focus:ring-4 peer-focus:ring-red-300 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"
              ></div>
              <span className="ms-3 text-sm font-medium text-gray-900">
                {dataNavBar.isActiveStore
                  ? "store is active"
                  : "store is desactive"}
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartThree series={counts} />
        <ChartGender series={countGenders(Object.values(users))} />
        <ChartAge series={calculateAgeRanges(Object.values(users))} />
        <div className="col-span-12 xl:col-span-8">
          <TableChallenge list={data} />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5"></div>

      <div className="rounded-sm border border-stroke bg-white p-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
        <h4 className="mb-6 text-xl font-semibold text-black ">Code Promo</h4>
        <div
          className="flex items-center p-4 mb-4 text-sm text-blue-800 border border-blue-300 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800"
          role="alert"
        >
          <svg
            className="flex-shrink-0 inline w-4 h-4 me-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only">Info</span>
          <div className="flex flex-wrap gap-1">
            <span className="font-medium mr-2">CODES UTILISABLES :</span>
            <span className="bg-indigo-100 text-indigo-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-indigo-900 dark:text-indigo-300">
              10
            </span>
            <span className="bg-indigo-100 text-indigo-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-indigo-900 dark:text-indigo-300">
              11
            </span>
            <span className="bg-indigo-100 text-indigo-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-indigo-900 dark:text-indigo-300">
              25
            </span>
            <span className="bg-indigo-100 text-indigo-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-indigo-900 dark:text-indigo-300">
              22
            </span>
            <span className="bg-indigo-100 text-indigo-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-indigo-900 dark:text-indigo-300">
              23
            </span>
            <span className="bg-indigo-100 text-indigo-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-indigo-900 dark:text-indigo-300">
              27
            </span>
            <span className="bg-indigo-100 text-indigo-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-indigo-900 dark:text-indigo-300">
              50
            </span>
            <span className="bg-indigo-100 text-indigo-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-indigo-900 dark:text-indigo-300">
              30
            </span>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="grid grid-cols-3 rounded-sm bg-gray-2  sm:grid-cols-5">
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Codes
              </h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Points
              </h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Active
              </h5>
            </div>
          </div>

          {getListCodes.map((data, index) => (
            <div className={`grid grid-cols-3 sm:grid-cols-5 py-2 gap-1.5`} key={index}>
              <div className="flex items-center gap-3 p-2.5 xl:p-5">
                <p className=" text-black  sm:block truncate">{data.code}</p>
              </div>
              <div className="bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400 inline-flex items-center justify-center">
                <p className="text-black ">{data.point}</p>
              </div>
              <span className="bg-gray-100 text-gray-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded me-2 dark:bg-gray-700 dark:text-gray-400 border border-gray-500 truncate">
                Active
              </span>
            </div>
          ))}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Dashboard;
