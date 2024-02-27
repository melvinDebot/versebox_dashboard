import DefaultLayout from "../layout/DefaultLayout";
import TableProduct from "../components/Tables/TableProduct";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";

const TablesStore = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Tables Store" />
      <div className="flex flex-col gap-10">
        <TableProduct />
      </div>
    </DefaultLayout>
  );
};

export default TablesStore;
