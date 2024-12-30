export class AuthService {
    static getToken() {
        // search in cookies
        let token = document.cookie.split(';').find((cookie) => {
            return cookie.startsWith('token');
        });
        if (token) {
            console.log(token);
            return token.split('=')[1];
        }
        return '';
    }
}
