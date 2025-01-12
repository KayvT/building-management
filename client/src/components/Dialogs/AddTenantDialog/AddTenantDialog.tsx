import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { useApolloClient } from "@apollo/client";
import { CREATE_TENANT } from "../../../graphql/mutations";
import { useTenant } from "../../../contexts/TenantIdContext/useTenant";
import { useNavigate } from "react-router-dom";
import { GET_ALL_TENANTS } from "../../../graphql/queries";

export default function AddTenantModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const navigate = useNavigate();
  const [tenantName, setTenantName] = useState("");
  const { setCurrentTenantId } = useTenant();
  const client = useApolloClient();

  const handleClose = () => {
    setOpen(false);
    setTenantName("");
  };

  const handleAddTenant = async () => {
    try {
      const { data } = await client.mutate({
        mutation: CREATE_TENANT,
        variables: { name: tenantName },
        refetchQueries: [{ query: GET_ALL_TENANTS }],
      });

      const newTenantId = data.createTenant.id;
      setCurrentTenantId(newTenantId);
      navigate(`/${newTenantId}/topology`);
      handleClose();
    } catch (error) {
      console.error("Error creating tenant:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tenantName.length >= 3) {
      handleAddTenant();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Tenant</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          placeholder="Tenant Name"
          type="text"
          fullWidth
          value={tenantName}
          onChange={(e) => setTenantName(e.target.value)}
          onKeyDown={handleKeyDown}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleAddTenant}
          disabled={tenantName.length < 3}
          variant="contained"
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
