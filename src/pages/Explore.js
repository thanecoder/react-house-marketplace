import React from 'react';
import { Link } from 'react-router-dom';
import sellCategoryImage from '../assets/jpg/sellCategoryImage.jpg';
import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg';
import Slider from '../components/Slider';

function Explore() {
  return (
    <div className="explore">
      <header>
        <p className="pageHeader">Explore</p>
      </header>
      <main>
        <Slider />
        <p className="exploreCategoryHeading">Categories</p>
        <div className="exploreCategories"></div>
        <Link to='/category/rent'>
          <img src={rentCategoryImage} alt="Rent Categories" className="exploreCategoryImg" /> <p className='exploreCategoryName'>Places for Rent</p>
        </Link>
        <Link to='/category/sale'>
          <img src={sellCategoryImage} alt="Sale Categories" className="exploreCategoryImg" /> <p className='exploreCategoryName'>Places for Sale</p>
        </Link>
      </main>
    </div>
  );
}

export default Explore;
