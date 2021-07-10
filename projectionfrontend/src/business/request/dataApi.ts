import { API_BASE_URL } from "../constants";
import request from "./securityConfig";

export const getNumericalPrediction = (curso: string) => {
  return request({
    url: API_BASE_URL + "/data",
    method: "POST",
    body: JSON.stringify({
      name: curso,
    }),
  }).then((response) => {
      if (response.ok){
          return response.json();
      }
  });
};
