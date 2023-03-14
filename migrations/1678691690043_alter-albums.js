/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.addColumns('albums', { cover: 'text' });
};

exports.down = (pgm) => {
  pgm.dropColumns('albums', { cover: 'text' });
};
