export type TenantData = {
  id: string;
  name: string;
  floors: TenantFloor[];
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

// 2) Combine them into a single union:
export type TenantEntry = FloorEntry | LocationEntry | SpotEntry;
