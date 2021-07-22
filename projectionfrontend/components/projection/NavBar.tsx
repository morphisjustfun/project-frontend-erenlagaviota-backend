import React from "react";
import { NavBarDiv, TitleDiv } from "../../styles/components/Projection";

export const NavBar = (props: {
  imageUrl: string;
  role: string;
  email: string;
}) => (
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
