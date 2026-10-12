import type { CSSProperties, HTMLAttributes } from "react";
import type { StaticImageData } from "next/image";

import add from "../../../design-assets/icons/material-symbols-outlined/add.svg";
import alternateEmail from "../../../design-assets/icons/material-symbols-outlined/alternate_email.svg";
import arrowBack from "../../../design-assets/icons/material-symbols-outlined/arrow_back.svg";
import arrowForward from "../../../design-assets/icons/material-symbols-outlined/arrow_forward.svg";
import call from "../../../design-assets/icons/material-symbols-outlined/call.svg";
import close from "../../../design-assets/icons/material-symbols-outlined/close.svg";
import expandMore from "../../../design-assets/icons/material-symbols-outlined/expand_more.svg";
import fullscreen from "../../../design-assets/icons/material-symbols-outlined/fullscreen.svg";
import mail from "../../../design-assets/icons/material-symbols-outlined/mail.svg";
import menu from "../../../design-assets/icons/material-symbols-outlined/menu.svg";
import myLocation from "../../../design-assets/icons/material-symbols-outlined/my_location.svg";
import northEast from "../../../design-assets/icons/material-symbols-outlined/north_east.svg";
import progressActivity from "../../../design-assets/icons/material-symbols-outlined/progress_activity.svg";
import refresh from "../../../design-assets/icons/material-symbols-outlined/refresh.svg";
import remove from "../../../design-assets/icons/material-symbols-outlined/remove.svg";
import search from "../../../design-assets/icons/material-symbols-outlined/search.svg";
import tune from "../../../design-assets/icons/material-symbols-outlined/tune.svg";

const MATERIAL_ICONS = {
  add,
  alternate_email: alternateEmail,
  arrow_back: arrowBack,
  arrow_forward: arrowForward,
  call,
  close,
  expand_more: expandMore,
  fullscreen,
  mail,
  menu,
  my_location: myLocation,
  north_east: northEast,
  progress_activity: progressActivity,
  refresh,
  remove,
  search,
  tune,
} as const satisfies Record<string, StaticImageData>;

export type MaterialIconName = keyof typeof MATERIAL_ICONS;

type MaterialIconProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  name: MaterialIconName;
  size?: number;
};

/**
 * Renders a locally vendored Material Symbol as a CSS mask so it inherits the
 * surrounding text color and remains transformable for interaction motion.
 */
export function MaterialIcon({
  name,
  size = 24,
  className,
  style,
  ...props
}: MaterialIconProps) {
  const source = MATERIAL_ICONS[name].src;
  const maskStyles = {
    width: size,
    height: size,
    backgroundColor: "currentColor",
    maskImage: `url(${source})`,
    maskPosition: "center",
    maskRepeat: "no-repeat",
    maskSize: "contain",
    WebkitMaskImage: `url(${source})`,
    WebkitMaskPosition: "center",
    WebkitMaskRepeat: "no-repeat",
    WebkitMaskSize: "contain",
    ...style,
  } as CSSProperties;

  return (
    <span
      data-material-icon={name}
      className={`inline-block shrink-0 ${className ?? ""}`}
      style={maskStyles}
      {...props}
    />
  );
}
