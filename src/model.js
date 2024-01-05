import { DataTypes, Model } from 'sequelize'; //just getting some things from the sequelize lib we need to use
import util from 'util';
import connectToDB from './db.js';

//START this is where to start
//we made the function connectToDB
//it requires the URL of the database
//let's go to that function invocation in db.js ->

//-> I"M BACk!
//okAY, so, the function returned the sequelize object
//that huge, huge object
//that gives us the power to connect to the actual postgres db
//via some of its methods
//but now, we've renamed this 'db'
//so 'sequelize' is now 'db', at least in this file
export const db = await connectToDB('postgresql:///ratings');

//This is the code that actually makes your tables (if we do db.sync() later)
//and allows our JS to do things like querying, inserting, updating, deleting
//for this particular table
//in this case, users (Sequelize will lowercase and pluralize what we call it, by default)
//so User -> users
class User extends Model {
  //this is very hard to understand code that is black magic
  //that basically just says:
  //prettify my console.logs. Thanks.
  [util.inspect.custom]() {
    return this.toJSON();
  }
}
//and here is where we actually make the columns, and their constraints
//think of this like a CREATE TABLE statement
User.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      //the optional field attribute will say "this is EXACTLY what I want this column
      //to be called in postgres"
      field: "user_id" //not needed: field will be explicitly this already
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  //this second parameter of User.init is this Model's configuration object
  //(it's a common pattern in JS libraries to have the last paramter be a config object)
  {
    //this property sets the table name to be whatever the string is, pluralized
    //(in our case, it is completely unnecessary because if we don't have it, the name of the model "User"
    //will be used to name the table, lowercased, and pluralized... which is going to have exactly the
    //same result as the modelName line.
    modelName: 'user',
    //this config field is completely necessary for every table: without it, the model will not be connected to
    //our postgres db
    sequelize: db,
  },
);

//same concepts as we already went over
class Movie extends Model {
  [util.inspect.custom]() {
    return this.toJSON();
  }
}
Movie.init({
  movieId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    field: "movie_id"
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  overview: {
    type: DataTypes.TEXT,
  },
  release_datae: {
    type: DataTypes.DATE,
  },
  poster_path: {
    type: DataTypes.STRING,
  }
}, {
  modelName: "movie",
  sequelize: db,
});

//same concepts as we already went over
class Rating extends Model {
  [util.inspect.custom]() {
    return this.toJSON();
  }
};
  Rating.init({
    ratingId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "rating_id"
    },
    score: {
      type: DataTypes.INTEGER,
    },
}, {
  modelName: "rating",
  sequelize: db,
  //actually, I know when I configured "sequelize" that I said "no timestamp fields"
  //but I actually do want them for this model specifically
  timestamps: true, 
  //okay, I know above that I said I wanted both timestamp fields, but I actually only want
  //one of them (the created_at), not the updated_at field
  updatedAt: false,
});

//Movies and Ratings have a one-to-many relationship
//Here, I want to enforce that with a foreign key in posgres
//foreign keys are not written in the above code like the other columns:
//they are made here
//as seen below
//so if you want to make a foreign key, just copy this code, like so
//cept the string will be whatever you want to call the foreign key column in the "many" table
//so the rating table will have a column called movie_id (which will be a foreign key that
//references the movie table's primary key)
Movie.hasMany(Rating, { foreignKey: 'movieId' });
Rating.belongsTo(Movie, { foreignKey: 'movieId' });

//same thing as above
User.hasMany(Rating, { foreignKey: 'userId' });
Rating.belongsTo(User, { foreignKey: 'userId' });

export { Movie, User, Rating};