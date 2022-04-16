import { async } from "@firebase/util";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore/lite";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ListingItem from "../components/ListingItem";
import Spinner from "../components/Spinner";
import { db } from "../firebase.config";

function Category() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);
  const params = useParams();

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        // Get reference
        const listingsRef = collection(db, "listings");
        // Create query
        const fetchQuery = query(
          listingsRef,
          where("type", "==", params.categoryName),
          orderBy("timestamp", "desc"),
          limit(2)
        );
        // Execute query
        const querySnap = await getDocs(fetchQuery);
        const lastVisible = querySnap.docs[querySnap.docs.length-1];
        setLastFetchedListing(lastVisible);
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
        setLoading(false);
        toast.error("Error occured while fetching the listings data")
      }
    };
    fetchListings();
  }, [params.categoryName]);

  // Pagination or Load More functionality.
  const onFetchMoreListings = async () => {
    setLoading(true);
    try {
      // Get reference
      const listingsRef = collection(db, "listings");
      // Create query
      const fetchQuery = query(
        listingsRef,
        where("type", "==", params.categoryName),
        orderBy("timestamp", "desc"),
        startAfter(lastFetchedListing),
        limit(10)
      );
      // Execute query
      const querySnap = await getDocs(fetchQuery);
      const lastVisible = querySnap.docs[querySnap.docs.length-1];
      setLastFetchedListing(lastVisible);
      // Set the listings from API to listings state.
      const tempListings = [];
      querySnap.forEach((doc=>{
        tempListings.push({
          id:doc.id,
          data:doc.data()
        })
      }));
      setListings((prevState) => [...prevState, ...tempListings]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Error occured while fetching the listings data")
    }
  };

  return (
    <div className="category">
      <header>
        <p className="pageHeader">
          {
            params.categoryName == 'rent'?
            'Places for Rent':
            'Places for Sale'
          }
        </p>
      </header>
      {loading && <Spinner />}
      {
        !loading && 
        listings && 
        listings.length>0 && 
        <>
          <main>
            <ul className="categoryListings">
            {
              listings.map((listing) => (
                <ListingItem listing={listing.data} id={listing.id} key={listing.id} />
              ))
            }
            </ul>
          </main>
          <br />
          <br />
          {lastFetchedListing && (
            <p className='loadMore' onClick={onFetchMoreListings}>
              Load More
            </p>
          )}
        </>
      }
      {!loading && listings && listings.length == 0 && <p>No listings to display</p>}
    </div>
  );
}

export default Category;
