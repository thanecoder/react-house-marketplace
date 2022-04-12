import React, { useEffect, useState } from 'react';
import SignIn from './SignIn';
import { db } from '../firebase.config';
import { doc, updateDoc } from 'firebase/firestore/lite';
import { getAuth, signOut, updateProfile } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [changeDetails, setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser?.displayName,
    email: auth.currentUser?.email
  });
  const { name, email } = formData;

  const logoutHandler = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onChangeSubmitHandler = async () => {
    if (auth.currentUser.displayName != name) {
      try {
        await updateProfile(auth.currentUser, {
          displayName: name
        });
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, {
          // eslint-disable-next-line prettier/prettier
          name
        });
        toast.success('Details Updated');
      } catch (error) {
        toast.error(error.message);
      }
    }
  };
  const onChangeDetailsHandler = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }));
  };

  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button type="button" className="logOut" onClick={logoutHandler}>
          Logout
        </button>
      </header>
      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Personal Details</p>
          <p
            className="changePersonalDetails"
            onClick={() => {
              changeDetails && onChangeSubmitHandler();
              setChangeDetails((prevState) => !prevState);
            }}>
            {changeDetails ? 'done' : 'change'}
          </p>
        </div>
        <div className="profileCard">
          <form>
            <input
              type="text"
              id="name"
              className={!changeDetails ? 'profileName' : 'profileNameActive'}
              disabled={!changeDetails}
              onChange={onChangeDetailsHandler}
              value={name}
            />
            <input
              type="email"
              id="email"
              className="profileName"
              disabled={true}
              onChange={onChangeDetailsHandler}
              value={email}
            />
          </form>
        </div>
      </main>
    </div>
  );
}

export default Profile;
