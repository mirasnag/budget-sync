import React, {
  createContext,
  useReducer,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { fetchData } from "../utils/api";
import {
  CollectionType,
  Category,
  ContextAction,
  ContextType,
} from "../utils/types";

// Define the action types
type CategoryAction = ContextAction<Category>;

// Create the reducer function
const categoryReducer = (
  state: Category[],
  action: CategoryAction
): Category[] => {
  switch (action.type) {
    case "INIT":
      return action.payload;
    case "ADD":
      return [...state, action.payload];
    case "DELETE":
      return state.filter((category) => category.id !== action.payload);
    case "EDIT":
      return state.map((category) =>
        category.id === action.payload.id
          ? { ...category, [action.payload.prop]: action.payload.value }
          : category
      );
    default:
      return state;
  }
};

const CategoryContext = createContext<ContextType<Category> | undefined>(
  undefined
);

const initialValue = [] as Category[];

export const CategoryProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [categories, categoryDispatch] = useReducer(
    categoryReducer,
    initialValue
  );

  useEffect(() => {
    const fetchCategories = async () => {
      const fetchedData = (await fetchData(
        CollectionType.CATEGORIES
      )) as Category[];
      categoryDispatch({ type: "INIT", payload: fetchedData });
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    localStorage.setItem(CollectionType.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  return (
    <CategoryContext.Provider
      value={{ data: categories, dispatch: categoryDispatch }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategoryContext = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error(
      "useCategoryContext must be used within a CategoryProvider"
    );
  }
  return context;
};
