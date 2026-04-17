const bcrypt = require('bcryptjs');
const { User } = require('../models/User');

const ADMIN_EMAIL = 'admin@localhost';
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = '1234';

/**
 * Varsayılan admin hesabı: kullanıcı adı admin, şifre 1234.
 * İlk kez oluşturulur; mevcut kayıtta rol/username/email eşitlenir, şifre yeniden yazılmaz.
 * Şifreyi tekrar 1234 yapmak için: kullanıcıyı sil veya env ADMIN_RESET_ADMIN_PASSWORD=1.
 */
async function ensureAdminUser() {
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const forceReset = process.env.ADMIN_RESET_ADMIN_PASSWORD === '1';

  let user = await User.findOne({ username: ADMIN_USERNAME });
  if (!user) {
    user = await User.findOne({ email: ADMIN_EMAIL });
  }

  if (user) {
    const $set = {
      username: ADMIN_USERNAME,
      email: ADMIN_EMAIL,
      role: 'admin',
      name: user.name || 'Admin'
    };
    if (forceReset) {
      $set.passwordHash = passwordHash;
    }
    await User.updateOne({ _id: user._id }, { $set });
    // eslint-disable-next-line no-console
    console.log('[bootstrap] Admin kullanıcı güncellendi (kullanıcı adı: admin)');
    return;
  }

  await User.create({
    email: ADMIN_EMAIL,
    username: ADMIN_USERNAME,
    passwordHash,
    name: 'Admin',
    bio: '',
    avatarUrl: '',
    role: 'admin'
  });
  // eslint-disable-next-line no-console
  console.log('[bootstrap] Admin kullanıcı oluşturuldu (kullanıcı adı: admin, şifre: 1234)');
}

module.exports = { ensureAdminUser };
