import { Operative } from "./operative";
import { Task } from "./tasks";

export type TenantData = {
  id: string;
  name: string;
  floors: TenantFloor[];
  operatives: Operative[];
  tasks: Task[];
};

export type TenantFloor = {
  id: string;
  name: string;
  locations: FloorLocation[];
};

export type FloorLocation = {
  id: string;
  name: string;
  occupancy: string;
  locationType: string;
  spots: LocationSpot[];
};

export type LocationSpot = {
  id: string;
  name: string;
};

export type FloorEntry = TenantFloor & {
  type: "floor";
};

export type LocationEntry = FloorLocation & {
  type: "location";
};

export type SpotEntry = LocationSpot & {
  type: "spot";
};


export type TenantEntry = FloorEntry | LocationEntry | SpotEntry;
