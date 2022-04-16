import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { db } from '../firebase.config';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore/lite';
import { toast } from 'react-toastify';
import googleIcon from '../assets/svg/googleIcon.svg';
  
function OAuth() {
    const navigate = useNavigate();
    const location = useLocation();

    const onGoogleClick = async () => {
        try {
            const auth = getAuth();
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            // Check if the user is in our DB and add if not present.

            // Get doc reference basically Check if the user is in our DB
            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);

            // If user doesn't exist , add in DB
            if(!docSnap.exists()){
                await setDoc(doc(db, 'users', user.uid), {
                    name:user.displayName,
                    email: user.email,
                    timestamp:serverTimestamp()
                });
            }
            toast.success("Successfully authenticated with Google");
            navigate('/');
        } catch (error) {
            console.log(error);
            toast.error('Could not authorize with Google');
        }
    }

    return (
        <div className="socialLogin">
            <p>Sign {location.pathname == '/sign-up'?'Up':'In'} with</p>
            <button className="socialIconDiv">
                <img className='socialIconImg' src={googleIcon} alt="Google" onClick={onGoogleClick}/>
            </button>
        </div>
    )
}

export default OAuth