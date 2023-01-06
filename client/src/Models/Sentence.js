/**
 * Information about a sentence
 */
 class Sentence {
    
    constructor(id, sentence, left, bottom) {
      this.id = id;
      this.sentence = sentence;
      this.left = left;
      this.bottom = bottom;
    }
    static from(json) {
      return new Sentence(json.id,  json.sentence, json.left, json.bottom);
    }
  }
  
  export default Sentence;