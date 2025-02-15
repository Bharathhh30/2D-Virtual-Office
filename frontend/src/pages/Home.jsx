import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useFireBase } from '../context/FireBase';

function Home() {
  const firebase = useFireBase()
  const navigate = useNavigate();

  const handleSignInWithGoogle = async() =>{
    await firebase.signUpWithGoogle();
    console.log('Sign In With Google success')
  }


  return (
    <div className='p-3 '>
      <div className='flex items-center'> 
        <div className='text-3xl font-bold p-2'>CollabVerse</div>
        <div className='ml-auto flex gap-x-2 text-xl font-semibold text-white'> 
          {/* <button className='bg-amber-400 p-1 rounded-md'
            onClick={() => navigate('/auth')}
          >Sign In</button>
          <button className='bg-amber-400 p-2 rounded-md'
            onClick={() => navigate('/auth')}
          >Sign Up</button> */}
          <button 
          onClick={handleSignInWithGoogle}
          className='bg-blue-400 rounded-md p-2 cursor-pointer'>SignIn With Google</button>
        </div>
      </div>
    </div>
  );
}
export default Home