const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

// create our User model
class User extends Model {
  // set up method to run on instance data (per user) to check password
  checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.password);
  }
 }

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [4]
      }
    }
  },
  {
    hooks: {
      // set up beforeCreate lifecycle "hook" functionality
      async beforeCreate(newUserData) {
        newUserData.password = await bcrypt.hash(newUserData.password, 10);
        return newUserData;
      },
      // set up beforeUpdate lifecycle "hook" functionality
      async beforeUpdate(updatedUserData) {
        updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
        return updatedUserData;
      }
    },
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'user'
  }
);

module.exports = User;


// First, we imported the Model class and DataTypes object from Sequelize. So User inherits all of the funcionality the Model class 
// has.

// we use the .init() method to initialize the model's data and configuration, passing in two objects as arguments. 
// The first object will define the columns and data types for those columns. The second object it accepts configures 
// certain options for the table.

// We use the beforeCreate() hook to execute the bcrypt hash function on the plaintext password. In the bcrypt hash function, we pass
// in the userData object that contains the plaintext password in the password property. We also pass in a saltRound value of 10.
// The resulting hashed password is then passed to the Promise object as a newUserData object with a hashed password property. The 
// return statement then exits out of the function, returning the hashed password in the newUserData function.