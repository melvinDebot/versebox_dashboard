import { createContext, useContext, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { onValue, ref } from "firebase/database";
import { db } from "../../firebase";

const FirebaseContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useFirebase = () => {
  const ctx = useContext(FirebaseContext);
  if (!ctx) {
    throw new Error("useFirebase doit être utilisé à l'intérieur de FirebaseProvider");
  }
  return ctx;
};

const toArray = (snapshotValue) => {
  if (!snapshotValue) return [];
  if (Array.isArray(snapshotValue)) return snapshotValue.filter(Boolean);
  return Object.entries(snapshotValue).map(([id, value]) => ({
    ...(typeof value === "object" && value !== null ? value : { value }),
    _id: id,
  }));
};

const SOURCES = [
  { path: "Store/", key: "store", transform: toArray },
  { path: "Events/", key: "events", transform: toArray },
  { path: "users/", key: "users", transform: toArray },
  { path: "RewardCodes/", key: "rewardCodes", transform: toArray },
  { path: "dataIHM/", key: "challengesByCategory", transform: (v) => v ?? {} },
  { path: "isActiveGame/", key: "dataNavBar", transform: (v) => v ?? {} },
];

export const FirebaseProvider = ({ children }) => {
  const [state, setState] = useState({
    store: [],
    events: [],
    users: [],
    rewardCodes: [],
    challengesByCategory: {},
    dataNavBar: {},
    loading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribes = [];
    const loadingFlags = Object.fromEntries(SOURCES.map((s) => [s.key, true]));

    const markLoaded = (key) => {
      loadingFlags[key] = false;
      if (Object.values(loadingFlags).every((v) => v === false)) {
        setState((prev) => ({ ...prev, loading: false }));
      }
    };

    SOURCES.forEach(({ path, key, transform }) => {
      const sourceRef = ref(db, path);
      const unsubscribe = onValue(
        sourceRef,
        (snapshot) => {
          setState((prev) => ({
            ...prev,
            [key]: transform(snapshot.val()),
          }));
          markLoaded(key);
        },
        (error) => {
          setState((prev) => ({ ...prev, error }));
          markLoaded(key);
        },
      );
      unsubscribes.push(unsubscribe);
    });

    return () => {
      unsubscribes.forEach((fn) => fn?.());
    };
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      data: state.challengesByCategory,
      getListCodes: state.rewardCodes,
    }),
    [state],
  );

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};

FirebaseProvider.propTypes = {
  children: PropTypes.node,
};
