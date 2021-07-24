import { API_BASE_URL } from "../constants";
import request from "./request";
import Router from "next/router"

export interface NumericalPrediction {
  numericalProjection: number;
  codcurso: string;
}

export interface ValidCourses {
  codcurso: string;
  department: string;
  name: string;
}

export const getNumericalPrediction = async (
  curso: string,
  abortController: AbortController,
  onDemand: boolean
): Promise<NumericalPrediction> => {
  const response = await request(
    {
      url: API_BASE_URL + "/data/numericalProjection",
      method: "POST",
      body: JSON.stringify({
        course: curso,
        onDemand: onDemand.toString(),
      }),
    },
    abortController
  );
  if (response.ok) {
    return response.json().then((value) => {
      return {
        numericalProjection: value.numericalProjection,
        codcurso: curso,
      };
    });
  } else {
    abortController.abort();
    Router.push("/error","/");
    return Promise.reject("No data found");
  }
};

export const getCourses = async (): Promise<ValidCourses[]> => {
  const response = await request({
    url: API_BASE_URL + "/courses/valid",
    method: "GET",
  });
  if (response.ok) {
    return response.json();
  } else {
    Router.push("/error","/");
    return Promise.reject("Invalid data");
  }
};
