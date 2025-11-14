// API endpoint for emergency configuration
// Allows real-time feature disable via AWS Parameter Store

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Fallback to environment variables for emergency switches
    const config = {
      disabledFeatures: process.env.DISABLED_FEATURES?.split(',') || [],
      maintenanceMode: process.env.MAINTENANCE_MODE === 'true',
      emergencyMessage: process.env.EMERGENCY_MESSAGE
    };
    
    res.status(200).json(config);
  } catch (error) {
    console.error('Emergency config error:', error);
    
    // Safe fallback - disable nothing if config fails
    res.status(200).json({
      disabledFeatures: [],
      maintenanceMode: false
    });
  }
}