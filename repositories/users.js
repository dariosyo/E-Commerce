const fs = require ('fs');
const crypto = require('crypto');

const util = require('util');

const scrypt = util.promisify(crypto.scrypt);

//Creating a User repository
class UserRepository{
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

//Gets all the lsit of users
  async getAll(){
    return JSON.parse(await fs.promises.readFile(this.filename, {
      encoding: 'utf8'
    })
  );
}

//Creates a user with a given attributes
  async create(attrs){

    attrs.id = this.randomId();

    // salt + hashing password
    const salt = crypto.randomBytes(8).toString('hex');
    const buf = await scrypt(attrs.password, salt, 64);


    const records = await this.getAll();
    const record = {
      ...attrs,
      password:`${buf.toString('hex')}.${salt}`
    }
    records.push(record);

    await this.writeAll(records);

    return record;

  }

//Comparing user input password with saved password
async comparePasswords(saved, supplied){
  const [buf, salt] = saved.split('.');
  const hashedSupplied = await scrypt(supplied,salt, 64);

  return buf === hashedSupplied.toString('hex');
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

module.exports = new UserRepository('users.json')

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ FOR TESTING PURPOSES ONLY @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// const test = async () => {
//   const repo = new UserRepository('users.json');
//
//   // await repo.create({email: 'test@test.com', password: 'password'});
//   // const users = await repo.getAll();
//
//   // const user = await repo.create({email: 'test@test.com'});
//   // console.log(user);
//   // await repo.update('ee7c67d4', {password:'myPassword'});
//
//   const user = await repo.getOneBy({email: 'test@test.com', password:'myPassword'});
//   console.log(user);
//   // console.log(users);
// };
//
// test();
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
