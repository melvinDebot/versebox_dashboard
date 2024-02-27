import DefaultLayout from "../layout/DefaultLayout";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";

const TablesEvent = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Tables Events" />
      <div className="flex flex-col gap-10"></div>
    </DefaultLayout>
  );
};

export default TablesEvent;
