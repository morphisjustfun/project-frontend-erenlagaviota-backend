import React, { RefObject, useEffect, useRef, useState } from "react";
import { loginActionCreators } from "../store";
import { loginState } from "../store/action-types/loginType";
import {
  getCourses,
  getNumericalPrediction,
  ValidCourses,
} from "../business/request/dataApi";
import styled from "styled-components";
import "../style.css";
import { Redirect } from "react-router-dom";
import { bindActionCreators } from "redux";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/reducers";
import { NavBarDiv, TitleDiv } from "../styles/Projection";
import DataTable from "react-data-table-component";

const Projection = (): JSX.Element => {
  const loginState = useSelector(
    (state: RootState) => state.login
  ) as loginState;
  const dispatch = useDispatch();

  const { logIn } = bindActionCreators(loginActionCreators, dispatch);

  const cursoPicked: RefObject<HTMLInputElement> = useRef(null);

  const [cursoResult, setCursoResult] = useState("");
  const [loading, setLoading] = useState(false);

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
    return <h1>loading</h1>;
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
        <NavBar imageUrl={loginState.imageUrl} role={loginState.currentUser.role} email={loginState.currentUser.email}/>
        <DataFrame courses={coursesMirror}/>
      </div>
      // {
      //   <div className="mt-2">
      //     <NavBar>
      //       <div></div>
      //       <h1 className="title is-1 has-text-centered mt-2">
      //         {" "}
      //         Demo projection{" "}
      //       </h1>
      //       {loginState.imageUrl !== "" ? (
      //         <figure className="image is-64x64">
      //           <img
      //             className="is-rounded"
      //             src={loginState.imageUrl}
      //             alt="Not found"
      //           />
      //         </figure>
      //       ) : null}
      //     </NavBar>
      //     <div className="ml-4 mr-4">
      //       {
      //         //<h1 className="title is-1 has-text-centered"> Authenticated: {state.authenticated.toString()} </h1>
      //       }
      //       {loginState.authenticated ? (
      //         <div className="columns is-vcentered is-centered">
      //           <div className="column is-half">
      //             <InputBar>
      //               <input
      //                 className="input"
      //                 type="text"
      //                 placeholder="Curso"
      //                 ref={cursoPicked}
      //               />
      //               <button
      //                 className={`button mt-5 ${loading ? "is-loading" : ""}`}
      //                 onClick={async () => {
      //                   setLoading(true);
      //                   const respuesta = await getNumericalPrediction(
      //                     cursoPicked.current!.value
      //                   );
      //                   setCursoResult(respuesta.numericalProjection.toString());
      //                   setLoading(false);
      //                 }}
      //               >
      //                 Calcular
      //               </button>
      //             </InputBar>
      //           </div>
      //         </div>
      //       ) : null}
      //       {cursoResult !== "" ? (
      //         <h1 className="title is-1 has-text-centered">{cursoResult}</h1>
      //       ) : null}
      //     </div>
      //   </div>
      //   }
    );
  }
};

export default Projection;

const NavBar = (props: { imageUrl: string, role:string, email:string }) => (
  <NavBarDiv>
    <TitleDiv>
      <h1 className="title is-1">Sistema de proyecciones</h1>
    </TitleDiv>
    <TitleDiv>
      <figure className="image is-128x128">
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

const DataFrame = (props: {courses: ValidCourses[]}) => {
  const columns = [
    {
      name: "Código",
      selector: (row:any) => row['codcurso'],
      sortable: true,
    },
    {
      name: "Nombre",
      selector: (row:any) => row['name'],
      sortable: true,
    },
    {
      name: "Departamento",
      selector: (row:any) => row['department'],
      sortable: true,
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
      <DataTable
        columns={columns}
        data={props.courses}
        title="Lista de cursos"
        pagination
        paginationComponentOptions={paginationOptions}
        responsive
      />
    </div>
  );
};
