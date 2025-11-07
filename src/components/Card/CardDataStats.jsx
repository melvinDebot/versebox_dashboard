import { PropTypes } from "prop-types";

const CardDataStats = ({
  title,
  total,
  rate,
  levelUp,
  levelDown,
  children,
}) => {
  const isLoading = total === null || total === undefined || total === 0;

  return (
    <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default transition-colors duration-300">
      <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 transition-colors duration-300">
        {isLoading ? (
          <div className="h-8 w-8 rounded-full bg-gray animate-pulse" />
        ) : (
          children
        )}
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          {isLoading ? (
            <>
              <div className="h-6 w-20 mb-1.5 rounded bg-gray animate-pulse" />
              <div className="h-4 w-16 rounded bg-gray animate-pulse" />
            </>
          ) : (
            <>
              <h4 className="text-title-md font-bold text-black transition-colors duration-300">
                {total}
              </h4>
              <span className="text-sm font-medium text-body transition-colors duration-300">
                {title}
              </span>
            </>
          )}
        </div>

        {isLoading ? (
          <div className="h-4 w-12 rounded bg-gray animate-pulse" />
        ) : (
          <span
            className={`flex items-center gap-1 text-sm font-medium ${
              levelUp ? "text-meta-3" : ""
            } ${levelDown ? "text-meta-5" : ""}`}
          >
            {rate}

            {levelUp && (
              <svg
                className="fill-meta-3"
                width="10"
                height="11"
                viewBox="0 0 10 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.35716 2.47737L0.908974 5.82987L5.0443e-07 4.94612L5 0.0848689L10 4.94612L9.09103 5.82987L5.64284 2.47737L5.64284 10.0849L4.35716 10.0849L4.35716 2.47737Z"
                  fill=""
                />
              </svg>
            )}
            {levelDown && (
              <svg
                className="fill-meta-5"
                width="10"
                height="11"
                viewBox="0 0 10 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.64284 7.69237L9.09102 4.33987L10 5.22362L5 10.0849L-8.98488e-07 5.22362L0.908973 4.33987L4.35716 7.69237L4.35716 0.0848701L5.64284 0.0848704L5.64284 7.69237Z"
                  fill=""
                />
              </svg>
            )}
          </span>
        )}
      </div>
    </div>
  );
};

export default CardDataStats;

CardDataStats.propTypes = {
  title: PropTypes.string.isRequired,
  total: PropTypes.number,
  rate: PropTypes.string.isRequired,
  levelUp: PropTypes.bool,
  levelDown: PropTypes.bool,
  children: PropTypes.node.isRequired,
};
