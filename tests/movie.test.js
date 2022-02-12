const frisby = require('frisby');
const Joi = require('joi');

it('should return 200 status code', function () {
  return frisby.get('https://api.themoviedb.org/3/movie/818647?api_key=e231ae412af0eaab685d11c26505bda6&language=en-US')
    .expect('status', 200);
});

it('should return schema', function () {
  return frisby.get('https://api.themoviedb.org/3/movie/818647?api_key=e231ae412af0eaab685d11c26505bda6&language=en-US')
    .expect('json', 'original_title', 'A través de mi ventana')
    .expect('jsonTypes', { 
      'id': Joi.number().integer().required(),
      'original_language': Joi.string().required(),
      'original_title': Joi.string().required()
    });
});