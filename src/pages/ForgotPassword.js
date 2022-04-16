import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { toast } from 'react-toastify';
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';

function ForgotPassword() {
  const [email, setEmail] = useState('');

  const forgotPasswordSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success('Change password email sent');
    } catch (error) {
      toast.error('Could not send reset email');
    }
  };

  const emailChangeHandler = (event) => {
    setEmail(event.target.value);
  };

  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Forgot Password</p>
      </header>
      <main>
        <form onSubmit={forgotPasswordSubmitHandler}>
          <input
            type="text"
            className="emailInput"
            placeholder="Email"
            value={email}
            onChange={emailChangeHandler}
          />
          <Link className="forgotPassword" to="/sign-in">
            Sign In
          </Link>
          <button type="submit" className="signInButton">
            <ArrowRightIcon />
          </button>
        </form>
      </main>
    </div>
  );
}

export default ForgotPassword;
