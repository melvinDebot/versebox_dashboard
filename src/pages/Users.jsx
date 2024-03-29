import DefaultLayout from "../layout/DefaultLayout";
import TableThree from "../components/Tables/TableUser";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import { useFirebase } from "../context/FirebaseContext";

const Users = () => {
  const { users } = useFirebase();
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Tables Users" />
      <div className="flex flex-col gap-10">
        <TableThree list={Object.values(users)} />
      </div>
    </DefaultLayout>
  );
};

export default Users;
