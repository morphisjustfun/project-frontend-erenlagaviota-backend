import React, {
  Dispatch,
  forwardRef,
  Fragment,
  MutableRefObject,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { loginActionCreators } from "../store";
import { LoginState } from "../store/action-types/loginType";
import Redirect from "../components/Redirect";
import {
  getCourses,
  getNumericalPrediction,
  NumericalPrediction,
  ValidCourses,
} from "../businesses/request/dataApi";
import { bindActionCreators } from "redux";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/reducers";
import {
  FieldElementDiv,
  FilterDiv,
  FilterElementDiv,
  HeaderDiv,
  NavBarDiv,
  ResultDiv,
  ResultsDiv,
  TitleDiv,
} from "../styles/components/Projection";
import DataTable from "react-data-table-component";
import Modal from "react-modal";
import Fuse from "fuse.js";
import CsvDownload from "react-json-to-csv";
import { useReactToPrint } from "react-to-print";
import SpinLoader from "../components/SpinLoader";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Normalize = (target: string) => {
  return target
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replaceAll(" ", "")
    .toLowerCase();
};

const Projection = (): JSX.Element => {
  const loginS = useSelector((state: RootState) => state.login) as LoginState;
  const dispatch = useDispatch();

  const { logIn } = bindActionCreators(loginActionCreators, dispatch);

  const [coursesValid, setCoursesValid] = useState([] as ValidCourses[]);
  const [coursesMirror, setCoursesMirror] = useState([] as ValidCourses[]);

  let defaultDepartment = useRef("");

  useEffect(() => {
    const coursesRequest = () => {
      /* @ts-ignore */
      logIn().then(async (response) => {
        let coursesResponse = await getCourses();
        defaultDepartment.current = response.role;
        setCoursesValid(coursesResponse);
        if (response.role !== "general") {
          coursesResponse = coursesResponse.filter(
            (value) => Normalize(value.department) === Normalize(response.role)
          );
        }
        setCoursesMirror(coursesResponse);
      });
    };
    document.documentElement.style.backgroundColor = "F1F1F1";
    document.documentElement.style.padding = "0";
    document.documentElement.style.margin = "2vh 2vw";
    document.documentElement.style.boxSizing = "border-box";
    document.documentElement.style.overflow = "visible";
    document.body.style.fontFamily = "'Poppins', sans-serif";
    coursesRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loginS.authenticated.waiting) {
    return <h1>Loading</h1>;
  } else if (
    !loginS.authenticated.waiting &&
    !loginS.authenticated.authenticated
  ) {
    return <Redirect to="/" />;
  } else {
    return (
      <div>
        <NavBar
          imageUrl={loginS.imageUrl}
          role={loginS.currentUser.role}
          email={loginS.currentUser.email}
        />
        <Filter
          coursesHandler={setCoursesMirror}
          coursesMirror={coursesMirror}
          coursesValid={coursesValid}
          defaultDepartment={defaultDepartment.current}
        />
        <DataFrame
          courses={coursesMirror}
          coursesHandler={setCoursesMirror}
          coursesMirror={coursesMirror}
          coursesValid={coursesValid}
        />
      </div>
    );
  }
};

export default Projection;

const NavBar = (props: { imageUrl: string; role: string; email: string }) => (
  <NavBarDiv>
    <TitleDiv>
      <h1 className="title is-1">Sistema de proyecciones</h1>
    </TitleDiv>
    <TitleDiv>
      <figure className="image is-128x128">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="is-rounded" src={props.imageUrl} alt="Not found" />
      </figure>
    </TitleDiv>
    <TitleDiv>
      <div className="container has-text-centered">
        <h1 className="title is-5">{props.email}</h1>
        <h1 className="subtitle is-7">{props.role}</h1>
      </div>
    </TitleDiv>
  </NavBarDiv>
);

const DataFrame = (props: {
  courses: ValidCourses[];
  coursesHandler: React.Dispatch<React.SetStateAction<ValidCourses[]>>;
  coursesMirror: ValidCourses[];
  coursesValid: ValidCourses[];
}) => {
  const [selectedCourses, setSelectedCourses] = useState(
    [] as { codcurso: string; name: string }[]
  );
  const ButtonContainer = (props: {
    coursesHandler: React.Dispatch<React.SetStateAction<ValidCourses[]>>;
    coursesMirror: ValidCourses[];
    coursesValid: ValidCourses[];
  }) => {
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const modalStyle = {
      content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        overflow: "auto",
        height: "90%",
        transform: "translate(-50%, -50%)",
      },
    };
    return (
      <div className="mb-3 has-text-centered">
        <button
          className="button is-info"
          onClick={() => {
            if (selectedCourses.length === 0) {
              alert("No hay cursos seleccionados");
            } else {
              setIsOpen(true);
            }
          }}
        >
          CALCULAR PROYECCIÓN
        </button>
        <Modal
          isOpen={modalIsOpen}
          style={modalStyle}
          contentLabel="Proyección"
          ariaHideApp={false}
        >
          <div className="container">
            <ResultView
              selectedCourses={selectedCourses}
              onClose={setIsOpen}
            ></ResultView>
          </div>
        </Modal>
      </div>
    );
  };
  const columns = [
    {
      name: "Código",
      selector: (row: any) => row["codcurso"],
      sortable: true,
    },
    {
      name: "Nombre",
      selector: (row: any) => row["name"],
      sortable: true,
      grow: 2,
    },
    {
      name: "Departamento",
      selector: (row: any) => row["department"],
      sortable: true,
      grow: 2,
    },
  ];
  const paginationOptions = {
    rowsPerPageText: "Filas por página",
    rangeSeparatorText: "de",
    selectAllRowsItem: true,
    selectAllRowsItemText: "Todos",
  };
  return (
    <div className="mt-6">
      <ButtonContainer
        coursesHandler={props.coursesHandler}
        coursesValid={props.coursesValid}
        coursesMirror={props.coursesValid}
      />
      <DataTable
        columns={columns}
        data={props.courses}
        title={
          <div className="is-title" style={{ color: "#363636" }}>
            Lista de cursos
          </div>
        }
        pagination
        paginationComponentOptions={paginationOptions}
        responsive
        selectableRows
        contextMessage={{
          plural: "cursos",
          singular: "curso",
          message: "selecccionados",
        }}
        onSelectedRowsChange={(event) => {
          setSelectedCourses(
            event.selectedRows.map((value) => {
              return { name: value.name, codcurso: value.codcurso };
            })
          );
        }}
        noDataComponent={
          <div style={{ padding: "24px" }}>
            {" "}
            <SpinLoader />{" "}
          </div>
        }
      />
    </div>
  );
};

const ResultView = (props: {
  selectedCourses: { codcurso: string; name: string }[];
  onClose: Dispatch<React.SetStateAction<boolean>>;
}) => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current!,
  });
  const [processedData, setProcessedData] = useState(
    [] as NumericalPrediction[]
  );
  const abortController = new AbortController();
  let mergedResult: MutableRefObject<
    ({
      codcurso: string;
      name: string;
    } & NumericalPrediction)[]
  > = useRef([]);
  useEffect(() => {
    const getPrediction = async () => {
      const jsonData = await Promise.all(
        props.selectedCourses.map((value) => {
          return getNumericalPrediction(value.codcurso, abortController);
        })
      );
      mergedResult.current = props.selectedCourses.map((x) =>
        Object.assign(
          x,
          jsonData.find((y) => y.codcurso == x.codcurso)
        )
      );
      setProcessedData(jsonData);
    };
    getPrediction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Fragment>
      <div className="buttons is-centered">
        <CsvDownload
          data={mergedResult.current}
          className="button"
          filename="Cursos_Resultados.csv"
        >
          Descargar resultados en CSV
        </CsvDownload>
        <button className="button" onClick={handlePrint}>
          Imprimir
        </button>
        <button
          className="button is-danger"
          onClick={() => {
            abortController.abort();
            props.onClose(false);
          }}
        >
          Cerrar
        </button>
      </div>
      <ResultsView
        ref={componentRef}
        length={processedData.length}
        processedData={processedData}
        selectedCourses={props.selectedCourses}
      ></ResultsView>
    </Fragment>
  );
};

const Filter = (props: {
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

const DropdownCourses = (props: {
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
            {props.defaultDepartment === "" || props.defaultDepartment === "general"
              ? "Ningún departamento"
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
            Ningún departamento{" "}
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
                    (value) =>
                      Normalize(value.department) ===
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

const FilterName = (
  list: ValidCourses[],
  options: Fuse.IFuseOptions<ValidCourses>,
  input: string
): ValidCourses[] => {
  const FuseSearch = new Fuse(list, options);
  return FuseSearch.search(input).map((result) => result.item);
};

const ResultsView = forwardRef<
  any,
  {
    length: number;
    processedData: NumericalPrediction[];
    selectedCourses: { codcurso: string; name: string }[];
  }
>((props, ref) => {
  return (
    <ResultsDiv ref={ref}>
      <React.Fragment>
        <HeaderDiv className="pb-2">
          <h2 className="title is-4 has-text-centered">Código</h2>
        </HeaderDiv>
        <HeaderDiv className="pb-2">
          <h1 className="title is-4 has-text-centered">Nombre</h1>
        </HeaderDiv>
        <HeaderDiv className="pb-2">
          <h2 className="title is-4 has-text-centered">Proyección</h2>
        </HeaderDiv>
      </React.Fragment>
      {props.selectedCourses.map((value) => {
        return (
          <React.Fragment key={value.codcurso}>
            <ResultDiv>
              <h1 className="subtitle is-6 has-text-centered">
                {value.codcurso}
              </h1>
            </ResultDiv>
            <ResultDiv>
              <h1 className="subtitle is-6 has-text-centered">{value.name}</h1>
            </ResultDiv>
            <ResultDiv>
              {props.length === 0 ? (
                <SpinLoader />
              ) : (
                <h1 className="subtitle is-6 has-text-centered">
                  {
                    props.processedData.filter(
                      (data) => data.codcurso === value.codcurso
                    )[0].numericalProjection
                  }
                </h1>
              )}
            </ResultDiv>
          </React.Fragment>
        );
      })}
    </ResultsDiv>
  );
});

ResultsView.displayName = "ResultsView";
