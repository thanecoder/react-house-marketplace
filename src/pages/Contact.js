import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { db } from "../firebase.config";
import { doc, getDoc } from "firebase/firestore/lite";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [landlord, setLandlord] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useParams();

  useEffect(() => {
    const fetchLandlord = async () => {
      console.log(params.landlordId);
      setLoading(true);
      try {
        // Get reference
        const docRef = doc(db, "users", params.landlordId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log("DocSnap exists", docSnap.data());
          setLandlord(docSnap.data());
        } else {
          toast.error("Could not get landlord data");
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
        toast.error("Error occurred while fetching the landlord data");
      }
    };
    fetchLandlord();
  }, [params.landlordId]);

  if (loading) {
    return <Spinner />;
  }

  function onChangeHandler(event) {
      setMessage(event.target.value);
  }

  return (
      <div className="pageContainer">
          <header>
              <p className="pageHeader">
                  Contact Landlord
              </p>
          </header>
          {
              landlord != null && (
                  <main>
                      <div className="contactLandlord">
                          <p className="landlordName">Contact {landlord?.name}</p>
                      </div>
                      <form className="messageForm">
                          <div className="messageDiv">
                              <label className="messageLabel">
                                  Message
                              </label>
                              <textarea name="message" id="message" className="textarea" onChange={onChangeHandler}></textarea>
                          </div>
                          <a href={`mailto:${landlord.email}?Subject=${searchParams.get('listingName')}&body=${message}`}>
                              <button className="primaryButton">Send Message</button>
                        </a>
                      </form>
                  </main>
              )
          }
      </div>
  );
};

export default Contact;
