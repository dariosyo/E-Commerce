const fs = require ('fs');
const crypto = require('crypto');
const Repository = require('./repository');
const util = require('util');

const scrypt = util.promisify(crypto.scrypt);

//Creating a User repository
class UserRepository extends Repository{
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
  const [hashed, salt] = saved.split('.');
  const hashedSupplied = await scrypt(supplied,salt, 64);

  return hashed === hashedSupplied.toString('hex');
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
