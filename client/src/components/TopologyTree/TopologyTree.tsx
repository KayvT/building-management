import React from "react";
import {
  TenantData,
  TenantFloor,
  FloorLocation,
  LocationSpot,
} from "../../types/Tenant";

type Props = {
  data: {
    tenant: TenantData;
  };
  setSelectedEntry: React.Dispatch<
    React.SetStateAction<
      | ((TenantFloor | FloorLocation | LocationSpot) & {
          type: "floor" | "location" | "spot";
        })
      | null
    >
  >;
};
export const TopologyTreeView = ({ data, setSelectedEntry }: Props) => {
  return (
    <>
      {data?.tenant?.floors?.map((floor) => (
        <div key={floor.id}>
          <div
            style={{ paddingLeft: "20px" }}
            className="flex items-center relative ml-2 pt-1 pb-1"
            onClick={() => {
              setSelectedEntry({
                id: floor.id,
                type: "floor",
                name: floor.name,
                locations: floor.locations,
              });
            }}
          >
            <div className="absolute left-0 top-0 h-full w-[2px] bg-gray-200" />
            <div className="absolute left-0 top-1/2 w-5 h-[2px] bg-gray-200" />
            <div className="flex flex-row gap-2 items-center justify-between w-full">
              <span
                className="hover:text-blue-600 transition-all duration-300 
                 cursor-pointer hover:translate-y-[-2px] hover:font-bold"
              >
                📍 {floor.name}
              </span>
            </div>
          </div>
          {floor.locations?.map((location, locationIndex) => (
            <React.Fragment key={location.id}>
              <div
                style={{ paddingLeft: "40px" }}
                className="flex items-center relative ml-2 pt-1 pb-1"
                onClick={() => {
                  setSelectedEntry({
                    id: location.id,
                    type: "location",
                    name: location.name,
                    spots: location.spots,
                  });
                }}
              >
                <div
                  className={`absolute left-0 top-0 h-full w-[2px] bg-gray-200 ${
                    locationIndex === floor.locations.length - 1 ? "h-1/2" : ""
                  }`}
                />
                <div className="absolute left-0 top-1/2 w-8 h-[2px] bg-gray-200" />
                <span
                  className="hover:text-blue-600 transition-all duration-300 
                 cursor-pointer hover:translate-y-[-2px] hover:font-bold"
                >
                  🏢 {location.name}
                </span>
              </div>
              {location.spots?.map((spot) => (
                <div
                  key={spot.id}
                  style={{ paddingLeft: "60px" }}
                  className="flex items-center relative ml-2 pt-1 pb-1 cursor-pointer hover:text-blue-600 transition-all duration-300"
                  onClick={() => {
                    setSelectedEntry({
                      id: spot.id,
                      type: "spot",
                      name: spot.name,
                    });
                  }}
                >
                  <div className="absolute left-0 top-0 h-full w-[2px] bg-gray-200" />
                  <div className="absolute left-0 top-1/2 w-12 h-[2px] bg-gray-200" />
                  <span
                    className="hover:text-blue-600 transition-all duration-300 
                 cursor-pointer hover:translate-y-[-2px] hover:font-bold"
                  >
                    ⭐ {spot.name}
                  </span>
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      ))}
      {/* <AddNewFloorButton /> */}
    </>
  );
};
