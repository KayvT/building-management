export type Floor = {
  id: string;
  name: string;
  locations: Location[];
};

export type Location = {
  id: string;
  name: string;
  spots: Spot[];
  occupancy: string;
  locationType: string;
};
export type Spot = {
  id: string;
  name: string;
};

export type Floors = Floor[];
