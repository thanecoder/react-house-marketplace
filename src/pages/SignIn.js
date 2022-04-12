import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';
import VisibilityIcon from '../assets/svg/visibilityIcon.svg';
import { auth } from '../firebase.config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-toastify';

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;
  const navigate = useNavigate();

  const formChangeHandler = (event) => {
    setFormData((prevState) => ({
      ...prevState,
      [event.target.id]: event.target.value
    }));
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    if (email.trim().length !== 0 && password.trim().length !== 0) {
      try {
        // eslint-disable-next-line prettier/prettier
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        toast.success('Welcome');
        navigate('/profile');
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
          <Link to="/forgot-password" className="forgotPasswordLink">
            <u>Forgot Password</u>
          </Link>
          <div className="signInBar">
            <p className="signInText">Sign In</p>
            <button className="signInButton">
              <ArrowRightIcon
                fill="#ffffff"
                width="34px"
                height="34px"
                onClick={handleLoginSubmit}
              />
            </button>
          </div>
        </form>
        {/* Google oAuth */}
        <Link to={'/sign-up'} className="registerLink">
          Sign Up Instead
        </Link>
      </div>
    </>
  );
}

export default SignIn;
