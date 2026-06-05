import * as Lucide from "lucide-react";
import PropTypes from "prop-types";

const SIZE_MAP = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  "2xl": 40,
  "3xl": 48,
  "4xl": 64,
};

const Icon = ({ name, size = "md", className = "", strokeWidth = 1.75, ...rest }) => {
  const LucideIcon = Lucide[name];

  if (!LucideIcon) {
    if (typeof window !== "undefined") {
      console.warn(`[Icon] Unknown lucide icon: ${name}`);
    }
    return null;
  }

  const pxSize = typeof size === "number" ? size : SIZE_MAP[size] || SIZE_MAP.md;

  return (
    <LucideIcon
      size={pxSize}
      strokeWidth={strokeWidth}
      className={className}
      {...rest}
    />
  );
};

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.oneOfType([
    PropTypes.oneOf(Object.keys(SIZE_MAP)),
    PropTypes.number,
  ]),
  className: PropTypes.string,
  strokeWidth: PropTypes.number,
};

export default Icon;
