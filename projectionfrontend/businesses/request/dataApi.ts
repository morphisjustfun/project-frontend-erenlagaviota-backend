import { API_BASE_URL } from "../constants";
import request from "./request";


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
  curso: string
): Promise<NumericalPrediction> => {
  const response = await request({
    url: API_BASE_URL + "/data/numericalProjection",
    method: "POST",
    body: JSON.stringify({
      course: curso,
    }),
  });
  if (response.ok) {
    return response.json().then((value) => {
        return {
            numericalProjection: value.numericalProjection,
            codcurso: curso
        };
    });
  } else {
    return Promise.reject("No data found");
  }
};

export const getCourses = async (): Promise<ValidCourses[]>  => {
    const response = await request({
        url: API_BASE_URL + "/courses/valid",
        method: "GET"
    });
    if (response.ok){
        return response.json();
    }
    else{
        return Promise.reject("Invalid data");
    }
}
