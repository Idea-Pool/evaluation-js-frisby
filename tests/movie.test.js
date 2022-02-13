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
    })
});

it('should add a rating to a movie', async function () {
  const response = await frisby.get('https://api.themoviedb.org/3/authentication/guest_session/new?api_key=e231ae412af0eaab685d11c26505bda6');
  const session_id = response.json.guest_session_id;
  console.log(session_id);
  return frisby.setup({
    request: {
      haders: {
        'Content-Type': 'application/json',
        'charset': 'utf-8'
      }
    }
  })
  .post(`https://api.themoviedb.org/3/movie/818647/rating?api_key=e231ae412af0eaab685d11c26505bda6&guest_session_id=${session_id}`, {
    "value": 8.0
  })
    .expect('status', 201);
});