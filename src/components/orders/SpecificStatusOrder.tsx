import { useParams } from "react-router-dom";
import Orders from "./Orders";

const SpecificStatusOrder = () => {
  const { slug } = useParams();
  return (
    <div>
      {slug ? (
        <div className="container mx-auto px-10">
          <Orders specificStatus={slug} />
        </div>
      ) : (
        <div className="flex w-full flex-col gap-4">
          <div className="skeleton h-80 w-full"></div>
          <div className="skeleton h-8 w-28"></div>
          <div className="skeleton h-8 w-full"></div>
          <div className="skeleton h-8 w-full"></div>
        </div>
      )}
    </div>
  );
};

export default SpecificStatusOrder;
