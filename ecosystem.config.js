module.exports = {
  apps: [
    {
      name: "zkclan",
      script: "server.js",
      args: "start",
      cwd: "./",
      instances: "1",
      exec_mode: "cluster",
      max_memory_restart: "500M",
      env: {
        PORT: 3356,
        NODE_ENV: "production",
      },
    },
  ],
};
