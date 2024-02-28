import DefaultLayout from "../layout/DefaultLayout";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import { useFirebase } from "../context/FirebaseContext";
import TableChallengeDetails from "../components/Tables/TablechallengeDetails";
import { useParams } from "react-router-dom";

const Challenges = () => {
  const { data } = useFirebase();
  let { category } = useParams();

  return (
    <DefaultLayout>
      <Breadcrumb pageName={`Table ${category}`} />
      <div className="flex flex-col gap-10">
        <TableChallengeDetails list={data[category]} />
      </div>
    </DefaultLayout>
  );
};

export default Challenges;
