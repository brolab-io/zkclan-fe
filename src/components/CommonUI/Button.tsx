import clsx from "clsx";
import { PropsWithChildren } from "react";

type Props = {} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<PropsWithChildren<Props>> = ({ children, className, ...rest }) => {
  return (
    <button
      className={clsx(
        className,
        "rounded-full py-[14px] px-11 bg-[#5C8AED] font-semibold text-white",
        "hover:bg-[#4C7ED6] transition-colors duration-200"
      )}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
