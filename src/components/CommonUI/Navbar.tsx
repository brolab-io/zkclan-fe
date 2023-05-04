import Image from "next/image";

const Navbar = () => {
  return (
    <nav className="h-[100px] fixed inset-x-0 bg-[#1A202C]">
      <div className="flex items-center justify-between flex-1">
        <Image src="/logo.png" alt="logo" width={104} height={90} />
      </div>
    </nav>
  );
};

export default Navbar;
