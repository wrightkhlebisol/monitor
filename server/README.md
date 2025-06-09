# Region Status Monitor - Server

Node.js (TypeScript) WebSocket server for the Region Status Monitor. Periodically fetches status from multiple regional endpoints and broadcasts updates to all connected clients.

## Features
- WebSocket server with real-time updates
- Periodic polling of regional endpoints
- Error handling and endpoint deduplication
- Strict TypeScript implementation
- Process management with PM2

## Prerequisites
- Node.js >= 18
- npm >= 9
- Nginx (for production)
- PM2 (for production)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```bash
PORT=8080
NODE_ENV=development
```

3. Build the project:
```bash
npm run build
```

4. Start the server:
```bash
npm start
```

## Deployment (Lightsail)

1. Connect to your Lightsail instance:
```bash
ssh ubuntu@your-lightsail-ip
```

2. Install dependencies:
```bash
sudo apt-get update
sudo apt-get upgrade -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs nginx
sudo npm install -g pm2
```

3. Deploy the server:
```bash
sudo mkdir -p /opt/websocket-monitor
sudo chown ubuntu:ubuntu /opt/websocket-monitor
cd /opt/websocket-monitor
# Copy your server files here
npm install
npm run build
pm2 start build/index.js --name "websocket-monitor"
```

4. Configure Nginx:
```bash
sudo nano /etc/nginx/sites-available/websocket-monitor
```

Add the following configuration:
```nginx
server {
    listen 80;
    server_name _;

    location /ws {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_read_timeout 300s;
        proxy_send_timeout 300s;
        proxy_connect_timeout 75s;
    }
}
```

5. Enable the site and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/websocket-monitor /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Testing
```bash
npm test
```

## Project Structure
```
server/
├── src/
│   ├── index.ts       # Main server file
│   ├── types/         # TypeScript type definitions
│   └── constants.ts   # Application constants
├── tests/            # Test files
└── build/           # Compiled JavaScript files
```

## Development

### Available Scripts
- `npm start`: Start the server
- `npm run dev`: Start development server with hot reload
- `npm run build`: Build for production
- `npm test`: Run tests
- `npm run lint`: Run linter

### Environment Variables
- `PORT`: Server port (default: 8080)
- `NODE_ENV`: Environment (development/production)

## Monitoring

### PM2 Commands
```bash
# View logs
pm2 logs websocket-monitor

# Monitor process
pm2 monit

# Check status
pm2 status

# Restart server
pm2 restart websocket-monitor
```

## Security
- WebSocket connections are proxied through Nginx
- Input validation and sanitization
- Type safety with TypeScript
- Error handling and logging

## Contributing
1. Create a feature branch
2. Make your changes
3. Submit a pull request 