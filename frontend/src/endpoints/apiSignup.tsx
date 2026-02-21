import type { NavigateFunction } from "react-router";

//api endpoint for Signing up
//Post request

export default async function ApiSignup(event: React.FormEvent<HTMLFormElement>, navigate: NavigateFunction){
    const formData: FormData = new FormData(event.currentTarget)
    const {name, email, password, confirmPassword} = Object.fromEntries(formData.entries())
    const signUpData = {name, email, password};


    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return; // stop execution
      }
    
      try {
        const response = await fetch('https://ai-pdf-knowledge-assistant.onrender.com/signup', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          credentials: 'include',
          body: JSON.stringify(signUpData)
        })
  
        if (!response.ok){
            throw new Error('HTTP error')
        }
        
        // navigate to main page
        // router.push('/login')
        navigate('/login');
  
      }
      catch(e){
        console.error(`Error:`, e);
      }
    
}