import { Movie, Rating, User, db } from '../src/model.js'; //getting all our models, and sequelize object, from model.js
import movieData from './data/movies.json' assert { type: 'json' }; //our movie data (JSON object)
import lodash from "lodash"; //this is a library that allows me to take JS shortcuts (like making random numbers is
// way easier using the lodash library... helps with some looping things as well... a lot of JS stuff)

console.log('Syncing database...');
//db.sync is a function that says: "create tables for all the models that are connected to my sequelize instance"
//(your sequelize instance being the variable "db" in this case)
//but normally, if the tables already exist, it won't do anything.
//but as you see below, we passing a config object with one property, force: true,
//which says "I don't care if the tables already exist: delete them and make them anew".
await db.sync({ force: true });

console.log('Seeding database...');

//promise.all is code we have not seen yet
//but what this built-in-JS function does is this:
//it takes an array, which array should be filled with Promise objects
//and Promise.all itself returns a promise.
//...this Promise will only fulfill successfully when all of the promises
//inside of the input array have also fulfilled successfully.
//when that main promise resolves, it will turn into an array of the results
//of all the promises: which will be database result objects
//if this was confusing, we'll dig in more below
//.....
const moviesInDB = await Promise.all(
  //we will tackle this code, and all the code below it, another day
  movieData.map(async (movie) => {
    const releaseDate = new Date(Date.parse(movie.releaseDate));
    const { title, overview, posterPath } = movie;

    const newMovie = Movie.create({
      title,
      overview,
      posterPath,
      releaseDate
    });

    return newMovie;
  })
);

const userToCreate = [];

for(let i=1; i<=10; i++){
  userToCreate.push({
    email: `user${i}@test.com`,
    password: "test"
  });
}

const usersInDB = await Promise.all(
  userToCreate.map(async (user) => {
    const { email, password } = user;
    const newUser = await User.create({
      email, 
      password,
    });

    return newUser;
  })
);

const ratingsInDB = await Promise.all(
  usersInDB.flatMap((user) => {
    const randomMovies = lodash.sampleSize(moviesInDB, 10);
    const movieRatings = randomMovies.map(async (movie) => {
      return await  Rating.create({
        score: lodash.random(1,5),
        userId: user.userId,
        movieId: movie.movieId
      });

    });
    return movieRatings;
  })
);

await db.close();
console.log('DB seeded!');