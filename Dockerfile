FROM node:20-bullseye-slim

# Install system dependencies for Chromium, FFmpeg and Fonts
RUN apt-get update && apt-get install -y \
    chromium \
    ffmpeg \
    fonts-liberation \
    fonts-noto-color-emoji \
    libnss3 \
    libatk-bridge2.0-0 \
    libx11-xcb1 \
    libxcb-dri3-0 \
    libxss1 \
    libxtst6 \
    libxkbcommon0 \
    libgbm1 \
    libasound2 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables for Puppeteer / Remotion
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Set up pnpm
RUN npm install -g pnpm

WORKDIR /app

# Ensure uploads folder exists and is owned by the node user
RUN mkdir -p /app/uploads && chown -R node:node /app

# Switch to the non-root node user (which already has UID 1000)
USER node

# Copy package files first for caching
COPY --chown=node:node package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install

# Copy all source files
COPY --chown=node:node . .

# Build Next.js application
RUN pnpm run build

# Expose port (Hugging Face uses 7860, Render uses 10000/3000)
EXPOSE 7860
EXPOSE 10000
EXPOSE 3000

# Start server
CMD ["pnpm", "run", "prod"]
