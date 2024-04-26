import { motion } from "framer-motion";
import { CheckCheck, ExternalLink } from "lucide-react";
import { memo, useEffect, useState } from "react";

const className = {
  detractor: {
    textColor: "text-purple-800",
    hoverBg: "hover:bg-purple-50",
    bgColor: "bg-purple-100",
    borderColor: "border-purple-300",
  },
  pendingFollowers: {
    textColor: "text-indigo-800",
    hoverBg: "hover:bg-indigo-50",
    bgColor: "bg-indigo-100",
    borderColor: "border-indigo-300",
  },
};

export const UserLink = memo(function UserLink({
  href,
  value,
  variant,
}: {
  href: string;
  value: string;
  variant: "detractor" | "pendingFollowers";
}) {
  const [opened, setOpened] = useState(false);

  const { textColor, hoverBg, bgColor, borderColor } = className[variant];

  useEffect(() => {
    const isOpened = !!sessionStorage.getItem(value);
    if (isOpened) return setOpened(true);
    setOpened(false);
  }, [value]);

  return (
    <motion.a
      whileHover={{
        rotate: -3,
        scale: 1.2,
      }}
      data-opened={opened ? "true" : "false"}
      onClick={(e) => {
        setOpened(true);
        sessionStorage.setItem(value, "opened");
      }}
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`${textColor} ${hoverBg} ${bgColor} ${borderColor} data-[opened=true]:bg-lime-200 data-[opened=true]:text-lime-700 data-[opened=true]:border-lime-400 flex gap-2 items-center justify-center break-all rounded-xl px-2 py-2 border`}
    >
      {value}
      <ExternalLink className="w-4" />
      {opened && <CheckCheck className="w-5 text-lime-500" />}
    </motion.a>
  );
});
