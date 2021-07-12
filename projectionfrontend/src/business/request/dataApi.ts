import { API_BASE_URL } from "../constants";
import request from "./securityConfig";
import {store} from "../../store/store";
import {toggleLoading} from "../../store/action-creators/loginActionCreator";


interface NumericalPrediction {
  numericalProjection: number;
}

export const getNumericalPrediction = async (
  curso: string
): Promise<NumericalPrediction> => {
    toggleLoading(true)(store.dispatch);
  const response = await request({
    url: API_BASE_URL + "/data/numericalProjection",
    method: "POST",
    body: JSON.stringify({
      course: curso,
    }),
  });
  if (response.ok) {
    toggleLoading(false)(store.dispatch);
    return response.json();
  } else {
    toggleLoading(false)(store.dispatch);
    return Promise.reject("No data found");
  }
};
