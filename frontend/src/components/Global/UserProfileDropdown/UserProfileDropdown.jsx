import { useEffect, useState } from "react";

import { CiSettings } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { IoLogOutOutline } from "react-icons/io5";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Modal from "@/components/Global/Modal/Modal";
import LogoutConfirmation from "@/components/Global/LogoutConfirmation/LogoutConfirmation";

export default function UserProfileDropdown({ iconColor }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    const user = localStorage.getItem("userId");
    setUserId(user);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className=" px-3 py-2 border-none outline-none rounded-md  ">
        <CgProfile
          className="cursor-pointer text-xl hover:scale-110 transition-all duration-200 "
          style={{ color: iconColor || undefined }}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[160px] rounded-xl shadow-lg border border-gray-100 bg-white/95 py-2 px-1">
        <DropdownMenuItem
          onClick={() => {
            navigate(`/profile/${userId}`);
          }}
          className={`flex items-center gap-2 justify-between px-4 py-2 rounded-lg cursor-pointer transition-colors duration-150
                hover:bg-[var(--color-primary)] hover:text-[#fff]  text-text
              `}
        >
          <CgProfile
            className="!w-5 !h-5"
            size={30}
            style={{ color: iconColor || undefined }}
          />
          <span className="flex-1">{t("Profile")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            navigate("/settings");
          }}
          className={` flex items-center gap-2 justify-between px-4 py-2 rounded-lg cursor-pointer transition-colors duration-150
                hover:bg-[var(--color-primary)] hover:text-[#fff]  text-text
              `}
        >
          <CiSettings
            className="!w-6 !h-6"
            size={30}
            style={{ color: iconColor || undefined }}
          />
          <span className="flex-1">{t("Settings")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setOpenLogoutModal(true);
          }}
          className={`flex items-center gap-2 justify-between px-4 py-2 rounded-lg cursor-pointer transition-colors duration-150
                hover:bg-[var(--color-primary)] hover:text-[#fff]  text-text
              `}
        >
          <IoLogOutOutline
            className="!w-6 !h-6"
            size={30}
            style={{ color: iconColor || undefined }}
          />

          <span className="flex-1">{t("Logout")} </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
      <Modal
        isOpen={openLogoutModal}
        onClose={() => setOpenLogoutModal(false)}
        title={t("Log Out")}
      >
        <LogoutConfirmation onCancel={() => setOpenLogoutModal(false)} />
      </Modal>
    </DropdownMenu>
  );
}
