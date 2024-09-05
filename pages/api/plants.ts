// pages/api/plant.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getDB, Plants, Diseases, PlantDiseases } from '../../config/schema';
import { sql } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { action, ...data } = req.body;
    try {
      const db = getDB();
      switch (action) {
        case 'addPlant':
          const [newPlant] = await db.insert(Plants).values({
            name: data.name,
            scientificName: data.scientificName,
            commonNames: data.commonNames,
            description: data.description,
          }).returning();
          res.status(200).json({ message: 'Plant added successfully', plantId: newPlant.id });
          break;
        case 'addDisease':
          const [newDisease] = await db.insert(Diseases).values({
            name: data.name,
            description: data.description,
          }).returning();
          res.status(200).json({ message: 'Disease added successfully', diseaseId: newDisease.id });
          break;
        case 'associateDiseaseWithPlant':
          const { plantId, diseaseId } = data;
          const [association] = await db
            .insert(PlantDiseases)
            .values({ plantId, diseaseId })
            .onConflictDoUpdate({
              target: [PlantDiseases.plantId, PlantDiseases.diseaseId],
              set: {
                count: sql`${PlantDiseases.count} + 1`,
                lastDetected: new Date(),
              },
            })
            .returning();
          res.status(200).json({ message: 'Disease associated with plant successfully', association });
          break;
        default:
          res.status(400).json({ message: 'Invalid action' });
      }
    } catch (error: unknown) {
      console.error('API Error:', error);
      if (error instanceof Error) {
        res.status(500).json({ message: 'Database error', error: error.message });
      } else {
        res.status(500).json({ message: 'An unknown error occurred' });
      }
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}