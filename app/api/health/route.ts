import { NextRequest } from 'next/server'

// GET /api/health - Health check endpoint
export async function GET(request: NextRequest) {
  try {
    return Response.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    })
  } catch (error: any) {
    return Response.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message
      },
      { status: 500 }
    )
  }
}