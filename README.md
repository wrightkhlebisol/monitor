# Region Status Monitor

A full-stack project with a Node.js (TypeScript) WebSocket server and a React (TypeScript) client. The server periodically fetches status from multiple regional endpoints and broadcasts updates to all connected clients. The client displays a real-time dashboard for monitoring regional service status.

## Features
- Real-time status updates from multiple regions
- WebSocket communication with automatic reconnection
- Error handling and endpoint deduplication
- Strict TypeScript throughout
- Unit/integration tests
- Responsive dashboard UI

## Getting Started

### Prerequisites
- Node.js >= 18
- npm >= 9
- Ligthtsail or any other VPS for server deployment

### Setup

#### Server
```bash
cd server
npm install
npm run build
npm start
```

#### Client
```bash
cd client
npm install
npm start
```

## Deployment

### Server (Amazon Lightsail)
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

### Client (Vercel)
1. Deploy to Vercel:
```bash
cd client
vercel
```

2. Set environment variables in Vercel dashboard:
- `NEXT_PUBLIC_WS_HOST`: Your WebSocket server URL (e.g., `ws://your-lightsail-ip/ws`)

## Testing

#### Server
```bash
cd server
npm test
```

#### Client
```bash
cd client
npm test
```

## Monitoring

### Server
```bash
# View logs
pm2 logs websocket-monitor

# Monitor process
pm2 monit

# Check status
pm2 status
```

## Security
- WebSocket connections are handled through Nginx proxy
- Automatic reconnection with exponential backoff
- Error handling and validation throughout
- Type safety with TypeScript

---