import { ValidCourses } from "../businesses/request/dataApi";
import {FilterName} from "../businesses/FilterName";

test("check if fuse function is working properly", () => {
  const objToSearch: ValidCourses[] = [
    {
      name: "OS",
      codcurso: "CS2S01",
      department: "CS",
    },
    {
      name: "BD1",
      codcurso: "CS2012",
      department: "CS",
    },
    {
      name: "Proyecto Interdisciplinario I",
      codcurso: "EEGG01",
      department: "HU",
    },
    {
      name: "Proyecto Interdisciplinario II",
      codcurso: "EEGG02",
      department: "HU",
    },
    {
      name: "Proyecto Interdisciplinario III",
      codcurso: "EEGG03",
      department: "HU",
    },
  ];

  expect(
    FilterName(
      objToSearch,
      {
        keys: ["name"],
      },
      "akjsdjkasdjkajdkasjkd"
    ).length === 0
  ).toBe(true);
});


test("check if fuse function is working properly", () => {
  const objToSearch: ValidCourses[] = [
    {
      name: "OS",
      codcurso: "CS2S01",
      department: "CS",
    },
    {
      name: "BD1",
      codcurso: "CS2012",
      department: "CS",
    },
    {
      name: "Proyecto Interdisciplinario I",
      codcurso: "EEGG01",
      department: "HU",
    },
    {
      name: "Proyecto Interdisciplinario II",
      codcurso: "EEGG02",
      department: "HU",
    },
    {
      name: "Proyecto Interdisciplinario III",
      codcurso: "EEGG03",
      department: "HU",
    },
  ];

  expect(
    FilterName(
      objToSearch,
      {
        keys: ["name"],
      },
      "EE"
    ).length > 2
  ).toBe(true);
});
