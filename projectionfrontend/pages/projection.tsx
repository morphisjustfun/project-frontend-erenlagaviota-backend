import React, {
  Dispatch,
  forwardRef,
  Fragment,
  MutableRefObject,
  RefObject,
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

  useEffect(() => {
    const coursesRequest = () => {
      /* @ts-ignore */
      logIn().then(async (response) => {
        let coursesResponse = await getCourses();
        if (response.role !== "general") {
          coursesResponse = coursesResponse.filter(
            (value) => Normalize(value.department) === Normalize(response.role)
          );
        }
        setCoursesValid(coursesResponse);
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
        <button className="button is-danger" onClick={() => {
        abortController.abort();
        props.onClose(false)}
        }>
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
}) => {
  const inputNombre: RefObject<HTMLInputElement> = useRef(null);
  const inputCodigo: RefObject<HTMLInputElement> = useRef(null);
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
          <h1 className="title is-4 has-text-centered">Nombre</h1>
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
              <h1 className="subtitle is-6 has-text-centered">{value.name}</h1>
            </ResultDiv>
            <ResultDiv>
              <h2 className="subtitle is-6 has-text-centered">
                {value.codcurso}
              </h2>
            </ResultDiv>
            <ResultDiv>
              {props.length === 0 ? (
                <SpinLoader />
              ) : (
                <h2 className="subtitle is-6 has-text-centered">
                  {
                    props.processedData.filter(
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
});

ResultsView.displayName = "ResultsView";
