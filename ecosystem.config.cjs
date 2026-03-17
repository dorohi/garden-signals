module.exports = {
  apps: [
    {
      name: "dacha-server",
      cwd: "/opt/dacha-care",
      script: "/usr/bin/bash",
      args: "-c 'pnpm dev:server'",
      interpreter: "none",
    },
  ],
};
