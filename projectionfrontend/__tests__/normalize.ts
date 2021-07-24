import { Normalize } from "../businesses/normalize";

test("check normalize function ignores spaces", () => {
  expect(Normalize("   Probando    funcion   ")).toBe(
    Normalize("Probandofuncion")
  );
});

test("check normalize function ignores accents", () => {
  expect(Normalize("Próbando función")).toBe(Normalize("Probando funcion"));
});

test("check normalize function ignores capital letters", () => {
  expect(Normalize("PROBANDO funcion")).toBe(Normalize("Probando funcion"));
});

test("check normalize works for all above tests", () => {
  expect(Normalize("      PRÓBANDO función    ")).toBe(
    Normalize("Probandofuncion")
  );
});
