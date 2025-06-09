# Region Status Monitor - Client

React (TypeScript) client for the Region Status Monitor. Displays a real-time dashboard for monitoring regional service status using WebSocket communication.

## Features
- Real-time status updates via WebSocket
- Automatic reconnection with exponential backoff
- Responsive dashboard UI
- Error handling and validation
- Strict TypeScript implementation

## Prerequisites
- Node.js >= 18
- npm >= 9

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root directory:
```bash
NEXT_PUBLIC_WS_HOST=ws://localhost:8080
```

3. Start the development server:
```bash
npm start
```

## Deployment (Vercel)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy to Vercel:
```bash
vercel
```

3. Set environment variables in Vercel dashboard:
- `NEXT_PUBLIC_WS_HOST`: Your WebSocket server URL (e.g., `ws://your-server-ip/ws`)

## Testing
```bash
npm test
```

## Project Structure
```
client/
├── src/
│   ├── components/     # React components
│   ├── hooks/         # Custom React hooks
│   ├── types/         # TypeScript type definitions
│   ├── constants/     # Application constants
│   └── styles/        # CSS styles
├── public/            # Static assets
└── tests/            # Test files
```

## Development

### Available Scripts
- `npm start`: Start development server
- `npm build`: Build for production
- `npm test`: Run tests
- `npm lint`: Run linter

### Environment Variables
- `NEXT_PUBLIC_WS_HOST`: WebSocket server URL
- `NODE_ENV`: Environment (development/production)

## Contributing
1. Create a feature branch
2. Make your changes
3. Submit a pull request

## Security
- WebSocket connections are secured through the server
- Input validation and sanitization
- Type safety with TypeScript 