import { RefObject, useEffect, useRef, useState } from "react";
import { loginActionCreators } from "../store";
import { loginState } from "../store/action-types/loginType";
import Redirect from "../components/Redirect";
import Image from "next/image"
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
import React from "react";

const Projection = (): JSX.Element => {
  const loginState = useSelector(
    (state: RootState) => state.login
  ) as loginState;
  const dispatch = useDispatch();

  const { logIn } = bindActionCreators(loginActionCreators, dispatch);

  const [coursesValid, setCoursesValid] = useState([] as ValidCourses[]);
  const [coursesMirror, setCoursesMirror] = useState([] as ValidCourses[]);

  useEffect(() => {
    const coursesRequest = async () => {
      const coursesResponse = await getCourses();
      setCoursesValid(coursesResponse);
      setCoursesMirror(coursesResponse);
    };
    document.documentElement.style.backgroundColor = "F1F1F1";
    document.documentElement.style.padding = "0";
    document.documentElement.style.margin = "2vh 2vw";
    document.documentElement.style.boxSizing = "border-box";
    document.documentElement.style.overflow = "visible";
    document.body.style.fontFamily = "'Poppins', sans-serif";
    logIn();
    coursesRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loginState.authenticated.waiting) {
    return <h1>Loading</h1>;
  } else if (
    !loginState.authenticated.waiting &&
    !loginState.authenticated.authenticated
  ) {
    return (
      <Redirect
        to={{
          pathname: "/",
        }}
      />
    );
  } else {
    return (
      <div>
        <NavBar
          imageUrl={loginState.imageUrl}
          role={loginState.currentUser.role}
          email={loginState.currentUser.email}
        />
        <DataFrame
          courses={coursesMirror}
          coursesHandler={setCoursesMirror}
          coursesMirror={coursesMirror}
          coursesValid={coursesValid}
        />
        <Filter
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
        <Image className="is-rounded" src={props.imageUrl} alt="Not found" />
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
          onRequestClose={() => setIsOpen(false)}
          style={modalStyle}
          contentLabel="Proyección"
          ariaHideApp
        >
          <div className="container">
            <ResultView selectedCourses={selectedCourses}></ResultView>
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
        title="Lista de cursos"
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
          <div style={{ padding: "24px" }}>No hay registros</div>
        }
      />
    </div>
  );
};

const ResultView = (props: {
  selectedCourses: { codcurso: string; name: string }[];
}) => {
  const [processedData, setProcessedData] = useState(
    [] as NumericalPrediction[]
  );
  useEffect(() => {
    const getPrediction = async () => {
      const request = await Promise.all(
        props.selectedCourses.map((value) => {
          return getNumericalPrediction(value.codcurso);
        })
      );
      setProcessedData(request);
    };
    getPrediction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <ResultsDiv>
      <React.Fragment>
        <HeaderDiv className="pb-2">
          <h1 className="title is-3 has-text-centered">Nombre</h1>
        </HeaderDiv>
        <HeaderDiv className="pb-2">
          <h2 className="title is-4 has-text-centered">Código</h2>
        </HeaderDiv>
        <HeaderDiv className="pb-2">
          <h2 className="title is-4 has-text-centered">Proyección</h2>
        </HeaderDiv>
      </React.Fragment>
      {props.selectedCourses.map((value) => {
        return (
          <React.Fragment key={value.codcurso}>
            <ResultDiv>
              <h1 className="subtitle is-5 has-text-centered">{value.name}</h1>
            </ResultDiv>
            <ResultDiv>
              <h2 className="subtitle is-6 has-text-centered">
                {value.codcurso}
              </h2>
            </ResultDiv>
            <ResultDiv>
              {processedData.length === 0 ? (
                <h2 className="subtitle is-6 has-text-centered">Cargando</h2>
              ) : (
                <h2 className="subtitle is-6 has-text-centered">
                  {
                    processedData.filter(
                      (data) => data.codcurso === value.codcurso
                    )[0].numericalProjection
                  }
                </h2>
              )}
            </ResultDiv>
          </React.Fragment>
        );
      })}
    </ResultsDiv>
  );
};

const Filter = (props: {
  coursesHandler: React.Dispatch<React.SetStateAction<ValidCourses[]>>;
  coursesValid: ValidCourses[];
  coursesMirror: ValidCourses[];
}) => {
  const inputNombre: RefObject<HTMLInputElement> = useRef(null);
  const inputCodigo: RefObject<HTMLInputElement> = useRef(null);
  const inputDepartamento: RefObject<HTMLInputElement> = useRef(null);
  return (
    <FilterDiv className="mt-6">
      <FilterElementDiv>
        <FieldElementDiv className="field">
          <label className="label"> Nombre del curso</label>
          <div className="controls">
            <input
              ref={inputNombre}
              className="input"
              type="text"
              placeholder="Nombre del curso"
              onChange={(e) => {
                inputCodigo.current!.value = "";
                e.preventDefault();
                const result = FilterName(
                  props.coursesValid,
                  { keys: ["name"] },
                  e.target.value
                );
                props.coursesHandler(result);
              }}
            />
          </div>
        </FieldElementDiv>
      </FilterElementDiv>
      <FilterElementDiv>
        <FieldElementDiv className="field">
          <label className="label">Código del curso</label>
          <div className="controls">
            <input
              ref={inputCodigo}
              className="input"
              type="text"
              placeholder="Código del curso"
              onChange={(e) => {
                inputNombre.current!.value = "";
                e.preventDefault();
                const result = FilterName(
                  props.coursesValid,
                  { keys: ["codcurso"] },
                  e.target.value
                );
                props.coursesHandler(result);
              }}
            />
          </div>
        </FieldElementDiv>
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
