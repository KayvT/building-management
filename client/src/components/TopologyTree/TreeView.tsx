import React from "react";
import { Link, useParams } from "react-router-dom";
import { Floor } from "@/types/floors";

type Props = {
  floors: Floor[];
};
export const TreeView = ({ floors }: Props) => {
  const { tenantId } = useParams();
  return (
    <>
      {floors?.map((floor) => (
        <div key={floor.id}>
          <Link
            to={`/${tenantId}/topology/floors/${floor.id}`}
            style={{ paddingLeft: "20px" }}
            className="flex items-center relative ml-2 pt-1 pb-1 cursor-pointer"
          >
            <div className="absolute left-0 top-0 h-full w-[2px] bg-gray-200" />
            <div className="absolute left-0 top-1/2 w-5 h-[2px] bg-gray-200" />
            <div className="flex flex-row gap-2 items-center justify-between w-full">
              <span
                className="hover:text-blue-600 truncate ... transition-all duration-300 
                 cursor-pointer hover:translate-y-[-2px] hover:font-bold"
              >
                🏗️ {floor.name}
              </span>
            </div>
          </Link>
          {floor.locations?.map((location, locationIndex) => (
            <React.Fragment key={location.id}>
              <Link
                to={`/${tenantId}/topology/floors/${floor.id}/locations/${location.id}`}
                className="flex items-center relative ml-2 pt-1 pb-1 pl-[40px]
                  whitespace-nowrap cursor-pointer"
              >
                <div
                  className={`absolute left-0 top-0 h-full w-[2px] bg-gray-200 ${
                    locationIndex === floor.locations.length - 1 ? "h-1/2" : ""
                  }`}
                />
                <div className="absolute left-0 top-1/2 w-8 h-[2px] bg-gray-200" />
                <span
                  className="hover:text-blue-600 transition-all duration-300 
                 cursor-pointer hover:translate-y-[-2px] hover:font-bold truncate ..."
                >
                  🎯 {location.name}
                </span>
              </Link>
              {location.spots?.map((spot) => (
                <div
                  key={spot.id}
                  style={{ paddingLeft: "60px" }}
                  className="flex items-center relative ml-2 pt-1 pb-1"
                >
                  <div className="absolute left-0 top-0 h-full w-[2px] bg-gray-200" />
                  <div className="absolute left-0 top-1/2 w-12 h-[2px] bg-gray-200" />
                  <span className="text-sm truncate ...">📍 {spot.name}</span>
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      ))}
    </>
  );
};
