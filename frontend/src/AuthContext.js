import React, {createContext, useState, useContext} from 'react'

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(()=>{
      return localStorage.getItem('isAuthenticated') === 'true';
    });
    const [user, setUser] = useState(null);
    const login = ()=> {setIsAuthenticated(true)};
    const logout = ()=> {setIsAuthenticated(false); setUser(null)};
  return (
    <AuthContext.Provider value={{isAuthenticated, login, logout}}>
        {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);
