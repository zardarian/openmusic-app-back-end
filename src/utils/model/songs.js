/* eslint-disable camelcase */

const index = ({
  id,
  title,
  performer,
}) => ({
  id,
  title,
  performer,
});

const indexById = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  album_id,
}) => ({
  id,
  title,
  year: parseInt(year, 10),
  performer,
  genre,
  duration: parseInt(duration, 10),
  albumId: album_id,
});

module.exports = { index, indexById };
