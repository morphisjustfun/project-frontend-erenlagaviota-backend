/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useRef, useState } from "react";
import { loginActionCreators } from "../store";
import { LoginState } from "../store/action-types/loginType";
import Redirect from "../components/Redirect";
import { getCourses, ValidCourses } from "../businesses/request/dataApi";
import { bindActionCreators } from "redux";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/reducers";
import { Normalize } from "../businesses/normalize";
import { NavBar } from "../components/projection/NavBar";
import { Filter } from "../components/projection/Filter";
import { DataFrame } from "../components/projection/DataFrame";
import Modal from "react-modal";
import {
  StrongBlue,
  WelcomeGrid,
  WelcomeText,
} from "../styles/components/Projection";

const Projection = (): JSX.Element => {
  const loginS = useSelector((state: RootState) => state.login) as LoginState;
  const dispatch = useDispatch();

  const { logIn } = bindActionCreators(loginActionCreators, dispatch);

  const [coursesValid, setCoursesValid] = useState([] as ValidCourses[]);
  const [coursesMirror, setCoursesMirror] = useState([] as ValidCourses[]);

  let defaultDepartment = useRef("");

  let doneLoading = useRef(false);

  const doneFilter = () => {
    doneLoading.current = true;
    return (
      <Filter
        coursesHandler={setCoursesMirror}
        coursesMirror={coursesMirror}
        coursesValid={coursesValid}
        defaultDepartment={defaultDepartment.current}
      />
    );
  };

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
    return <h1>Cargando</h1>;
  } else if (
    !loginS.authenticated.waiting &&
    !loginS.authenticated.authenticated
  ) {
    return <Redirect to="/" />;
  } else {
    return (
      <div>
        <WelcomeModal />
        <NavBar
          imageUrl={loginS.imageUrl}
          role={loginS.currentUser.role}
          email={loginS.currentUser.email}
        />
        {coursesMirror.length !== 0 || doneLoading.current
          ? doneFilter()
          : null}
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

const WelcomeModal = () => {
  const [isOpen, setIsOpen] = useState(true);
  const modalStyle = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      overflow: "auto",
      height: "90%",
      maxWidth: "60%",
      transform: "translate(-50%, -50%)",
    },
  };
  useEffect(() => {
    document.body.classList.add("is-clipped");
  }, []);
  return (
    <Modal
      isOpen={isOpen}
      contentLabel="Welcome"
      ariaHideApp={false}
      style={modalStyle}
    >
    <div className="is-flex is-align-items-center is-justify-content-center mt-3 mb-3">
      <h1 className="title is-3 has-text-centerd"> Tutorial </h1>
    </div>
      <WelcomeGrid>
        <div className="is-flex is-align-items-center">
          {/* eslint-disable-next-line @next/next/no-img-element*/}
          <img src="/indication1.png" alt="Imagen no pudo cargar" />
        </div>
        <div className="is-flex is-align-items-center">
          <WelcomeText className="has-text-justified">
            Para empezar debe marcar con la caja seleccionable que se encuentra
            a la izquierda de cada elemento. <br />
            La caja que se encuentra en la parte superior (marcado con{" "}
            <StrongBlue> azul </StrongBlue>) permitirá desmarcar o marcar todas
            las demás cajas dependiendo del estado.
          </WelcomeText>
        </div>
        <div className="is-flex is-align-items-center">
          <WelcomeText className="has-text-justified">
            Una vez haya seleccionado ciertos cursos, estos botones le
            permitirán hacer las siguientes acciones: <br /> <br />
            <strong>VER PROYECCIÓN: </strong> Consultar la información más
            reciente registrada. Si no existe información previa entonces
            calcula el valor usando el modelo de proyección (tiempo aproximado
            10 segundos), lo muestra y lo guarda. Si la información existe
            entonces devuelve el último valor registrado. <br /> <br />
            <strong>CALCULAR PROYECCIÓN: </strong> Caja seleccionable, si se
            encuentra marcada entonces recalcula el modelo a pesar de que este
            ya exista y sobrescribe la información guardada.
          </WelcomeText>
        </div>
        <div className="is-flex is-align-items-center">
          {/* eslint-disable-next-line @next/next/no-img-element*/}
          <img src="/indication2.png" alt="Imagen no pudo cargar" />
        </div>
        <div className="is-flex is-align-items-center">
          <div className="container">
            {/* eslint-disable-next-line @next/next/no-img-element*/}
            <img src="/indication4.png" alt="Imagen no pudo cargar" />
            {/* eslint-disable-next-line @next/next/no-img-element*/}
            <img src="/indication3.png" alt="Imagen no pudo cargar" />
          </div>
        </div>
        <div className="is-flex is-align-items-center">
          <WelcomeText className="has-text-justified">
            Una vez que hayan cargado los datos, tendra a su disposición dos
            cajas para filtrar resultados. <br />
            <strong>El selector de departamento </strong>le permitirá filtrar de
            acuerdo al departamento de su interés. Si selecciona "seleccionar",
            el filtro no tendrá efecto. <br />
            <strong>El recuadro de búsqueda </strong> le permitirá buscar por
            nombre o código. No se realiza una búsqueda exacta, sino por rango y
            aproximación. Si ingresa un valor con tildes o letras no
            coincidentes, de acuerdo al grado de tolerancia se le mostrarán
            ciertos resultados.
          </WelcomeText>
        </div>
      </WelcomeGrid>
      <div className="is-flex is-justify-content-center mt-6">
        <button
          className="button is-danger"
          onClick={() => {
            document.body.classList.remove("is-clipped");
            setIsOpen(false);
          }}
        >
          Cerrar
        </button>
      </div>
    </Modal>
  );
};

export default Projection;
