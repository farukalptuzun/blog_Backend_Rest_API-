const fs = require('fs');
const path = require('path');

const { env } = require('./config/env');
const { connectDb } = require('./config/db');
const { createApp } = require('./app');

async function ensureUploadDir() {
  const uploadsPath = path.resolve(process.cwd(), env.uploadDir);
  await fs.promises.mkdir(uploadsPath, { recursive: true });
}

async function main() {
  await ensureUploadDir();
  await connectDb(env.mongodbUri);

  const app = createApp();

  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on :${env.port}`);
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

