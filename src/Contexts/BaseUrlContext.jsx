import { createContext, useState } from "react";

export let BaseUrlContext=createContext();

export default function BaseUrlContextProvider({children}){
  let [baseUrl,setBaseUrl]=useState('http://www.sabil.somee.com');
  return <BaseUrlContext.Provider value={{baseUrl,setBaseUrl}}>
    {children}
  </BaseUrlContext.Provider>
}

