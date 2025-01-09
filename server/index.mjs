/*******************************************************
 * index.mjs
 *
 * A multi-tenant server using "Tenant" as the
 * top-level concept. Data is in memory. "X-Tenant-ID" 
 * is required for all queries/mutations except for
 * 'tenants', which lists all tenants without needing
 * an ID in the header.
 *******************************************************/
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema.mjs';

// -----------------------------------------------------
// 1) In-Memory Data
// -----------------------------------------------------

// We have multiple tenants. Each tenant has floors, tasks, operatives, etc.
// We'll store them in separate arrays referencing tenantId.

const tenantsDB = [
  { id: 'tnt1', name: 'Tenant Alpha' },
  { id: 'tnt2', name: 'Tenant Bravo' },
];

// Floors
const floorsDB = [
  { id: 'fl1', tenantId: 'tnt1', name: 'Floor 1' },
  { id: 'fl2', tenantId: 'tnt2', name: 'Main Floor' },
];

// Locations
const locationsDB = [
  {
    id: 'loc1',
    tenantId: 'tnt1',
    floorId: 'fl1',
    name: 'Office 101',
    occupancy: 'OCCUPIED',
    locationType: 'OFFICE',
  },
  {
    id: 'loc2',
    tenantId: 'tnt2',
    floorId: 'fl2',
    name: 'Warehouse',
    occupancy: 'UNOCCUPIED',
    locationType: 'OTHER',
  },
];

// Spots
const spotsDB = [
  { id: 'sp1', tenantId: 'tnt1', locationId: 'loc1', name: 'Desk 1' },
];

// Tasks
const tasksDB = [
  {
    id: 'tsk1',
    tenantId: 'tnt1',
    locationId: 'loc1',
    state: 'OPEN',
    createdAt: '2024-01-01T09:00:00Z',
    dueAt: '2024-01-05T17:00:00Z',
    priority: 'MEDIUM',
    operativeId: null,
  },
];

// Operatives
const operativesDB = [
  {
    id: 'op1',
    tenantId: 'tnt1',
    name: 'Alice',
    code: 'A100',
    isHuman: true,
  },
  {
    id: 'op2',
    tenantId: 'tnt2',
    name: 'BobBot',
    code: 'B200',
    isHuman: false,
  },
];

// Priority helper
const priorityOrder = { LOW: 1, MEDIUM: 2, HIGH: 3, URGENT: 4 };

// -----------------------------------------------------
// 2) Utility Functions
// -----------------------------------------------------
function getTenantOrThrow(tenantId) {
  const tenant = tenantsDB.find((t) => t.id === tenantId);
  if (!tenant) {
    throw new Error(`Tenant '${tenantId}' not found.`);
  }
  return tenant;
}

function noTasksInFloor(floorId) {
  // If any location under this floor has tasks, we can't delete it
  const locs = locationsDB.filter((l) => l.floorId === floorId);
  for (const loc of locs) {
    if (tasksDB.some((t) => t.locationId === loc.id)) {
      return false;
    }
  }
  return true;
}

function noTasksInLocation(locationId) {
  return !tasksDB.some((t) => t.locationId === locationId);
}


// -----------------------------------------------------
// 3) Resolvers
// -----------------------------------------------------
const resolvers = {
  // -------------------------
  // Type Resolvers
  // -------------------------
  Tenant: {
    floors: (parent) => floorsDB.filter((f) => f.tenantId === parent.id),
    tasks: (parent) => tasksDB.filter((t) => t.tenantId === parent.id),
    operatives: (parent) =>
      operativesDB.filter((op) => op.tenantId === parent.id),
  },

  Floor: {
    locations: (parent) => locationsDB.filter((l) => l.floorId === parent.id),
  },

  Location: {
    spots: (parent) => spotsDB.filter((s) => s.locationId === parent.id)
  },

  Task: {
    location: (parent) =>
      locationsDB.find((l) => l.id === parent.locationId) || null,
    operative: (parent) => {
      if (!parent.operativeId) return null;
      return operativesDB.find((op) => op.id === parent.operativeId) || null;
    },
  },

  // -------------------------
  // Query Resolvers
  // -------------------------
  Query: {
    // 1) List all tenants (no tenantId required)
    tenants: () => {
      return tenantsDB;
    },

    // 2) Return the single tenant from X-Tenant-ID
    tenant: (_, __, { tenantId }) => {
      if (!tenantId) return null; // or throw an error
      return tenantsDB.find((t) => t.id === tenantId) || null;
    },

    // 3) tasks
    tasks: (_, { filter }, { tenantId }) => {
      if (!tenantId) throw new Error(`Missing 'X-Tenant-ID' header`);
      const base = tasksDB.filter((t) => t.tenantId === tenantId);
      if (!filter) return base;

      let result = base;
      if (filter.state) {
        result = result.filter((t) => t.state === filter.state);
      }
      if (filter.priority) {
        result = result.filter((t) => t.priority === filter.priority);
      }
      if (filter.operativeId) {
        result = result.filter((t) => t.operativeId === filter.operativeId);
      }
      return result;
    },

    // 4) floors
    floors: (_, __, { tenantId }) => {
      if (!tenantId) throw new Error(`Missing 'X-Tenant-ID' header`);
      return floorsDB.filter((f) => f.tenantId === tenantId);
    },

    // 5) floor by ID
    floor: (_, { id }, { tenantId }) => {
      if (!tenantId) throw new Error(`Missing 'X-Tenant-ID' header`);
      return floorsDB.find((f) => f.id === id && f.tenantId === tenantId) || null;
    },

    // 6) location by ID
    location: (_, { id }, { tenantId }) => {
      if (!tenantId) throw new Error(`Missing 'X-Tenant-ID' header`);
      return locationsDB.find(
        (l) => l.id === id && l.tenantId === tenantId
      ) || null;
    },

    // 7) task by ID
    task: (_, { id }, { tenantId }) => {
      if (!tenantId) throw new Error(`Missing 'X-Tenant-ID' header`);
      return tasksDB.find((t) => t.id === id && t.tenantId === tenantId) || null;
    },

    // 8) operatives
    operatives: (_, __, { tenantId }) => {
      if (!tenantId) throw new Error(`Missing 'X-Tenant-ID' header`);
      return operativesDB.filter((o) => o.tenantId === tenantId);
    },

    // 9) operative by ID
    operative: (_, { id }, { tenantId }) => {
      if (!tenantId) throw new Error(`Missing 'X-Tenant-ID' header`);
      return operativesDB.find((o) => o.id === id && o.tenantId === tenantId) || null;
    },
  },

  // -------------------------
  // Mutation Resolvers
  // -------------------------
  Mutation: {
    // 1) Create a new tenant
    createTenant: (_, { name }) => {
      const newTenant = {
        id: `tnt${Date.now()}`,
        name,
      };
      tenantsDB.push(newTenant);
      return newTenant;
    },

    // 2) Create a Task
    createTask: (
      _,
      { locationId, state, createdAt, dueAt, priority, operativeId },
      { tenantId }
    ) => {
      if (!tenantId) throw new Error(`Missing 'X-Tenant-ID' header`);

      const loc = locationsDB.find(
        (l) => l.id === locationId && l.tenantId === tenantId
      );
      if (!loc) {
        throw new Error(`Location '${locationId}' not found in current tenant.`);
      }

      if (operativeId) {
        const op = operativesDB.find(
          (o) => o.id === operativeId && o.tenantId === tenantId
        );
        if (!op) {
          throw new Error(`Operative '${operativeId}' not found in current tenant.`);
        }
      }

      const newTask = {
        id: `tsk${Date.now()}`,
        tenantId,
        locationId,
        state,
        createdAt,
        dueAt: dueAt || null,
        priority,
        operativeId: operativeId || null,
      };
      tasksDB.push(newTask);
      return newTask;
    },

    // 3) Assign a Task
    assignTask: (_, { taskId, operativeId }, { tenantId }) => {
      if (!tenantId) throw new Error(`Missing 'X-Tenant-ID' header`);

      const task = tasksDB.find((t) => t.id === taskId && t.tenantId === tenantId);
      if (!task) {
        throw new Error(`Task '${taskId}' not found in current tenant.`);
      }

      if (!operativeId) {
        task.operativeId = null; // unassign
        return task;
      }

      const operative = operativesDB.find(
        (op) => op.id === operativeId && op.tenantId === tenantId
      );
      if (!operative) {
        throw new Error(`Operative '${operativeId}' not found in current tenant.`);
      }

      task.operativeId = operativeId;
      return task;
    },

    // 4) Close a Task
    closeTask: (_, { taskId }, { tenantId }) => {
      if (!tenantId) throw new Error(`Missing 'X-Tenant-ID' header`);

      const task = tasksDB.find((t) => t.id === taskId && t.tenantId === tenantId);
      if (!task) {
        throw new Error(`Task '${taskId}' not found in current tenant.`);
      }
      task.state = 'CLOSED';
      return task;
    },

    // 5) Create a Floor
    createFloor: (_, { name }, { tenantId }) => {
      if (!tenantId) throw new Error(`Missing 'X-Tenant-ID' header`);
      getTenantOrThrow(tenantId);

      const newFloor = {
        id: `fl${Date.now()}`,
        tenantId,
        name,
      };
      floorsDB.push(newFloor);
      return newFloor;
    },

    // 6) Update a Floor
    updateFloor: (_, { floorId, data }, { tenantId }) => {
      if (!tenantId) throw new Error(`Missing 'X-Tenant-ID' header`);

      const floor = floorsDB.find(
        (f) => f.id === floorId && f.tenantId === tenantId
      );
      if (!floor) {
        throw new Error(`Floor '${floorId}' not found in current tenant.`);
      }
      if (typeof data.name === 'string') {
        floor.name = data.name;
      }
      return floor;
    },

    // 7) Delete a Floor
    deleteFloor: (_, { floorId }, { tenantId }) => {
      if (!tenantId) throw new Error(`Missing 'X-Tenant-ID' header`);

      const index = floorsDB.findIndex(
        (f) => f.id === floorId && f.tenantId === tenantId
      );
      if (index < 0) {
        throw new Error(`Floor '${floorId}' not found in current tenant.`);
      }
      if (!noTasksInFloor(floorId)) {
        return false;
      }
      floorsDB.splice(index, 1);
      return true;
    },

    // 8) Create a Location
    createLocation: (
      _,
      { floorId, name, occupancy, locationType },
      { tenantId }
    ) => {
      if (!tenantId) throw new Error(`Missing 'X-Tenant-ID' header`);

      const floor = floorsDB.find(
        (f) => f.id === floorId && f.tenantId === tenantId
      );
      if (!floor) {
        throw new Error(`Floor '${floorId}' not found in current tenant.`);
      }

      const newLoc = {
        id: `loc${Date.now()}`,
        tenantId,
        floorId,
        name,
        occupancy,
        locationType,
      };
      locationsDB.push(newLoc);
      return newLoc;
    },

    // 9) Update a Location
    updateLocation: (_, { locationId, data }, { tenantId }) => {
      if (!tenantId) throw new Error(`Missing 'X-Tenant-ID' header`);

      const loc = locationsDB.find(
        (l) => l.id === locationId && l.tenantId === tenantId
      );
      if (!loc) {
        throw new Error(`Location '${locationId}' not found in current tenant.`);
      }

      if (typeof data.name === 'string') loc.name = data.name;
      if (data.occupancy) loc.occupancy = data.occupancy;
      if (data.locationType) loc.locationType = data.locationType;
      return loc;
    },

    // 10) Delete a Location
    deleteLocation: (_, { locationId }, { tenantId }) => {
      if (!tenantId) throw new Error(`Missing 'X-Tenant-ID' header`);

      const index = locationsDB.findIndex(
        (l) => l.id === locationId && l.tenantId === tenantId
      );
      if (index < 0) {
        throw new Error(`Location '${locationId}' not found in current tenant.`);
      }
      if (!noTasksInLocation(locationId)) {
        return false;
      }
      locationsDB.splice(index, 1);
      return true;
    },

    // 11) Create a Spot
    createSpot: (_, { locationId, name }, { tenantId }) => {
      if (!tenantId) throw new Error(`Missing 'X-Tenant-ID' header`);

      const loc = locationsDB.find(
        (l) => l.id === locationId && l.tenantId === tenantId
      );
      if (!loc) {
        throw new Error(`Location '${locationId}' not found in current tenant.`);
      }
      const newSpot = {
        id: `sp${Date.now()}`,
        tenantId,
        locationId,
        name,
      };
      spotsDB.push(newSpot);
      return newSpot;
    },

    // 12) Update a Spot
    updateSpot: (_, { spotId, data }, { tenantId }) => {
      if (!tenantId) throw new Error(`Missing 'X-Tenant-ID' header`);

      const spot = spotsDB.find(
        (s) => s.id === spotId && s.tenantId === tenantId
      );
      if (!spot) {
        throw new Error(`Spot '${spotId}' not found in current tenant.`);
      }
      if (typeof data.name === 'string') {
        spot.name = data.name;
      }
      return spot;
    },

    // 13) Delete a Spot
    deleteSpot: (_, { spotId }, { tenantId }) => {
      if (!tenantId) throw new Error(`Missing 'X-Tenant-ID' header`);

      const index = spotsDB.findIndex(
        (s) => s.id === spotId && s.tenantId === tenantId
      );
      if (index < 0) {
        throw new Error(`Spot '${spotId}' not found in current tenant.`);
      }
      spotsDB.splice(index, 1);
      return true;
    },

    // 14) Create an Operative
    createOperative: (_, { name, code, isHuman }, { tenantId }) => {
        // 1) Check if X-Tenant-ID is present
        if (!tenantId) {
          throw new Error(`Missing 'X-Tenant-ID' header`);
        }
      
        // 2) Verify the tenant actually exists
        const tenantExists = tenantsDB.some((t) => t.id === tenantId);
        if (!tenantExists) {
          throw new Error(`Tenant '${tenantId}' not found.`);
        }
      
        // 3) Create the operative in-memory
        const newOperative = {
          id: `op${Date.now()}`,
          tenantId,
          name,
          code,
          isHuman,
        };
        operativesDB.push(newOperative);
      
        return newOperative;
    },

    // 15) Delete an Operative
    deleteOperative: (_, { operativeId }, { tenantId }) => {
        if (!tenantId) throw new Error(`Missing 'X-Tenant-ID' header`);
    
        // Find the operative in the current tenant
        const index = operativesDB.findIndex(
        (op) => op.id === operativeId && op.tenantId === tenantId
        );
        if (index < 0) {
          throw new Error(`Operative '${operativeId}' not found in current tenant.`);
        }
    
        // Check if the operative is assigned to any tasks
        const isAssigned = tasksDB.some(
        (task) => task.tenantId === tenantId && task.operativeId === operativeId
        );
        if (isAssigned) {
          // Return false or throw an error – up to you
          return false;
        }
    
        // Remove the operative from the array
        operativesDB.splice(index, 1);
        return true;
    },
  },
};


/***********************************************************************
 * toggle the occupancy of a random location of each tenant every minute
 ***********************************************************************/
function toggleRandomLocationOccupancy() {
    // For each tenant, we’ll pick one random location (if any exist) and toggle it
    tenantsDB.forEach((tenant) => {
      // Gather all locations belonging to this tenant
      const tenantLocations = locationsDB.filter((loc) => loc.tenantId === tenant.id);
  
      // If the tenant has no locations, skip
      if (tenantLocations.length === 0) {
        return;
      }
  
      // Pick a random location
      const randomIndex = Math.floor(Math.random() * tenantLocations.length);
      const location = tenantLocations[randomIndex];
  
      // Toggle occupancy
      location.occupancy = location.occupancy === 'OCCUPIED' ? 'UNOCCUPIED' : 'OCCUPIED';
  
      // Log the change
      console.log(
        `[${new Date().toISOString()}] Toggled location '${location.id}' in tenant '${tenant.id}' to occupancy = ${location.occupancy}`
      );
    });
 }

setInterval(toggleRandomLocationOccupancy, 60_000);


// -----------------------------------------------------
// 4) Start Apollo Server (v4)
// -----------------------------------------------------
async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
  });

  // We allow 'tenants' query with no X-Tenant-ID,
  // but everything else requires X-Tenant-ID.

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req }) => {
      const tenantId = req.headers['x-tenant-id'] || null;
      // If the operation is 'tenants', we won't throw even if tenantId is missing
      const operationName = req.body?.operationName;

      // If we want a more robust approach, we can parse the GraphQL AST.
      // For this example, we do a simple check:
      if (!tenantId && operationName !== 'tenants') {
        // We'll let the resolvers themselves throw if they need tenantId
        // or we could throw a generic error here.
      }
      return { tenantId };
    },
  });

  console.log(`\n🚀 Server is running at ${url}`);
  console.log(`Use the 'X-Tenant-ID' header for tenant-specific ops.\n`);
}

startServer();
