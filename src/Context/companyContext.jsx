import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { baseUrl } from "../utils/ApiConstants";

export const CompanyContext = createContext();

export const CompanyProvider = ({ children }) => {
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const res = await axios.get(
                    `${baseUrl}/auth/all-companies`
                );
                setCompanies(res.data);  
            } catch (error) {
                console.error("Failed to fetch company data:", error);
            }
        };

        fetchCompany();
    }, []);

    return (
        <CompanyContext.Provider value={{ companies }}>
            {children}
        </CompanyContext.Provider>
    );
};

export const useCompany = () => useContext(CompanyContext);
