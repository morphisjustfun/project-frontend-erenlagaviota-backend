import React, {
  Dispatch,
  forwardRef,
  Fragment,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  getNumericalPrediction,
  NumericalPrediction,
  ValidCourses,
} from "../../businesses/request/dataApi";
import {
  HeaderDiv,
  ResultDiv,
  ResultsDiv,
} from "../../styles/components/Projection";
import DataTable from "react-data-table-component";
import Modal from "react-modal";
import CsvDownload from "react-json-to-csv";
import { useReactToPrint } from "react-to-print";
import SpinLoader from "../SpinLoader";

export const DataFrame = (props: {
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