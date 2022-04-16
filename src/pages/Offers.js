import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore/lite";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ListingItem from "../components/ListingItem";
import Spinner from "../components/Spinner";
import { db } from "../firebase.config";

function Offers() {
  const [offersList, setOffersList] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true);
      try {
        // Get reference
        const listingsRef = collection(db, "listings");
        // Create query
        const fetchQuery = query(
          listingsRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(10)
        );
        // Execute query
        const querySnap = await getDocs(fetchQuery);
        // Set the offersList from API to offersList state.
        const tempOffers = [];
        querySnap.forEach((doc) => {
          tempOffers.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setOffersList(tempOffers);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error("Error occurred while fetching the offersList data");
      }
    };
    fetchOffers();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      {offersList == null && <p>No Offers to display</p>}
      {offersList != null && (
        <div className="category">
          <header>
            <p className="pageHeader">Offers</p>
          </header>
          <main>
            <ul className="categoryListings">
              {offersList.map((listing) => (
                <ListingItem
                  listing={listing.data}
                  id={listing.id}
                  key={listing.id}
                />
              ))}
            </ul>
          </main>
        </div>
      )}
    </>
  );
}

export default Offers;
