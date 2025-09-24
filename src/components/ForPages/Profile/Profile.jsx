import React from "react";

import {
  User as UserIcon,
  Archive as ArchiveIcon,
  MessagesSquare as InteractionsIcon,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import userAvatar from "@/assets/Beared Guy02-min 1.png";

// Simple stat item
const Stat = ({ label, value }) => (
  <div className="flex flex-col items-center gap-1">
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className="text-lg font-semibold leading-none">{value}</span>
  </div>
);

// Simple labeled row used on the right details card
const Labeled = ({ label, children }) => (
  <div className="space-y-1">
    <div className="text-sm font-normal text-[#5B6B79]">{label}</div>
    <div className="text-sm text-[#1D2630]">{children}</div>
  </div>
);

function Profile() {
  return (
    <div className="space-y-6 my-5 p-1">
      <div className="grid grid-cols-12 gap-6">
        {/* Left profile card */}
        <section className="col-span-12 md:col-span-4 lg:col-span-3">
          <div className="rounded-xl border bg-card p-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-16 w-16">
                <AvatarImage src={userAvatar} alt="avatar" />
                <AvatarFallback>SZ</AvatarFallback>
              </Avatar>
              <div className="mt-4 text-xs font-semibold">Suzan</div>
              <div className="text-[11px] text-[#5B6B79]">UI/UX Designer</div>
            </div>

            <Separator className="my-6" />

            <div className="grid grid-cols-3 gap-3">
              <Stat label="Publications" value="37" />
              <Stat label="Followers" value="2749" />
              <Stat label="Following" value="678" />
            </div>

            <Separator className="my-6" />

            <dl className="space-y-4 text-sm">
              <div className="flex items-start justify-between gap-4">
                <dt className="flex items-center gap-2 text-[11px] text-[#5B6B79]">
                  <Mail className="h-4 w-4" /> Email
                </dt>
                <dd className="text-[11px] truncate text-[#1D2630] text-right">
                  demo@sample.com
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="flex items-center gap-2 text-[#5B6B79]">
                  <Phone className="h-4 w-4" /> Phone no
                </dt>
                <dd className="text-[11px] text-[#1D2630] truncate text-right">
                  (+99) 9999 999 999
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="flex items-center gap-2 text-[#5B6B79]">
                  <MapPin className="h-4 w-4" /> Location
                </dt>
                <dd className="text-[11px] text-[#1D2630] truncate text-right">
                  Melbourne
                </dd>
              </div>
            </dl>
          </div>
        </section>

        {/* Right content */}
        <section className="col-span-12 md:col-span-8 lg:col-span-9 space-y-4">
          {/* About me */}
          <div className="rounded-xl border bg-card">
            <div className="border-b px-6 py-4  font-semibold">About me</div>
            <div className="px-6 py-5 text-sm text-[#5B6B79]">
              I'm web designer, I work in programs like figma, adobe photoshop,
              adobe illustrator
            </div>
          </div>

          {/* Personal details */}
          <div className="rounded-xl border bg-card">
            <div className="border-b px-6 py-4 text-sm font-semibold">
              Personal Details
            </div>
            <div className="px-6 py-5">
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12  space-y-5">
                  <Labeled label="Full Name">Anshan Handgun</Labeled>
                  <Separator />
                  <Labeled label="Phone">+0 123456789 , +0 123456789</Labeled>
                  <Separator />
                  <div className="grid grid-cols-7 gap-4 items-center">
                    <div className="col-span-3">
                      <Labeled label="Website">http://example.com</Labeled>
                    </div>
                    <div className="col-span-3">
                      <Labeled label="Email">support@example.com</Labeled>
                    </div>
                  </div>

                  <Separator />
                  <Labeled label="Address">
                    Street 110-B Kalian s Bag, Dewan, M.P. INDIA
                  </Labeled>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Profile;
