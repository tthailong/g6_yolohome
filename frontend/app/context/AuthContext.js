"use client"

import React, { createContext, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/api/auth";
import api from "@/lib/api/client";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const router = useRouter();

    const login = async (username, password) => {
        try {
            const data = await authService.login(username, password);
            localStorage.setItem('token', data.access_token);
            setUser(data);
            router.push('/homes');
        } catch (error){
            console.log('Login Failed:', error);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
