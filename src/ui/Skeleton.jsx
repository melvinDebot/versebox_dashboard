import PropTypes from "prop-types";

const SHAPES = {
  rect: "rounded-md",
  pill: "rounded-pill",
  circle: "rounded-full",
  card: "rounded-2xl",
};

const Skeleton = ({
  shape = "rect",
  width,
  height,
  className = "",
  style = {},
}) => {
  const classes = [
    "block animate-pulse bg-neutral-200 dark:bg-secondary-600",
    SHAPES[shape],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const inlineStyle = {
    ...style,
    ...(width ? { width: typeof width === "number" ? `${width}px` : width } : {}),
    ...(height ? { height: typeof height === "number" ? `${height}px` : height } : {}),
  };

  return <span className={classes} style={inlineStyle} aria-hidden="true" />;
};

Skeleton.propTypes = {
  shape: PropTypes.oneOf(Object.keys(SHAPES)),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  style: PropTypes.object,
};

export default Skeleton;
