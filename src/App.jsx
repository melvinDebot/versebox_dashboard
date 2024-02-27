import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { auth } from "../firebase";

import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import TablesChallenges from "./pages/TablesChallenges";
import TablesUser from "./pages/TablesUser";
import TablesEvent from "./pages/TablesEvent";
import TablesStore from "./pages/TableStore";
import Calendar from "./pages/Calendar";
import UpdateChallenge from "./pages/UpdateChallenge";
import CreateChallenge from "./pages/CreateChallenge";
import CreateEvent from "./pages/CreateEvent";
import CreateProduct from "./pages/CreateProduct";
import UpdateProduct from "./pages/UpdateProduct";
import UpdateEvent from "./pages/UpdateEvent";
import UpdateUser from "./pages/UpdateUser";

function App() {
  //eslint-disable-next-line
  const PrivateRoute = ({ children }) => {
    const isLogged = auth.currentUser;
    return isLogged ? children : <Navigate to="/" />;
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
