import { createContext, useContext, useState } from 'react';

const PaginationContext = createContext();

export const usePagination = () => {
    const context = useContext(PaginationContext);
    if (!context) {
        return { currentPage: 1, totalPages: 1, setCurrentPage: () => {}, setTotalPages: () => {} };
    }
    return context;
};

export const PaginationProvider = ({ children }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    return (
        <PaginationContext.Provider value={{ currentPage, totalPages, setCurrentPage, setTotalPages }}>
            {children}
        </PaginationContext.Provider>
    );
};
