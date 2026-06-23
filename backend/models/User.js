'use strict';
const db = require('../config/database');

module.exports = {
  async findByEmail(email) {
    const { data, error } = await db.from('users').select('*').eq('email', email).maybeSingle();
    if (error) throw error;
    return data;
  },
  async findById(id) {
    const { data, error } = await db.from('users').select('id,name,email,created_at').eq('id', id).maybeSingle();
    if (error) throw error;
    return data;
  },
  async create(name, email, hashedPw) {
    const { data, error } = await db.from('users').insert([{ name, email, password: hashedPw }]).select('id,name,email').single();
    if (error) throw error;
    return data;
  },
};
