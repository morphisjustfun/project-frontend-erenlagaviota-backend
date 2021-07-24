import {ValidCourses} from "./request/dataApi";
import Fuse from "fuse.js";

export const FilterName = (
    list: ValidCourses[],
    options: Fuse.IFuseOptions<ValidCourses>,
    input: string
): ValidCourses[] => {
    const FuseSearch = new Fuse(list, options);
    return FuseSearch.search(input).map((result) => result.item);
};

