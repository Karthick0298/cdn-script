"use client";
import { useContext } from "react";
import ContextApi from "../Contexts/ContextApi";

const useContextApi = () => useContext(ContextApi);

export default useContextApi;
