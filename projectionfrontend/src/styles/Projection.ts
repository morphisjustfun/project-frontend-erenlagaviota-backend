import styled from "styled-components";

export const NavBarDiv = styled.div`
  display: grid;
  grid-template-rows: 1fr 0.1fr 0.1fr;
  row-gap: 2rem;
  padding: 0 1rem;
`;

export const TitleDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ImageDiv = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

export const ResultsDiv = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 3rem;
  padding: 25px 0rem;
`;

export const ResultDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const HeaderDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px dotted #000;
`;

export const FilterDiv = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 3rem;
`;

export const FilterElementDiv = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
`;

export const FieldElementDiv = styled.div`
width: 100%;
`
