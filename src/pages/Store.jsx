import DefaultLayout from "../layout/DefaultLayout";
import TableProduct from "../components/Tables/TableProduct";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import { useFirebase } from "../context/FirebaseContext";

const Store = () => {
  const { store } = useFirebase();
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Tables Store" />
      <div className="flex flex-col gap-10">
        <TableProduct list={Object.values(store)} />
      </div>
    </DefaultLayout>
  );
};

export default Store;
