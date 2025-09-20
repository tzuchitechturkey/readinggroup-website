import { FiSearch } from "react-icons/fi";

import { Input } from "@/components/ui/input";

export function SearchInput() {
  return (
    <div className="relative w-64">
      <Input placeholder="Search..." className="pr-10" />
      <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
    </div>
  );
}

export default SearchInput;
