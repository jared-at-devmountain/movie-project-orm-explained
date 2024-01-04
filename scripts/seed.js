import { Movie, Rating, User, db } from '../src/model.js';
import movieData from './data/movies.json' assert { type: 'json' };
import lodash from "lodash";

console.log('Syncing database...');
await db.sync({ force: true });

console.log('Seeding database...');

const moviesInDB = await Promise.all(
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