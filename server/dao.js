'use strict';
/* Data Access Object (DAO) module for accessing courses and exams */

const sqlite = require('sqlite3');

// open the database
const db = new sqlite.Database('images.db', (err) => {
  if(err) throw err;
});

// get all images
exports.listMemes = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT *, (MAX(field)+1) as max FROM memes, users, images WHERE memes.visibility="public" AND users.id=memes.admin AND memes.iid=images.iid GROUP BY memes.mid, memes.iid, memes.title, memes.admin, memes.visibility, memes.font, memes.color';
      db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        const images = rows.map((s) => ({id: s.mid, iid:s.iid, title: s.title, admin: s.admin, username: s.username, visibility: s.visibility, fields:s.max, color:s.color, font:s.font}));
        resolve(images);
      });
    });
};

// get protected images
exports.listProtectedMemes = () => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT *, (MAX(field)+1) as max FROM memes, users, images WHERE users.id=memes.admin AND memes.iid=images.iid GROUP BY memes.mid, memes.iid, memes.title, memes.admin, memes.visibility, memes.font, memes.color';
      db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        const images = rows.map((s) => ({id: s.mid, iid: s.iid, title: s.title, admin: s.admin, username: s.username, visibility: s.visibility, fields: s.max, font:s.font, color:s.color}));
        resolve(images);
      });
    });
};

// get meme sentences
exports.listSentencesForMeme = (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM sentences, images, memes WHERE memes.mid=sentences.id AND memes.iid=images.iid AND sentences.sid=images.field AND sentences.id=?';
      db.all(sql, [id], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        let answer = new Array(rows.length);
        for(let r of rows){
            answer[r.sid] = {sentence: r.sentence, left: r.left, bottom: r.bottom};
        }
        resolve(answer);
        
      });
    });
};

// get images
exports.listImages = () => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM images';
      db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        const images = rows.map((s) => ({id: s.iid, field: s.field, left:s.left, bottom:s.bottom}));
        resolve(images);
      });
    });
};

// create a meme
exports.insertMeme = (m) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO memes(iid, title, visibility, admin, font, color) VALUES(?,?,?,?,?,?)'; 
        db.run(sql, [m.iid,m.title,m.visibility,m.admin,m.font,m.color], function (err) {
          if (err) {
            reject(err);
            return;
          }
          resolve(this.lastID);
        });
      });
};

//create a sentence for a meme
exports.insertSentence = (a, sid) => {
    return new Promise((resolve, reject) => {  
      const sql = 'INSERT INTO sentences(sid,id,sentence) VALUES(?,?,?)'; 
      db.run(sql, [sid,a.id,a.sentence], function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.lastID);
      });
    });
};

// delete an existing meme
exports.deleteMeme = (id, userId) => {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM memes WHERE mid=? AND admin=?';
      db.run(sql, [id, userId], (err) => {
        if (err) {
          reject(err);
          return;
        } else
          resolve(null);
      });
    });
};

// delete existing sentences of a given meme
exports.deleteSentencesForMeme = (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM sentences WHERE id = ?';
      db.run(sql, [id], (err) => {
        if (err) {
          reject(err);
          return;
        } else
          resolve(null);
      });
    });
};

