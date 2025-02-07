import React, { useState } from "react";

import { GET_ALL_TENANTS } from "../../graphql/queries";
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useTenant } from "../../contexts/TenantIdContext/useTenant";
import AddTenantModal from "../Dialogs/AddTenantDialog/AddTenantDialog";
import { Button, MenuItem, Menu } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { TenantData } from "@/types/tenant";
import { toast } from "react-toastify";

export default function TenantDropdown() {
  const { data } = useQuery<{ tenants: TenantData[] }>(GET_ALL_TENANTS);
  const navigate = useNavigate();
  const { setCurrentTenantId, currentTenantId } = useTenant();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const notify = (message: string, type: "success" | "error" | "info") =>
    toast(message, { type });

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleTenantChange = (tenantId: string) => {
    setCurrentTenantId(tenantId);
    navigate(`/${tenantId}/topology`);
    handleMenuClose();
    notify("Tenant changed successfully!", "info");
  };

  const handleAddTenant = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
    handleMenuClose();
  };

  if (!data?.tenants?.length) return null;

  const currentTenant = data.tenants.find(
    (tenant) => tenant.id === currentTenantId
  );

  return (
    <div>
      <Button
        onClick={handleMenuOpen}
        endIcon={<KeyboardArrowDownIcon />}
        variant="outlined"
        disableRipple
        size="large"
        sx={{
          textTransform: "none",
          minWidth: "180px",
          fontWeight: "bold",
        }}
      >
        {currentTenant?.name || "Select Tenant"}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          ul: {
            paddingBottom: "0px",
          },
        }}
      >
        {data.tenants.map((tenant) => (
          <MenuItem
            key={tenant.id}
            onClick={() => handleTenantChange(tenant.id)}
          >
            {tenant.name}
          </MenuItem>
        ))}
        <MenuItem
          onClick={handleAddTenant}
          sx={{
            color: "white",
            bgcolor: "primary.main",
            "&:hover": {
              bgcolor: "primary.dark",
            },
          }}
        >
          Add Tenant
        </MenuItem>
      </Menu>
      <AddTenantModal open={isModalOpen} setOpen={setIsModalOpen} />
    </div>
  );
}
