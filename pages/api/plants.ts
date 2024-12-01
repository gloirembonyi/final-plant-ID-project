import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod'; // For input validation
import { getDB, Plants, Diseases, PlantDiseases } from '../../config/schema';
import { sql } from 'drizzle-orm';

// Input validation schemas
const AddPlantSchema = z.object({
  name: z.string().min(2, "Plant name must be at least 2 characters"),
  scientificName: z.string().optional(),
  commonNames: z.array(z.string()).optional(),
  description: z.string().optional()
});

const AddDiseaseSchema = z.object({
  name: z.string().min(2, "Disease name must be at least 2 characters"),
  description: z.string().optional()
});

const AssociateDiseaseSchema = z.object({
  plantId: z.number().positive("Plant ID must be a positive number"),
  diseaseId: z.number().positive("Disease ID must be a positive number")
});

// Centralized error handling
class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

// Middleware for input validation
function validateInput(schema: z.ZodSchema, data: any) {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ApiError(
        error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; '),
        400
      );
    }
    throw error;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS and security headers
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { action, ...data } = req.body;
    const db = getDB();

    switch (action) {
      case 'addPlant': {
        const validatedData = validateInput(AddPlantSchema, data);
        
        const [newPlant] = await db.insert(Plants).values({
          name: validatedData.name,
          scientificName: validatedData.scientificName,
          commonNames: validatedData.commonNames,
          description: validatedData.description
        }).returning();

        return res.status(201).json({ 
          message: 'Plant added successfully', 
          plantId: newPlant.id 
        });
      }

      case 'addDisease': {
        const validatedData = validateInput(AddDiseaseSchema, data);
        
        const [newDisease] = await db.insert(Diseases).values({
          name: validatedData.name,
          description: validatedData.description
        }).returning();

        return res.status(201).json({ 
          message: 'Disease added successfully', 
          diseaseId: newDisease.id 
        });
      }

      case 'associateDiseaseWithPlant': {
        const validatedData = validateInput(AssociateDiseaseSchema, data);
        
        const [association] = await db
          .insert(PlantDiseases)
          .values({ 
            plantId: validatedData.plantId, 
            diseaseId: validatedData.diseaseId 
          })
          .onConflictDoUpdate({
            target: [PlantDiseases.plantId, PlantDiseases.diseaseId],
            set: {
              count: sql`${PlantDiseases.count} + 1`,
              lastDetected: new Date(),
            },
          })
          .returning();

        return res.status(200).json({ 
          message: 'Disease associated with plant successfully', 
          association 
        });
      }

      default:
        throw new ApiError('Invalid action', 400);
    }
  } catch (error) {
    console.error('API Error:', error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ 
        message: error.message 
      });
    }

    if (error instanceof Error) {
      return res.status(500).json({ 
        message: 'Internal server error', 
        error: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred' 
      });
    }

    return res.status(500).json({ 
      message: 'An unknown error occurred' 
    });
  }
}