module.exports = {
  apps: [
    {
      name: "socket",
      script: "./index.ts",
      interpreter: "./node_modules/.bin/ts-node",
      exec_mode: "cluster",
    },
  ],
};
