/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./config/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url: 'postgresql://all_plant_diseases_owner:IObzSy9mlxX0@ep-soft-base-a58at763.us-east-2.aws.neon.tech/all_plant_diseases?sslmode=require',
    }
  };