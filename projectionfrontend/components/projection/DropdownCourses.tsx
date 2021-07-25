import React, {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { ValidCourses } from "../../businesses/request/dataApi";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Normalize } from "../../businesses/normalize";

export const DropdownCourses = (props: {
  coursesValid: ValidCourses[];
  coursesHandler: Dispatch<SetStateAction<ValidCourses[]>>;
  setInputDepartment: Dispatch<SetStateAction<ValidCourses[]>>;
  inputCourseRef: RefObject<HTMLInputElement>;
  defaultDepartment: string;
}) => {
  const dropdownSpan = useRef<HTMLSpanElement>(null);
  const triggerSpan = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const fixClick = (e: MouseEvent) => {
      if (!triggerSpan.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", fixClick);
    return () => {
      document.removeEventListener("click", fixClick);
    };
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  let departmentsValid = props.coursesValid.map((value) => value.department);
  departmentsValid = departmentsValid.filter(
    (value, index) => departmentsValid.indexOf(value) === index
  );
  return (
    <div
      className={isOpen ? "dropdown is-active" : "dropdown"}
      style={{ display: "block" }}
    >
      <div className="dropdown-trigger">
        <button
          className="button"
          aria-haspopup="tree"
          aria-controls="dropdown-menu1"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          ref={triggerSpan}
        >
          <span ref={dropdownSpan}>
            {props.defaultDepartment === "" ||
            props.defaultDepartment === "general"
              ? "Seleccionar"
              : props.defaultDepartment}
          </span>
          <span className="icon is-small">
            <FontAwesomeIcon icon={faAngleDown} aria-hidden="true" />
          </span>
        </button>
      </div>
      <div className="dropdown-menu" id="dropdown-menu1" role="menu">
        <div className="dropdown-content">
          <a
            className="dropdown-item DropdownItemDepartment"
            style={{
              fontFamily:
                'BlinkMacSystemFont, -apple-system, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", "Helvetica", "Arial", sans-serif',
              fontSize: "16px",
              fontWeight: 400,
            }}
            onClick={(e) => {
              setIsOpen(!isOpen);
              props.inputCourseRef.current!.value = "";
              props.coursesHandler(props.coursesValid);
              dropdownSpan.current!.textContent = (
                e.target as HTMLAnchorElement
              ).textContent;
              props.setInputDepartment(props.coursesValid);
            }}
          >
            Seleccionar
          </a>
          {departmentsValid.map((value) => {
            return (
              <a
                key={value}
                className="dropdown-item"
                style={{
                  fontFamily:
                    'BlinkMacSystemFont, -apple-system, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", "Helvetica", "Arial", sans-serif',
                  fontSize: "16px",
                  fontWeight: 400,
                }}
                onClick={(e) => {
                  setIsOpen(!isOpen);
                  props.inputCourseRef.current!.value = "";
                  props.coursesHandler(props.coursesValid);
                  dropdownSpan.current!.textContent = (
                    e.target as HTMLAnchorElement
                  ).textContent;
                  const filtered = props.coursesValid.filter(
                    (target) =>
                      Normalize(target.department) ===
                      Normalize((e.target as HTMLAnchorElement).textContent!)
                  );
                  props.setInputDepartment(filtered);
                  props.coursesHandler(filtered);
                }}
              >
                {value}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};
