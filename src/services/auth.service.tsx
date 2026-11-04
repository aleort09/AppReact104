import { saveAccessToken, saveRefreshToken } from '@/utils/storage';
import { API_URL } from "@/constants/api";
import { LoginRequest, LoginResponse } from "@/interfaces/auth.interface";

export const loginService = async(data: LoginRequest):Promise<LoginResponse> => {
    const response =  await fetch(
         `${API_URL}/auth/login`,
         {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "*/*"
            },
             body: JSON.stringify(data)
         }
    );

    const result = await response.json();
    if (!response.ok) {
        return {
            success: false,
            message:
                result.message ||
                "Usuario o contraseña incorrectos"
        };
    }


    if (result.accessToken || result.token) { await saveAccessToken(result.accessToken || result.token); }
    if (result.refreshToken) { await saveRefreshToken(result.refreshToken); }
    return { success: true, message: "Login correcto" };

}