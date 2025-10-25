import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const AuthContext = createContext(null);

// Hook personalizado para usar el contexto
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

// Clave para localStorage con prefijo único
const STORAGE_KEY = 'pasteleria_mil_sabores_auth_v1';

// Tiempo de expiración de sesión (30 minutos)
const SESSION_TIMEOUT = 30 * 60 * 1000;

// Sanitización básica para prevenir XSS
const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>]/g, '').trim();
};

// Validar estructura de usuario
const validateUser = (user) => {
  if (!user || typeof user !== 'object') return null;
  if (!user.name || !user.email || !user.role) return null;
  if (!['cliente', 'admin'].includes(user.role)) return null;
  return {
    name: sanitizeString(user.name),
    email: sanitizeString(user.email),
    role: user.role,
    loginTime: user.loginTime || Date.now()
  };
};

// Encriptar datos básico (Base64 + ofuscación simple)
// NOTA: En producción REAL, usar HTTPS + tokens JWT del backend
const encryptData = (data) => {
  try {
    const jsonStr = JSON.stringify(data);
    const base64 = btoa(jsonStr);
    // Agregar salt simple para ofuscar
    return `v1.${base64}.${Date.now()}`;
  } catch {
    return null;
  }
};

// Desencriptar datos
const decryptData = (encrypted) => {
  try {
    if (!encrypted || typeof encrypted !== 'string') return null;
    const parts = encrypted.split('.');
    if (parts.length !== 3 || parts[0] !== 'v1') return null;
    const jsonStr = atob(parts[1]);
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const encrypted = localStorage.getItem(STORAGE_KEY);
      if (!encrypted) return null;
      
      const decrypted = decryptData(encrypted);
      const validated = validateUser(decrypted);
      
      // Verificar si la sesión ha expirado
      if (validated && (Date.now() - validated.loginTime > SESSION_TIMEOUT)) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      
      return validated;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  });

  // Estado para rastreo de intentos de login (rate limiting básico)
  const [loginAttempts, setLoginAttempts] = useState(() => {
    try {
      const attempts = sessionStorage.getItem('login_attempts');
      return attempts ? parseInt(attempts, 10) : 0;
    } catch {
      return 0;
    }
  });

  // Persistir usuario en localStorage (encriptado)
  useEffect(() => {
    try {
      if (user) {
        const encrypted = encryptData(user);
        if (encrypted) {
          localStorage.setItem(STORAGE_KEY, encrypted);
        }
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.error('Error al guardar sesión:', error);
    }
  }, [user]);

  // Auto-logout por timeout de sesión
  useEffect(() => {
    if (!user) return;

    const checkSession = setInterval(() => {
      if (Date.now() - user.loginTime > SESSION_TIMEOUT) {
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
      }
    }, 60000); // Verificar cada minuto

    return () => clearInterval(checkSession);
  }, [user]);

  // Login con validación y rate limiting
  const login = useCallback(({ name, email, password, role = 'cliente' }) => {
    // Rate limiting: máximo 5 intentos
    if (loginAttempts >= 5) {
      throw new Error('Demasiados intentos de login. Espera 5 minutos.');
    }

    // Validaciones
    if (!name || name.length < 2 || name.length > 50) {
      setLoginAttempts(prev => {
        const newAttempts = prev + 1;
        sessionStorage.setItem('login_attempts', newAttempts.toString());
        return newAttempts;
      });
      throw new Error('Nombre inválido (2-50 caracteres)');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setLoginAttempts(prev => {
        const newAttempts = prev + 1;
        sessionStorage.setItem('login_attempts', newAttempts.toString());
        return newAttempts;
      });
      throw new Error('Email inválido');
    }

    if (!password || password.length < 6) {
      setLoginAttempts(prev => {
        const newAttempts = prev + 1;
        sessionStorage.setItem('login_attempts', newAttempts.toString());
        return newAttempts;
      });
      throw new Error('Contraseña debe tener al menos 6 caracteres');
    }

    if (!['cliente', 'admin'].includes(role)) {
      throw new Error('Rol inválido');
    }

    // SIMULACIÓN DE VALIDACIÓN DE CREDENCIALES
    // En producción, aquí harías una llamada al backend
    // Por ahora, usuarios demo válidos:
    const validUsers = [
      { email: 'cliente@email.com', password: '123456', role: 'cliente', name: 'Juan Pérez' },
      { email: 'admin@admin.com', password: 'admin123', role: 'admin', name: 'Admin Pastelería' },
      { email: 'maria@email.com', password: '123456', role: 'cliente', name: 'María González' }
    ];

    // Buscar usuario válido
    const validUser = validUsers.find(u => u.email === email && u.password === password);

    if (!validUser) {
      // Credenciales incorrectas - incrementar intentos
      setLoginAttempts(prev => {
        const newAttempts = prev + 1;
        sessionStorage.setItem('login_attempts', newAttempts.toString());
        return newAttempts;
      });
      throw new Error('Email o contraseña incorrectos');
    }

    // Login exitoso - usar datos del usuario válido
    const newUser = {
      name: sanitizeString(validUser.name),
      email: sanitizeString(validUser.email),
      role: validUser.role,
      loginTime: Date.now()
    };

    setUser(newUser);
    setLoginAttempts(0);
    sessionStorage.removeItem('login_attempts');
    
    return newUser;
  }, [loginAttempts]);

  // Logout seguro
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    setLoginAttempts(0);
    sessionStorage.removeItem('login_attempts');
  }, []);

  // Actualizar perfil
  const updateProfile = useCallback((updates) => {
    if (!user) throw new Error('No hay sesión activa');
    
    const updatedUser = {
      ...user,
      name: updates.name ? sanitizeString(updates.name) : user.name,
      email: updates.email ? sanitizeString(updates.email) : user.email,
      loginTime: user.loginTime // Mantener tiempo original de login
    };

    const validated = validateUser(updatedUser);
    if (!validated) throw new Error('Datos de perfil inválidos');
    
    setUser(validated);
    return validated;
  }, [user]);

  // Helpers de roles
  const isAdmin = user?.role === 'admin';
  const isCliente = user?.role === 'cliente';
  const isAuthenticated = !!user;

  // Tiempo restante de sesión (en minutos)
  const sessionTimeRemaining = user 
    ? Math.max(0, Math.floor((SESSION_TIMEOUT - (Date.now() - user.loginTime)) / 60000))
    : 0;

  const value = {
    user,
    login,
    logout,
    updateProfile,
    isAdmin,
    isCliente,
    isAuthenticated,
    loginAttempts,
    sessionTimeRemaining
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
