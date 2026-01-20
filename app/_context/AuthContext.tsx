"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { IUser } from "@/_models/entities/user.interface";
import { IAuthResponse } from "@/_models/responses/auth-res.interface";
import { ILoginRequest, IRegisterRequest } from "@/_models/requests/auth-req.interface";
import * as authService from "@/_services/auth.service";

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: ILoginRequest) => Promise<void>;
  register: (data: IRegisterRequest) => Promise<void>;
  logout: () => void;
  updateUser: (user: IUser) => void;
  hasRequiredRole: (requiredRole?: string | string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load auth data from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user data:", error);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }

    setIsLoading(false);
  }, []);

  const saveAuthData = (authData: IAuthResponse) => {
    const { access_token, user } = authData;

    setToken(access_token);
    setUser(user);

    localStorage.setItem(TOKEN_KEY, access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  };

  const clearAuthData = () => {
    setToken(null);
    setUser(null);

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const login = async (credentials: ILoginRequest) => {
    try {
      const response = await authService.login(credentials);
      saveAuthData(response.data);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (data: IRegisterRequest) => {
    try {
      const response = await authService.register(data);
      saveAuthData(response.data);
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const logout = () => {
    clearAuthData();
  };

  const updateUser = (updatedUser: IUser) => {
    setUser(updatedUser);
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
  };

  const hasRequiredRole = (requiredRole?: string | string[]): boolean => {
    // If no role required, only check if authenticated
    if (!requiredRole) {
      return !!user && !!token;
    }

    // Check if user is authenticated
    if (!user || !token) {
      return false;
    }

    // Check if user has required role(s)
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.role);
    }

    return user.role === requiredRole;
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    hasRequiredRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
