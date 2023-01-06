/**
 * Information about an meme
 */
 class Meme {
    sentences = [];

    constructor(id, iid, title, visibility, admin, username, fields, font, color) {
      this.id = id;
      this.iid = iid;
      this.title = title;
      this.visibility = visibility;
      this.username = username;
      this.admin = admin;
      this.fields = fields;
      this.font = font;
      this.color = color;
    }
  
    static from(json) {
      return new Meme(json.id,  json.iid, json.title, json.visibility, json.admin, json.username, json.fields, json.font, json.color);
    }
  }
  
  export default Meme;