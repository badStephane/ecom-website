import { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';



const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const {token, setToken, navigate, backendUrl} = useContext(ShopContext);
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
 




  const onSubmitHandler = async (event) =>{
    event.preventDefault();
    try {
      if (currentState === 'Sign Up'){
        // Validate sign up fields
        if (!firstName || !lastName || !email || !password) {
          toast.error('Veuillez remplir tous les champs');
          return;
        }

        const response = await axios.post(backendUrl + '/api/auth/register',{
          firstName,
          lastName,
          email,
          password
        })
        if(response.data.success){
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          toast.success('Compte créé avec succès !');
        } else {
          toast.error(response.data.message)
        }
        
      } else {
        // Validate login fields
        if (!email || !password) {
          toast.error('Veuillez remplir tous les champs');
          return;
        }

        const response = await axios.post(backendUrl + '/api/auth/login',{
          email,
          password
        })
    
        if(response.data.success){
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          toast.success('Connexion réussie !');
        } else {
          toast.error(response.data.message)
        }
      }
      
    } catch (error){
      console.log(error);
      const errorMsg = error.response?.data?.message || error.message || 'An error occurred';
      toast.error(errorMsg);
    }
  }



  // Redirect to home page if token is set
  // This will happen when user is logged in
useEffect(() =>{
if(token){
  navigate('/')
}
},[token, navigate])



  return (
    <div>
      <form onSubmit={onSubmitHandler} className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800">
          
          <div className="inline-flex items-center gap-2 mb-2 mt-10">
            <p className="prata-regular text-3xl">{currentState === 'Login' ? 'Connexion' : 'Inscription'}</p>
            <hr className='border-none h-[1.5px] w-8 bg-gray-800'/>
          </div>
      
     {currentState === 'Login' ? '' :
      <>
        <input 
          onChange={(e)=>setFirstName(e.target.value)} 
          value={firstName} 
          type="text" 
          className='w-full px-3 py-2 border border-gray-800' 
          placeholder='Prénom' 
          required
        />
        <input 
          onChange={(e)=>setLastName(e.target.value)} 
          value={lastName} 
          type="text" 
          className='w-full px-3 py-2 border border-gray-800' 
          placeholder='Nom' 
          required
        />
      </>
     } 
      <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" className='w-full px-3 py-2 border border-gray-800' placeholder='Email' required/>
      <input onChange={(e)=>setPassword(e.target.value)} value={password} type="password" className='w-full px-3 py-2 border border-gray-800' placeholder='Mot de passe' required/>



      <div className='w-full flex justify-between text-sm mt-[-8px]'>
      <p className='cursor-pointer'>Mot de passe oublié ?</p>
      {
        currentState === 'Login' ? 
        <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer'>Créer un compte</p> 
        : 
        <p onClick={() => setCurrentState('Login')} className='cursor-pointer'>Se connecter</p>
      }

      </div>

<button className='bg-black text-white font-light px-8 py-2 mt-4'>{currentState === 'Login' ? 'Se connecter' : 'S\'inscrire'}</button>

      </form>
    </div>
  )
}

export default Login
