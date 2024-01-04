import { DataTypes, Model } from 'sequelize';
import util from 'util';
import connectToDB from './db.js';

export const db = await connectToDB('postgresql:///ratings');

class User extends Model {
  [util.inspect.custom]() {
    return this.toJSON();
  }
}
User.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "user_id"
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
  {
    modelName: 'user',
    sequelize: db,
  },
);

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
  timestamps: true,
  updatedAt: false,
});

Movie.hasMany(Rating, { foreignKey: 'movieId' });
Rating.belongsTo(Movie, { foreignKey: 'movieId' });

User.hasMany(Rating, { foreignKey: 'userId' });
Rating.belongsTo(User, { foreignKey: 'userId' });

export { Movie, User, Rating};