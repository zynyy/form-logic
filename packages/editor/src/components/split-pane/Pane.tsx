import {CSSProperties, FC} from "react";

import {PaneProps} from "./interface";

const Pane: FC<PaneProps> = ({
  className,
  split,
  style: styleProps,
  size,
  eleRef,
  children,
}) => {
  const classes = ["pane", split, className].join(" ");

  let style: CSSProperties = {
    flex: 1,
    position: "relative",
    outline: "none",
  };

  if (size !== undefined) {
    if (split === "vertical") {

      style.width = size;
    } else {
      style.height = size;
      style.display = "flex";
    }
    style.flex = "none";
  }

  style = Object.assign({}, style, styleProps || {});

  return (
    <div ref={eleRef} className={classes} style={style}>
      {children}
    </div>
  );
};

export default Pane;
