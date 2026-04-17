const dotenv = require('dotenv');

dotenv.config();

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  /** Next.js ile çakışmaması için varsayılan 4000; .env ile değiştirilebilir */
  port: Number(process.env.PORT || 4000),
  mongodbUri: required('MONGODB_URI'),
  jwtAccessSecret: required('JWT_ACCESS_SECRET'),
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '7d',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  /** `ADMIN_BOOTSTRAP=0` ise varsayılan admin kullanıcı oluşturma/güncelleme çalışmaz */
  adminBootstrap: process.env.ADMIN_BOOTSTRAP !== '0'
};

module.exports = { env };

