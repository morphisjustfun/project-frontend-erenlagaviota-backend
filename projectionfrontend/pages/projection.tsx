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
