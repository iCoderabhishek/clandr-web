export default function APIDocumentationPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <h1 style={{ color: '#333', marginBottom: '1rem' }}>Calendr API Documentation</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Backend API for Calendr React Native mobile application
      </p>

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#333', borderBottom: '2px solid #eee', paddingBottom: '0.5rem' }}>Available Endpoints</h2>
        
        <div style={{ marginTop: '1rem' }}>
          <h3 style={{ color: '#555' }}>Authentication</h3>
          <ul style={{ color: '#666' }}>
            <li><code>POST /api/auth/webhook</code> - Clerk user sync webhook</li>
          </ul>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <h3 style={{ color: '#555' }}>Events</h3>
          <ul style={{ color: '#666' }}>
            <li><code>GET /api/events</code> - Get user's events</li>
            <li><code>POST /api/events</code> - Create new event</li>
            <li><code>GET /api/events/[id]</code> - Get specific event</li>
            <li><code>PUT /api/events/[id]</code> - Update event</li>
            <li><code>DELETE /api/events/[id]</code> - Delete event</li>
          </ul>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <h3 style={{ color: '#555' }}>Schedule</h3>
          <ul style={{ color: '#666' }}>
            <li><code>GET /api/schedule</code> - Get user's schedule</li>
            <li><code>POST /api/schedule</code> - Save user's schedule</li>
          </ul>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <h3 style={{ color: '#555' }}>Meetings</h3>
          <ul style={{ color: '#666' }}>
            <li><code>POST /api/meetings</code> - Create meeting</li>
          </ul>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <h3 style={{ color: '#555' }}>Public Booking</h3>
          <ul style={{ color: '#666' }}>
            <li><code>GET /api/book/[userId]</code> - Get user's public events</li>
            <li><code>GET /api/book/[userId]/[eventId]</code> - Get booking availability</li>
          </ul>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <h3 style={{ color: '#555' }}>Health Check</h3>
          <ul style={{ color: '#666' }}>
            <li><code>GET /api/health</code> - API health status</li>
          </ul>
        </div>
      </div>

      <div style={{ backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '4px', border: '1px solid #e9ecef' }}>
        <h3 style={{ color: '#333', marginTop: 0 }}>Authentication</h3>
        <p style={{ color: '#666', margin: 0 }}>
          All endpoints (except webhooks and health check) require authentication via Clerk.
          Include the Bearer token in the Authorization header.
        </p>
      </div>
    </div>
  );
}