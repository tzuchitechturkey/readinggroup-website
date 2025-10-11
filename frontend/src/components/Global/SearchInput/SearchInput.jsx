import { FiSearch } from "react-icons/fi";

import { Input } from "@/components/ui/input";

export function SearchInput() {
  return (
    <div className="relative w-64 ">
      <Input
        placeholder="Search..."
        className={`pr-10 bg-[#EDEDED]  dark:bg-[#f9f9f9]  text-foreground placeholder:text-muted-foreground`}
      />
      <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

export default SearchInput;
