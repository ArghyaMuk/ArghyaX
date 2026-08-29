# Production Dockerfile for ArghyaX Developer Portfolio
# Multi-stage lightweight Nginx container

FROM nginx:alpine

# Copy custom Nginx configuration for high-performance static serving & caching
RUN rm -rf /usr/share/nginx/html/*

# Copy website files
COPY . /usr/share/nginx/html/

# Expose HTTP port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
