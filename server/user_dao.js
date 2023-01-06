'use strict';
const sqlite = require('sqlite3');

const db = new sqlite.Database('images.db', (err) =>{
  if(err) throw err;
});

const bcrypt = require('bcrypt');

exports.getUser = (email, password) => {    
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.get(sql, [ email ], (err, row) => {
      if (err) { 
        reject(err); 
      }
      else if (row === undefined) {
        resolve(false); 
      }
      else {
        const user = {id: row.id, email: row.email, username: row.username};
                
        bcrypt.compare(password, row.password).then(result => {
          if(result) 
            resolve(user);
          else 
            resolve(false);
        });
      }
    });
  });
};

exports.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err) { 
        reject(err); 
      }
      else if (row === undefined) { 
        resolve({error: 'User not found!'}); 
      }
      else {
        const user = {id: row.id, email: row.email, username: row.username};
        resolve(user);
      }
    });
  });
};