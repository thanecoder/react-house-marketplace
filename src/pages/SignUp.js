import React, { useState } from 'react';
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';
import VisibilityIcon from '../assets/svg/visibilityIcon.svg';
import { db, auth, storage } from '../firebase.config';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore/lite';
import { toast } from 'react-toastify';

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();
  const { name, email, password } = formData;

  const formChangeHandler = (event) => {
    setFormData((prevState) => ({
      ...prevState,
      [event.target.id]: event.target.value
    }));
  };

  const handleSignupSubmit = async (event) => {
    event.preventDefault();
    if (email.trim().length !== 0 && password.trim().length !== 0) {
      try {
        // eslint-disable-next-line prettier/prettier
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        await updateProfile(auth.currentUser, {
          displayName: name
        });

        const formDataCopy = { ...formData };
        delete formDataCopy.password;
        formDataCopy.timestamp = serverTimestamp();
        await setDoc(doc(db, 'users', user.uid), formDataCopy);
        toast.success('Sign Up Successful');
        navigate('/');
      } catch (error) {
        const errorMessage = error.message;
        toast.error(errorMessage);
      }
    }
  };

  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome Back!</p>
        </header>
        <form>
          <input
            type="text"
            value={name}
            className="nameInput"
            placeholder="Name"
            id="name"
            onChange={formChangeHandler}
          />
          <input
            type="email"
            value={email}
            className="emailInput"
            placeholder="Email"
            id="email"
            onChange={formChangeHandler}
          />
          <div className="passwordInputDiv">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              className="passwordInput"
              placeholder="Password"
              id="password"
              onChange={formChangeHandler}
            />
            <img
              src={VisibilityIcon}
              alt="Show Password"
              className="showPassword"
              onClick={() => setShowPassword((prevState) => !prevState)}
            />
          </div>
          <div className="signInBar">
            <p className="signInText">Sign Up</p>
            <button className="signInButton">
              <ArrowRightIcon
                fill="#ffffff"
                width="34px"
                height="34px"
                onClick={handleSignupSubmit}
              />
            </button>
          </div>
        </form>
        {/* Google oAuth */}
      </div>
    </>
  );
}

export default SignUp;
