import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const fetchUserProfile = async (token: string) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/auth/profile/`, {
        headers: {
          Authorization: `Bearer ${token}`, // Đính kèm token để Backend xác thực
        },
      });
      if (res.ok) {
        const fullUserData = await res.json();
        localStorage.setItem("user", JSON.stringify(fullUserData));
        setUser(fullUserData); // Lúc này user sẽ có đầy đủ: { id, username, avatar, email... }
        console.log("full data: ", fullUserData);
      }
    } catch (err) {
      console.error("Không thể lấy profile user:", err);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        // const decoded: any = jwtDecode(token);
        fetchUserProfile(token);
      } catch {
        localStorage.removeItem("accessToken");
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, fetchUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
