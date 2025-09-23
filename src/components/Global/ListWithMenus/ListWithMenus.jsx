import { useState } from "react";

import MyMenu from "../SubMenu/SubMenu"; // مكون القائمة

export default function ListWithMenus({ items }) {
  // هذا يخزن index العنصر المفتوح، null يعني لا شيء مفتوح
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="flex flex-col gap-4">
      {items.map((k, index) => (
        <div key={index} className="flex items-center gap-3">
          <div className={`${k.bg} rounded-lg p-2`}>
            <div className={`size-5 ${k.color}`}>
              <img src={k.icon} alt="icon" />
            </div>
          </div>

          <p className="text-primary text-sm font-medium">{k.title}</p>

          {/* Menu */}
          <div className="ml-auto">
            <MyMenu
              isOpen={openIndex === index} // هل هذه القائمة مفتوحة؟
              onToggle={() => {
                setOpenIndex(openIndex === index ? null : index); // إغلاق إذا كانت مفتوحة، أو فتح هذه وإغلاق الباقي
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
