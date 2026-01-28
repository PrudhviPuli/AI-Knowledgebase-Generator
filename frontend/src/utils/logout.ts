export default function logout(){
    localStorage.removeItem('user_id')
    localStorage.removeItem('user');
    localStorage.removeItem('token')
}