import { useState, createContext, useEffect, useContext } from "react";
import { db } from "../../firebase";
import { onValue, ref } from "firebase/database";
import PropTypes from "prop-types";

const FirebaseContext = createContext();

export function useFirebase() {
  return useContext(FirebaseContext);
}

export function FirebaseProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [store, setStore] = useState([]);
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [dataNavBar, setDataNavBar] = useState([]);

  useEffect(() => {
    // Fonction pour récupérer les données de la base de données Firebase
    const fetchData = async () => {
      const productRef = ref(db, `Store/`);
      onValue(productRef, (snapshot) => {
        const data = snapshot.val();
        setStore(data);
      });

      const EventRef = ref(db, `Events/`);
      onValue(EventRef, (snapshot) => {
        const data = snapshot.val();
        setEvents(data);
      });

      const getItemsActiveNavBar = ref(db, `isActiveGame/`);
      onValue(getItemsActiveNavBar, (snapshot) => {
        const data = snapshot.val();
        console.log("🚀 ~ onValue ~ data:", data);
        setDataNavBar(data);
      });

      const DatatRef = ref(db, `dataIHM/`);
      onValue(DatatRef, (snapshot) => {
        const data = snapshot.val();
        setData(data);
      });

      const UserRef = ref(db, `users/`);
      onValue(UserRef, (snapshot) => {
        const data = snapshot.val();
        setUsers(data);
      });
    };

    fetchData();
  }, []);

  const value = {
    events,
    store,
    data,
    users,
    dataNavBar,
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}

FirebaseProvider.propTypes = {
  children: PropTypes.node,
};
