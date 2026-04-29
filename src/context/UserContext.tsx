"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface UserContextType {
  username: string | null;
  groups: string[];
  login: (username: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  refreshGroups: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = useState<string | null>(null);
  const [groups, setGroups] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from local storage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("mc_user");
    if (savedUser) {
      login(savedUser);
    } else {
      setIsLoading(false);
    }
  }, []);

  const refreshGroups = async () => {
    if (!username) return;
    try {
      const res = await fetch(`/api/user/info?username=${username}`);
      const data = await res.json();
      if (data.groups) {
        setGroups(data.groups);
      }
    } catch (err) {
      console.error("Failed to refresh groups", err);
    }
  };

  const login = async (name: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/user/info?username=${name}`);
      const data = await res.json();
      
      setUsername(name);
      setGroups(data.groups || ["default"]);
      localStorage.setItem("mc_user", name);
    } catch (err) {
      console.error("Login failed", err);
      // Even if RCON fails, we set the username so they can still browse
      setUsername(name);
      setGroups(["default"]);
      localStorage.setItem("mc_user", name);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUsername(null);
    setGroups([]);
    localStorage.removeItem("mc_user");
  };

  return (
    <UserContext.Provider value={{ username, groups, login, logout, isLoading, refreshGroups }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
