//a package that can let you talk to a database from JavaScript
import { Sequelize } from 'sequelize';


//we invoked this function in another file...
async function connectToDB(dbURI) {
  console.log(`Connecting to DB: ${dbURI}`);

  //this is actually where we establish a connection to the database
  //(database could live on computer, or be in Arkansas)
  //the first param is the URL to where the database is: for many of you, it will just be
  //     postgresql:///databasename
  //the rest of the stuff is a config object
  //what results is the 'sequelize' object, which contains all the power of Sequelize library
  //    (similar to Express's 'app' variable)
  //we will use it throughout our app
  const sequelize = new Sequelize(dbURI, {
    logging: false, // set logging: false to disable outputting SQL queries to console
    define: {
      //this says: when I use the ORM (data models and such) make it so that table names and field
      //names are snake case isntead of camel case (like we do in JS) when it actually makes the tables
      //and columns in our postgres database
      underscored: true,
      //(by default, Sequelize ORM will make two extra columns on every table)
      // this says: when I use the ORM (data models and such) to make a table or use a table
      //I DON'T want Sequelize to make these two extra columns
      timestamps: false,
    },
  });

  //YOU CAN GET RID OF THIS CODE IT'S JUST FANCY CRAP
  //if any code in the try throws an error (tries to crash my JS file)
  //the code in "catch" section will run immediately
  try {
    //try to see if we can connect to the db: this is just a test
    //if you can't, JS will throw an error, and the catch will run
    await sequelize.authenticate();
    console.log('Connected to DB successfully!');
  } catch (error) {
    console.error('Unable to connect to DB:', error);
  }

  //returns the sequelize object from the function:
  //let's go back to where we called this function in model.js
  return sequelize;
}

export default connectToDB;
