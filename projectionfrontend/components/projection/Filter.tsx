import React, { useRef, useState } from "react";
import { ValidCourses } from "../../businesses/request/dataApi";
import {
  FieldElementDiv,
  FilterDiv,
  FilterElementDiv,
} from "../../styles/components/Projection";
import { DropdownCourses } from "./DropdownCourses";
import Fuse from "fuse.js";

export const Filter = (props: {
  coursesHandler: React.Dispatch<React.SetStateAction<ValidCourses[]>>;
  coursesValid: ValidCourses[];
  coursesMirror: ValidCourses[];
  defaultDepartment: string;
}) => {
  const inputCourseRef = useRef<HTMLInputElement>(null);
  const [inputDepartment, setInputDepartment] = useState([] as ValidCourses[]);
  return (
    <FilterDiv className="mt-6">
      <FilterElementDiv>
        <FieldElementDiv className="field">
          <label className="label"> Nombre o código del curso</label>
          <input
            className="input"
            type="text"
            ref={inputCourseRef}
            placeholder="Nombre o código del curso"
            onChange={(e) => {
              e.preventDefault();
              if (e.target.value !== "") {
                let result = FilterName(
                  props.coursesValid,
                  { keys: ["name", "codcurso"] },
                  e.target.value
                );
                if (inputDepartment.length !== 0) {
                  result = result.filter((value) =>
                    inputDepartment.includes(value)
                  );
                }
                props.coursesHandler(result);
              } else {
                if (inputDepartment.length !== 0) {
                  const result = props.coursesValid.filter((value) =>
                    inputDepartment.includes(value)
                  );
                  props.coursesHandler(result);
                } else {
                  props.coursesHandler(props.coursesValid);
                }
              }
            }}
          />
        </FieldElementDiv>
      </FilterElementDiv>
      <FilterElementDiv>
        <div className="container">
          <label className="label"> Departamento seleccionado</label>
          <DropdownCourses
            coursesValid={props.coursesValid}
            coursesHandler={props.coursesHandler}
            inputCourseRef={inputCourseRef}
            setInputDepartment={setInputDepartment}
            defaultDepartment={props.defaultDepartment}
          />
        </div>
      </FilterElementDiv>
    </FilterDiv>
  );
};

const FilterName = (
  list: ValidCourses[],
  options: Fuse.IFuseOptions<ValidCourses>,
  input: string
): ValidCourses[] => {
  const FuseSearch = new Fuse(list, options);
  return FuseSearch.search(input).map((result) => result.item);
};
