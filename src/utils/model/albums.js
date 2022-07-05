/* eslint-disable camelcase */

const index = ({
  id,
  name,
  year,
}) => ({
  id,
  name,
  year: parseInt(year, 10),
});

const indexById = ({
  id,
  name,
  year,
}) => ({
  id,
  name,
  year,
});

const songIndex = ({
  id,
  title,
  performer,
}) => ({
  id,
  title,
  performer,
});

module.exports = { index, indexById, songIndex };
