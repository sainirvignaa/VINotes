const mongoose = require('mongoose');
(async () => {
  try {
    const uri = 'mongodb://localhost:27017/vinotes';
    await mongoose.connect(uri);
    const users = await mongoose.connection.collection('users').find({}).limit(10).toArray();
    console.log('USERS', users.map(u => ({
      _id: u._id.toString(),
      email: u.email,
      passwordHashType: typeof u.passwordHash,
      hasPasswordHash: !!u.passwordHash,
      passwordHashSample: u.passwordHash ? u.passwordHash.slice(0, 10) : null,
    })));
    await mongoose.disconnect();
  } catch (err) {
    console.error('ERR', err.message);
    process.exit(1);
  }
})();
