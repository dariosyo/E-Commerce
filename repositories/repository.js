const fs = require ('fs');
const crypto = require('crypto');


module.exports = class Repository {
  constructor(filename){
    if(!filename){
      throw new Error('Creating a repository requires a filename');
    }
    this.filename = filename;
    try {
      fs.accessSync(this.filename)
    }catch (err){
      fs.writeFileSync(this.filename, '[]');
    }
  }

  //Creates a product with a given attributes

  async create(attrs){

    attrs.id = this.randomId();

    const records = await this.getAll();
    records.push(attrs);
    await this.writeAll(records);
    return attrs;
  }
  //Gets all the lsit of users
  async getAll(){
    return JSON.parse(await fs.promises.readFile(this.filename, {
      encoding: 'utf8'
    })
  );
  }

  //Comparing user input password with saved password
  async comparePasswords(saved, supplied){
  const [hashed, salt] = saved.split('.');
  const hashedSupplied = await scrypt(supplied,salt, 64);

  return hashed === hashedSupplied.toString('hex');
  }

  //Writes all users to a users.json file
  async writeAll(records){
    await fs.promises.writeFile(this.filename,JSON.stringify(records, null, 2));
  }

  randomId(){
    return crypto.randomBytes(4).toString('hex');
  }

  //Find a user with the given ID
  async getOne(id){
    const records = await this.getAll();
    return records.find(record => record.id === id);
  }

  //Delete a user with the given ID
  async delete(id){
    const records = await this.getAll();
    const filteredRecord = records.filter(record => record.id !== id);
    await this.writeAll(filteredRecord);
  }

  //Updates the user with the given ID using a given attributes
  async update(id, attrs){
    const records = await this.getAll();
    const record = records.find(record => record.id === id);

    if(!record){
      throw new Error('Record with id {id} not found');
    }

    Object.assign(record, attrs);
    await this.writeAll(records);
  }

  //Finds one user with the given filters
  async getOneBy(filters){
    const records = await this.getAll();

    for (let record of records){

      let found = true;

      for (let key in filters){
        if(record[key] !== filters[key]){
          found = false;
        }
      }
      if(found){
        return record;
      }
    }
  }
}
