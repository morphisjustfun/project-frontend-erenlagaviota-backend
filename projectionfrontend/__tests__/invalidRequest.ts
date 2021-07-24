import { API_BASE_URL } from "../businesses/constants";
import fetch from 'node-fetch'

test("check if requests are rejected", () => {
    fetch(`${API_BASE_URL}/courses/valid`, {
        method: "GET"
    }).then((response) => {
        expect(response.status).toBe(401);
    })
});

test("check if requests are invalid", () => {
    fetch(`${API_BASE_URL}/courses`, {
        method: "GET"
    }).then((response) => {
        expect(response.status).toBe(404);
    })
});
