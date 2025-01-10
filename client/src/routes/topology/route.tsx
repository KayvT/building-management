import { useApolloClient, useQuery } from "@apollo/client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { GET_TOPOLOGY } from "../../graphql/queries/tenants";
import { Box } from "@mui/system";
import { Button, TextField } from "@mui/material";
import { ADD_FLOOR } from "../../graphql/mutations/topology";
import { TopologyTreeView } from "../../components/TopologyTree/TopologyTree";
import { TenantFloor, FloorLocation, LocationSpot } from "../../types/Tenant";
import { TopologyContent } from "../../components/TopologyContent/TopologyContent";
import { useTenant } from "../../contexts/useTenant";

export default function TopologyRoute() {
  const { currentTenantId } = useTenant();
  const { data } = useQuery(GET_TOPOLOGY);
  const client = useApolloClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedEntry, setSelectedEntry] = useState<
    | ((TenantFloor | FloorLocation | LocationSpot) & {
        type: "floor" | "location" | "spot";
      })
    | null
  >(() => {
    const floorId = searchParams.get("floor");
    const locationId = searchParams.get("location");
    const spotId = searchParams.get("spot");

    if (floorId && !locationId && !spotId) {
      return {
        id: floorId,
        type: "floor",
        name: "",
      };
    }
    if (locationId && floorId && !spotId) {
      return {
        id: locationId,
        type: "location",
        name: "",
        floorId,
      };
    }
    if (spotId && floorId && locationId) {
      return {
        id: spotId,
        type: "spot",
        name: "",
        floorId,
        locationId,
      };
    }
    return null;
  });

  useEffect(() => {
    if (!currentTenantId) return;
    client.query({
      query: GET_TOPOLOGY,
      variables: {
        tenantId: currentTenantId,
      },
    });
  }, [currentTenantId]);

  const [isAddingFloor, setIsAddingFloor] = useState(false);
  const [newFloorName, setNewFloorName] = useState("");

  const handleAddFloor = () => {
    setIsAddingFloor(true);
  };

  const handleSubmitNewFloor = async () => {
    if (!newFloorName.trim()) return;

    try {
      await client.mutate({
        mutation: ADD_FLOOR,
        variables: {
          tenantId: currentTenantId,
          name: newFloorName.trim(),
        },
        refetchQueries: [GET_TOPOLOGY],
      });
      setNewFloorName("");
      setIsAddingFloor(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (selectedEntry?.type === "floor" && data?.tenant?.floors) {
      const updatedFloor = data.tenant.floors.find(
        (floor) => floor.id === selectedEntry.id
      );

      if (updatedFloor) {
        setSelectedEntry({
          ...updatedFloor,
          type: "floor",
        });
      }
    }
  }, [data, selectedEntry?.id]);

  useEffect(() => {
    // Update URL when selectedEntry changes
    if (selectedEntry) {
      const params = new URLSearchParams();

      if (selectedEntry.type === "spot") {
        for (const floor of data?.tenant?.floors || []) {
          for (const location of floor.locations || []) {
            if (location.spots?.some((s) => s.id === selectedEntry.id)) {
              params.set("floor", floor.id);
              params.set("location", location.id);
              params.set("spot", selectedEntry.id);
              break;
            }
          }
        }
      } else if (selectedEntry.type === "location") {
        for (const floor of data?.tenant?.floors || []) {
          if (floor.locations?.some((l) => l.id === selectedEntry.id)) {
            params.set("floor", floor.id);
            params.set("location", selectedEntry.id);
            break;
          }
        }
      } else {
        params.set("floor", selectedEntry.id);
      }

      setSearchParams(params, { replace: true });
    } else {
      setSearchParams({});
    }
  }, [selectedEntry, setSearchParams, data]);

  useEffect(() => {
    // Set initial selectedEntry based on URL params
    if (data?.tenant?.floors) {
      const floorId = searchParams.get("floor");
      const locationId = searchParams.get("location");
      const spotId = searchParams.get("spot");

      if (floorId && locationId && spotId) {
        // Handle spot selection
        for (const floor of data.tenant.floors) {
          for (const location of floor.locations || []) {
            const spot = location.spots?.find((s) => s.id === spotId);
            if (spot) {
              setSelectedEntry({ ...spot, type: "spot" });
              break;
            }
          }
        }
      } else if (floorId && locationId) {
        // Handle location selection
        for (const floor of data.tenant.floors) {
          const location = floor.locations?.find((l) => l.id === locationId);
          if (location) {
            setSelectedEntry({ ...location, type: "location" });
            break;
          }
        }
      } else if (floorId) {
        // Handle floor selection
        const floor = data.tenant.floors.find((f) => f.id === floorId);
        if (floor) {
          setSelectedEntry({ ...floor, type: "floor" });
        }
      }
    }
  }, [data, searchParams]);

  return (
    <div
      className="flex flex-row gap-4"
      style={{
        maxWidth: "1100px",
        maxHeight: "80vh",
        margin: "auto",
        marginTop: "100px",
      }}
    >
      <Box
        className="flex flex-col"
        sx={{
          width: "30%",
          backgroundColor: "white",
          borderRadius: "8px",
          height: "80%",
          minHeight: "600px",
          padding: "24px",
          boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
        }}
      >
        <div>
          <div className="flex flex-row gap-2 items-center justify-between">
            <div className="font-bold text-2xl mb-3">
              🏛️ {data?.tenant?.name}
            </div>
          </div>

          <TopologyTreeView data={data} setSelectedEntry={setSelectedEntry} />
        </div>

        {isAddingFloor ? (
          <div className="mt-4 flex flex-col gap-2">
            <TextField
              autoFocus
              size="small"
              value={newFloorName}
              onChange={(e) => setNewFloorName(e.target.value)}
              placeholder="Enter floor name"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmitNewFloor();
                }
              }}
            />
            <div className="flex gap-2">
              <Button
                onClick={handleSubmitNewFloor}
                variant="contained"
                disabled={!newFloorName.trim()}
                sx={{
                  borderRadius: "8px",
                  flex: 1,
                }}
              >
                Confirm
              </Button>
              <Button
                onClick={() => {
                  setIsAddingFloor(false);
                  setNewFloorName("");
                }}
                variant="outlined"
                sx={{
                  borderRadius: "8px",
                  flex: 1,
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={handleAddFloor}
            disableRipple
            variant="outlined"
            disableTouchRipple
            sx={{
              marginTop: "16px",
              borderRadius: "8px",
              maxWidth: "80%",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Add Floor
          </Button>
        )}
      </Box>

      <TopologyContent selectedEntry={selectedEntry} />
    </div>
  );
}
