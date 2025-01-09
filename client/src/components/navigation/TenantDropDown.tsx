import React from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { GET_ALL_TENANTS } from "../../graphql/queries/tenants";
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useTenant } from "../../contexts/useTenant";

export default function TenantDropdown() {
  const { data } = useQuery(GET_ALL_TENANTS);
  const navigate = useNavigate();
  const { setCurrentTenantId, currentTenantId } = useTenant();

  if (!data?.tenants?.length) return null;

  const handleTenantChange = (tenantId: string) => {
    setCurrentTenantId(tenantId);
    navigate(`/${tenantId}/topology`);
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          {data.tenants.find((tenant) => tenant.id === currentTenantId)?.name}
          <ChevronDownIcon
            aria-hidden="true"
            className="-mr-1 size-5 text-gray-400"
          />
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none"
      >
        <div className="py-1">
          {data.tenants.map((tenant) => (
            <MenuItem key={tenant.id}>
              <button
                onClick={() => handleTenantChange(tenant.id)}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                {tenant.name}
              </button>
            </MenuItem>
          ))}
        </div>
      </MenuItems>
    </Menu>
  );
}
