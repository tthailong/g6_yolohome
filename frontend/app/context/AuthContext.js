"use client"

import React, { createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/api/auth";
import api from "@/lib/api/client";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const loadUser = async () => {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            if (token) {
                try {
                    const data = await authService.getMe();
                    setUser(data);
                } catch (error) {
                    console.log('Failed to restore user session:', error);
                    localStorage.removeItem('token');
                    setUser(null);
                }
            }
        };
        loadUser();
    }, []);

    const login = async (username, password) => {
        try {
            const data = await authService.login(username, password);
            localStorage.setItem('token', data.access_token);
            // Fetch full profile info (contains id)
            const profile = await authService.getMe();
            setUser(profile);
            router.push('/homes');
        } catch (error){
            console.log('Login Failed:', error);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('selectedHomeId');
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
