import { useState } from "react";
import PropTypes from "prop-types";

const SIZES = {
  xs: "h-6 w-6 text-caption",
  sm: "h-8 w-8 text-body-sm",
  md: "h-10 w-10 text-body-md",
  lg: "h-12 w-12 text-body-lg",
  xl: "h-16 w-16 text-title-md",
};

const initialsFrom = (name = "") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

const Avatar = ({
  src,
  alt = "",
  name = "",
  size = "md",
  ring = false,
  className = "",
}) => {
  const [errored, setErrored] = useState(false);
  const showImage = src && !errored;
  const initials = initialsFrom(name || alt);

  const classes = [
    "inline-flex items-center justify-center rounded-full overflow-hidden bg-primary-100 text-primary-700 font-medium",
    SIZES[size],
    ring ? "ring-2 ring-primary-500 ring-offset-2 ring-offset-surface" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes}>
      {showImage ? (
        <img
          src={src}
          alt={alt || name}
          onError={() => setErrored(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span aria-label={name || alt}>{initials || "?"}</span>
      )}
    </span>
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  name: PropTypes.string,
  size: PropTypes.oneOf(Object.keys(SIZES)),
  ring: PropTypes.bool,
  className: PropTypes.string,
};

export default Avatar;
