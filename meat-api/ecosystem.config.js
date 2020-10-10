module.exports = {
    apps: [{
        name: "meat-api",
        script: "./dist/server.js",
        instances: 0,
        execMode: "cluster",
        watch: true,
        env: {
            SERVER_PORT: 3000,
            DB_URL: "mongodb://localhost/meat-api",
            NODE_MODE: "development"
        },
        env_production: {
            SERVER_PORT: 3002,
            NODE_MODE: "production"
        },
  }]
}
