const frisby = require('frisby');
const Joi = require('joi');
const prepareUrl = (url, session_id = '') => {
  return `${url}?api_key=e231ae412af0eaab685d11c26505bda6&guest_session_id=${session_id}`
}

describe('Movie test', () => {
  let session_id;
  beforeAll(async() => {
    frisby.globalSetup({
      request: {
        headers: {
          'Content-Type': 'application/json',
          'charset': 'utf-8'
        },
        baseUrl: 'https://api.themoviedb.org/3'
      },
    
    });
    const response = await frisby.get(prepareUrl('/authentication/guest_session/new'));
    session_id = response.json.guest_session_id;
  });

  it('should return 200 status code', function () {
    return frisby.get(prepareUrl('/movie/818647'))
      .expect('status', 200);
  });

  it('should return schema', function () {
    return frisby.get(prepareUrl('/movie/818647'))
      .expect('json', 'original_title', 'A través de mi ventana')
      .expect('jsonTypes', {
        'id': Joi.number().integer().required(),
        'original_language': Joi.string().required(),
        'original_title': Joi.string().required()
      })
  });

  it('should add a rating to a movie', async function () {
    return frisby.post(prepareUrl(`/movie/818647/rating`, session_id), {
        "value": 8.0
      })
      .expect('status', 201)
      .expect('bodyContains', 'Success.');
  });

  it('should return proper status message', async function () {
    const response = await frisby.post(prepareUrl(`/movie/818647/rating`, session_id), {
        "value": 8.0
      });

    const status_message = response.json.status_message;
    expect(status_message).toEqual('Success.');
  });

  it('should not add an invalid rating to a movie', async function () {
    const response = await frisby.post(prepareUrl(`/movie/818647/rating`, session_id), {
      "value": 10.1
    });

  const status_message = response.json.status_message;
  expect(status_message).toEqual('Value too high: Value must be less than, or equal to 10.0.');
  });

  it('should delete a movie rating', async function () {
    return frisby.delete(prepareUrl(`/movie/818647/rating`, session_id))
      .expect('status', 200);
  });

  it('should delete a movie rating', async function () {
    const response = await frisby.delete(prepareUrl(`/movie/818647/rating`, session_id));
    const status_message = response.json.status_message;
    expect(status_message).toEqual('The item/record was deleted successfully.');
  });

  it('should handle missing movie_id', function () {
    return frisby.get(prepareUrl('/movie/'))
      .expect('status', 404);
  });

});