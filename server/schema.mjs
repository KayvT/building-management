/*******************************************************
 * schema.mjs
 *
 * ESM file that exports the GraphQL SDL for tenants,
 * floors, locations, spots, tasks, and operatives.
 *******************************************************/
import { gql } from 'graphql-tag';

export const typeDefs = gql`
  """
  A Tenant is like a top-level container. Each tenant has:
  - a list of floors (topology),
  - a list of tasks,
  - a list of operatives.
  """
  type Tenant {
    id: ID!
    name: String!
    floors: [Floor!]!
    tasks: [Task!]!
    operatives: [Operative!]!
  }

  """
  A Floor belongs to one Tenant, and contains Locations.
  """
  type Floor {
    id: ID!
    name: String!
    locations: [Location!]!
  }

  """
  A Location belongs to one Floor.
  It may have zero or more Spots.
  """
  type Location {
    id: ID!
    name: String!
    occupancy: OccupancyStatus!
    locationType: LocationType!
    spots: [Spot!]!
  }

  """
  A Spot is a fine-grained point in a Location.
  """
  type Spot {
    id: ID!
    name: String!
  }

  """
  A Task belongs to exactly one Location. It can have zero or one Operative.
  """
  type Task {
    id: ID!
    location: Location!
    state: TaskState!
    createdAt: String!
    dueAt: String
    priority: PriorityLevel!
    operative: Operative
  }

  """
  An Operative belongs to one Tenant, and can be human or a robot.
  """
  type Operative {
    id: ID!
    name: String!
    code: String!
    isHuman: Boolean!
  }

  """
  Enums
  """
  enum TaskState {
    OPEN
    CLOSED
  }

  enum OccupancyStatus {
    OCCUPIED
    UNOCCUPIED
  }

  enum LocationType {
    OFFICE
    EATING_AREA
    WASH_ROOM
    RECEPTION
    CORRIDOR
    OTHER
  }

  enum PriorityLevel {
    LOW
    MEDIUM
    HIGH
    URGENT
  }

  """
  Input types for optional filters or updates.
  """
  input TaskFilterInput {
    state: TaskState
    priority: PriorityLevel
    operativeId: ID
  }

  input UpdateFloorInput {
    name: String
  }

  input UpdateLocationInput {
    name: String
    occupancy: OccupancyStatus
    locationType: LocationType
  }

  input UpdateSpotInput {
    name: String
  }

  """
  Root Query:
  - 'tenants': list all tenants (NO X-Tenant-ID header required)
  - 'tenant': the single tenant from X-Tenant-ID
  - 'tasks', 'floors', 'locations', etc. all derived from the X-Tenant-ID
  """
  type Query {
    "List all tenants in the system"
    tenants: [Tenant!]!

    "Retrieve the tenant indicated by X-Tenant-ID"
    tenant: Tenant

    "List tasks (optionally filtered) for the tenant from X-Tenant-ID"
    tasks(filter: TaskFilterInput): [Task!]!

    "Retrieve all floors for the tenant from X-Tenant-ID"
    floors: [Floor!]!

    "Retrieve a single floor by ID in the tenant from X-Tenant-ID"
    floor(id: ID!): Floor

    "Retrieve a single location by ID in the tenant from X-Tenant-ID"
    location(id: ID!): Location

    "Retrieve a single task by ID in the tenant from X-Tenant-ID"
    task(id: ID!): Task

    "List all operatives in the tenant from X-Tenant-ID"
    operatives: [Operative!]!

    "Retrieve a single operative by ID in the tenant from X-Tenant-ID"
    operative(id: ID!): Operative
  }

  """
  Root Mutation:
  - For single-tenant operations, we use the X-Tenant-ID from context
  """
  type Mutation {
    "Create a new tenant"
    createTenant(name: String!): Tenant!

    "Create a new task"
    createTask(
      locationId: ID!
      state: TaskState = OPEN
      createdAt: String!
      dueAt: String
      priority: PriorityLevel!
      operativeId: ID
    ): Task!

    "Assign or unassign a task"
    assignTask(taskId: ID!, operativeId: ID): Task!

    "Close a task (sets state to CLOSED)"
    closeTask(taskId: ID!): Task!

    "Create a floor in the tenant from X-Tenant-ID"
    createFloor(name: String!): Floor!

    "Update a floor"
    updateFloor(floorId: ID!, data: UpdateFloorInput!): Floor!

    "Delete a floor if no tasks are in that branch"
    deleteFloor(floorId: ID!): Boolean!

    "Create a location in a floor"
    createLocation(
      floorId: ID!
      name: String!
      occupancy: OccupancyStatus!
      locationType: LocationType!
    ): Location!

    "Update a location's attributes"
    updateLocation(locationId: ID!, data: UpdateLocationInput!): Location!

    "Delete a location if no tasks reference it"
    deleteLocation(locationId: ID!): Boolean!

    "Create a spot in a location"
    createSpot(locationId: ID!, name: String!): Spot!

    "Update a spot"
    updateSpot(spotId: ID!, data: UpdateSpotInput!): Spot!

    "Delete a spot if no tasks reference it"
    deleteSpot(spotId: ID!): Boolean!

    """
    Create an operative in the tenant from X-Tenant-ID.
    """
    createOperative(name: String!, code: String!, isHuman: Boolean!): Operative!

    """
    Delete an operative if it's not assigned to any tasks in the tenant.
    Returns true if deletion succeeded, false otherwise.
    """
    deleteOperative(operativeId: ID!): Boolean!
  }
`;
