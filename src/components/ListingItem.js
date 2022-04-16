import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as DeleteIcon } from "../assets/svg/deleteIcon.svg";
import { ReactComponent as EditIcon } from '../assets/svg/editIcon.svg';
import bedIcon from "../assets/svg/bedIcon.svg";
import bathroomIcon from "../assets/svg/bathtubIcon.svg";

const ListingItem = ({ listing, id, onEdit, onDelete }) => {
  return (
    <li className="categoryListing">
      <Link
        to={`/category/${listing.type}/${id}`}
        className="categoryListingLink"
      >
        <img
          src={listing.imageUrls[0]}
          alt="listing.name"
          className="categoryListingImg"
        />
        <div className="categoryListingDetails">
            <p className="categoryListingLocations">
                {listing.location}
            </p>
            <p className="categoryListingName">
                {listing.name}
            </p>
            <p className="categoryListingPrice"> 
                {listing.offer ? 
                '₹ '+listing.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                :'₹ '+listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                {listing.type == 'rent' ? ' / month':''}
            </p>
            <div className="categoryListingInfoDiv">
                <img src={bedIcon} alt="bed" style={{color:'#ffffff'}} />
                <p className="categoryListingInfoText">
                  {listing.bedrooms} {listing.bedrooms > 1?`Bedrooms`:`Bedroom`}
                </p>
                <img src={bathroomIcon} alt="bathrooms" />
                <p className="categoryListingInfoText">
                  {listing.bathrooms} {listing.bathrooms > 1?`Bathrooms`:`Bathroom`}
                </p>
            </div>
        </div>
      </Link>
      {onDelete && (
          <DeleteIcon className="removeIcon" fill='rgb(231, 76, 60)' onClick={()=>onDelete(listing.id, listing.name)} />
      )}
      {onEdit && <EditIcon className='editIcon' onClick={() => onEdit(id)} />}
    </li>
  );
};

export default ListingItem;
