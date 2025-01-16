const db = require('../config/db')

class User{
  async getAllUsers() {
    const [users] = await db.execute('SELECT * FROM users');
    return users;
  }

  async getUserByEmail(email) {
    const [user] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return user[0];
  }
  
  async getUserByUuid(uuid) {
    const [user] = await db.execute('SELECT * FROM users WHERE uuid = ?', [uuid]);
    return user[0];
  }

  async createUser(data) {
    const [result] = await db.execute('INSERT INTO users (name, email, password, uuid, acct_verified, time_stamp_created) VALUES (?, ?, ?, ?, ?, ?)', [data.name, data.email, data.password, data.uuid, data.acct_verified, data.time_stamp_created]);
    return result.insertId;
  }

  async updateUser1(data) {
    const [result] = await db.execute('UPDATE users SET acct_verified = ?, uuid = ? WHERE Id = ?', [data.verified, data.uuid, data.Id]);
    return result.affectedRows;
  }

  async deleteUser(id) {
    const [result] = await db.execute('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows;
  }
  
}

module.exports = { User }