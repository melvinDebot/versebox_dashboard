import DefaultLayout from "../layout/DefaultLayout";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import TableEvent from "../components/Tables/TableEvent";
import { useFirebase } from "../context/FirebaseContext";

const TablesEvent = () => {
  const { events } = useFirebase();
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Tables Events" />
      <div className="flex flex-col gap-10">
        <TableEvent list={Object.values(events)} />
      </div>
    </DefaultLayout>
  );
};

export default TablesEvent;
