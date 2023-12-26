export const corsCredentials = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://192.168.1.4:5500');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    next();
}