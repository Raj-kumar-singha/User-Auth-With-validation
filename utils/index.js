
class Utils {
    constructor() {
        this.isJWTExpired = (token) => {
            const tokenPayload = JSON.parse(atob(token.split('.')[1]));
            const tokenExpirationTime = tokenPayload.exp * 1000; 
            const currentTime = Date.now();

            return currentTime >= tokenExpirationTime;
        }
    }
}

module.exports = new Utils()