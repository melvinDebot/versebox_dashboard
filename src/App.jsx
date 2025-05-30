import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { auth } from "../firebase";
import { useEffect, useState } from "react";
import "./App.css";

import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import TablesChallenges from "./pages/Challenges";
import TablesUser from "./pages/Users";
import TablesEvent from "./pages/Events";
import TablesStore from "./pages/Store";
import Calendar from "./pages/Calendar";
import UpdateChallenge from "./pages/UpdateChallenge";
import CreateChallenge from "./pages/CreateChallenge";
import CreateEvent from "./pages/CreateEvent";
import CreateProduct from "./pages/CreateProduct";
import UpdateProduct from "./pages/UpdateProduct";
import UpdateEvent from "./pages/UpdateEvent";
import UpdateUser from "./pages/UpdateUser";
import Loading from "./components/Loading/Loading";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="container-loader">
        <Loading />
      </div>
    ); // Afficher un indicateur de chargement pendant que Firebase vérifie l'état de connexion
  }

  //eslint-disable-next-line
  const PrivateRoute = ({ children }) => {
    return user ? children : <Navigate to="/" />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<SignIn />} />

        <Route
          path="/dashboard"
          exact
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/tables-challenges/:category"
          exact
          element={
            <PrivateRoute>
              <TablesChallenges />
            </PrivateRoute>
          }
        />

        <Route path="/tables-user" exact element={<TablesUser />} />
        <Route path="/tables-event" exact element={<TablesEvent />} />
        <Route path="/tables-store" exact element={<TablesStore />} />
        <Route path="/calendar" exact element={<Calendar />} />
        <Route
          path="/update-challenge/:id"
          exact
          element={<UpdateChallenge />}
        />
        <Route path="/update-user/:id" exact element={<UpdateUser />} />
        <Route path="/update-event/:id" exact element={<UpdateEvent />} />
        <Route path="/update-product/:id" exact element={<UpdateProduct />} />
        <Route path="/create-challenge" exact element={<CreateChallenge />} />
        <Route path="/create-event" exact element={<CreateEvent />} />
        <Route path="/create-product" exact element={<CreateProduct />} />
      </Routes>
    </Router>
  );
}

export default App;
