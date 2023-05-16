import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

type Props = {
  items: Array<{
    label: string;
    href: string;
  }>;
};

const Breadcrumb: React.FC<Props> = ({ items }) => {
  return (
    <div className="flex items-center text-xl font-semibold text-[#718096] py-8">
      {items.map((item, index) => {
        return (
          <>
            <Link
              className={clsx(
                index === items.length - 1 ? "text-white" : "hover:text-white",
                "transition-colors"
              )}
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
            {index !== items.length - 1 && (
              <Image
                src="/assets/icons/chervon-right.svg"
                width={24}
                height={24}
                quality={100}
                alt=">"
                className="mx-2"
              />
            )}
          </>
        );
      })}
    </div>
  );
};

export default Breadcrumb;
