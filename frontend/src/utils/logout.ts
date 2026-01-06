export default function logout(){
    localStorage.removeItem('user');
    localStorage.removeItem('token')
}