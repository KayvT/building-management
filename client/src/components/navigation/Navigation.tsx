import React from "react";
import TenantDropdown from "./TenantDropDown";
import { Link, useLocation } from "react-router-dom";
import { useTenant } from "../../contexts/useTenant";

const navigation = [
  { name: "Topology", href: "/topology" },
  { name: "Tasks", href: "/tasks" },
  { name: "Operatives", href: "/operatives" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function NavigationHeader() {
  const { currentTenantId } = useTenant();
  const pathname = useLocation().pathname;

  return (
    <div className="bg-white drop-shadow-xl">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between max-w-screen-xl">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden"></div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <p className="text- text-2xl font-bold">
                <span className="text-blue-500">P</span>BMS
              </p>
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={`/${currentTenantId}${item.href}`}
                    className={classNames(
                      pathname.split("/")[2] === item.href.split("/")[1]
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "rounded-md px-3 py-2 text-sm font-medium"
                    )}
                    // aria-current={item.current ? "page" : undefined}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <TenantDropdown />
          </div>
        </div>
      </div>
    </div>
  );
}
