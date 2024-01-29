
class AuthService {
    static isAuthenticated() {
        const token = localStorage.getItem('Token');
        return !!token;
    }
    static logout() {
        localStorage.removeItem('Token');
    }
}

export default AuthService;
