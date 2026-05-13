# Stage 1: Build the Frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Stage 2: Setup the Backend and Nginx
FROM python:3.11-slim
WORKDIR /app

# Install Nginx and other tools
RUN apt-get update && apt-get install -y nginx && rm -rf /var/lib/apt/lists/*

# Install Backend dependencies
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt
COPY backend/ ./backend/

# Copy the Frontend build to Nginx's folder
COPY --from=frontend-build /app/frontend/dist /usr/share/nginx/html

# Copy our custom Nginx config
COPY frontend/nginx.conf /etc/nginx/sites-available/default
RUN ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

# Create a startup script to run both Nginx and the Backend
RUN echo "#!/bin/bash\nnginx\ncd backend && python main.py" > /app/start.sh
RUN chmod +x /app/start.sh

# Expose ports (80 for Frontend, 8001 for Backend)
EXPOSE 80
EXPOSE 8001

# Start everything
CMD ["/app/start.sh"]
