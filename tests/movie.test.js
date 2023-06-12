const frisby = require("frisby");
const prepareUrl = (url, session_id = "") => {
    return `${url}?api_key=${process.env.THEMOVIEDB_API_KEY}&guest_session_id=${session_id}`;
};

if (!process.env.THEMOVIEDB_API_KEY) {
    throw new Error("THEMOVIEDB_API_KEY environment variable has not set.");
}

describe("Movie test", () => {
    let session_id;
    beforeAll(async() => {
        frisby.globalSetup({
            request: {
                headers: {
                    "Content-Type": "application/json",
                    "charset": "utf-8"
                },
                baseUrl: "https://api.themoviedb.org/3"
            },

        });
        const response = await frisby.get(prepareUrl("/authentication/guest_session/new"));
        session_id = response.json.guest_session_id;
    });

    it("should return 200 status code", function () {
        return frisby.get(prepareUrl("/movie/818647"))
            .expect("status", 200);
    });

    it("should return data with proper schema", function () {
        return frisby.get(prepareUrl("/movie/818647"))
            .expect("jsonTypes", {
                "id": frisby.Joi.number().integer().required(),
                "original_language": frisby.Joi.string().required(),
                "original_title": frisby.Joi.string().required(),
                // TODO: add other fields
            });
    });

    it("should add a rating to a movie", async function () {
        return frisby.post(prepareUrl("/movie/818647/rating", session_id), {
            "value": 8.0
        })
            .expect("status", 201)
            .expect("bodyContains", "Success.");
    });

    it("should return proper status message", async function () {
        const response = await frisby.post(prepareUrl("/movie/818647/rating", session_id), {
            "value": 8.0
        });

        const status_message = response.json.status_message;
        expect(status_message.toLowerCase()).toContain("success");
    });

    it("should not add an invalid rating to a movie", async function () {
        const response = await frisby.post(prepareUrl("/movie/818647/rating", session_id), {
            "value": 10.1
        });

        const status_message = response.json.status_message;
        expect(status_message).toEqual("Value too high: Value must be less than, or equal to 10.0.");
    });

    it("should delete a movie rating", async function () {
        return frisby.delete(prepareUrl("/movie/818647/rating", session_id))
            .expect("status", 200);
    });

    it("should delete a movie rating", async function () {
        return frisby.delete(prepareUrl("/movie/818647/rating", session_id))
            .expect("json", "status_message", "The item/record was deleted successfully.");
    });

    it("should handle missing movie_id", function () {
        return frisby.get(prepareUrl("/movie/"))
            .expect("status", 404);
    });

});
