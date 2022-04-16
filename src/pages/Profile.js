import React, { useEffect, useState } from "react";
import { db } from "../firebase.config";
import {
  doc,
  updateDoc,
  collection,
  getDocs,
  where,
  limit,
  orderBy,
  query,
  deleteDoc
} from "firebase/firestore/lite";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg";
import homeIcon from "../assets/svg/homeIcon.svg";
import ListingItem from "../components/ListingItem";

function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState(null);
  const [changeDetails, setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser?.displayName,
    email: auth.currentUser?.email,
  });
  const { name, email } = formData;

  const logoutHandler = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onChangeSubmitHandler = async () => {
    if (auth.currentUser.displayName != name) {
      try {
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
          name,
        });
        toast.success("Details Updated");
      } catch (error) {
        toast.error(error.message);
      }
    }
  };
  const onChangeDetailsHandler = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      try {
        // Get reference
        const listingsRef = collection(db, "listings");
        // Create query
        const fetchQuery = query(
          listingsRef,
          where("userRef", "==", auth.currentUser.uid),
          orderBy("timestamp", "desc"),
          limit(10)
        );
        // Execute query
        const querySnap = await getDocs(fetchQuery);
        // Set the listings from API to listings state.
        const tempListings = [];
        querySnap.forEach((doc=>{
          tempListings.push({
            id:doc.id,
            data:doc.data()
          })
        }));
        setListings(tempListings);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
        toast.error("Error occured while fetching the listings data");
      }
    };
    fetchListing();
  }, [auth.currentUser.uid]);

  const onDelete = async (listingId) => {
    if (window.confirm('Are you sure you want to delete?')) {
      try{
        await deleteDoc(doc(db, 'listings', listingId))
        const updatedListings = listings.filter(
          (listing) => listing.id !== listingId
        )
        setListings(updatedListings)
        toast.success('Successfully deleted listing')
      }
      catch(error){
        console.log(error);
        toast.error('Error occured while deleting the listing, please try again later.')
      }

    }
  }

  const onEdit = (listingId) => navigate(`/edit-listing/${listingId}`)

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
            }}
          >
            {changeDetails ? "done" : "change"}
          </p>
        </div>
        <div className="profileCard">
          <form>
            <input
              type="text"
              id="name"
              className={!changeDetails ? "profileName" : "profileNameActive"}
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
        <Link to={"/create-listing"} className="createListing">
          <img src={homeIcon} alt="home" />
          <p>Sell or Rent your home</p>
          <img src={arrowRight} alt="arrow right" />
        </Link>
        {!loading && listings?.length > 0 && (
          <>
            <p className='listingText'>Your Listings</p>
            <ul className='listingsList'>
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                  onDelete={() => onDelete(listing.id)}
                  onEdit={() => onEdit(listing.id)}
                />
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
}

export default Profile;
