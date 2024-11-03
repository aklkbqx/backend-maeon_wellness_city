FROM oven/bun:latest

# Install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    chromium \
    xvfb \
    x11vnc \
    novnc \
    websockify \
    fluxbox \
    xauth \
    xterm \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY bun.lockb ./

# Install dependencies
RUN bun install

# Copy source code
COPY src/ ./src/

# Add script to start services
COPY start-services.sh /start-services.sh
RUN chmod +x /start-services.sh

# Set environment variables
ENV DISPLAY=:99
ENV PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium
ENV HOME=/root
ENV LANG=en_US.UTF-8

# Create necessary directories
RUN mkdir -p /tmp/.X11-unix && \
    chmod 1777 /tmp/.X11-unix

# Expose ports
EXPOSE 3000 5900 6080

# Start services
CMD ["/start-services.sh"]