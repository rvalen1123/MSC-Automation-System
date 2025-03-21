FROM debian:bullseye-slim

# Install dependencies
RUN apt-get update && \
    apt-get install -y curl unzip git && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash
ENV BUN_INSTALL="/root/.bun"
ENV PATH="$BUN_INSTALL/bin:$PATH"

# Create app directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN bun install

# Copy application code
COPY . .

# Expose the port the app runs on
ENV PORT=3000
EXPOSE 3000

# Start the app
CMD ["bun", "run", "start"] 