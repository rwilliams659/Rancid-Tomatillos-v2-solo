import React from 'react';
import PropTypes from 'prop-types';
import './AddRatingForm.css'

const AddRatingForm = ({hideForm, show, handleFormSelection, addRating}) => {
  const modalDisplay = show ? 'modal display-block' : 'modal display-none'

   return (
     <section className={modalDisplay}>
       <section className='modal-main'>
        <form aria-label='select movie rating' className='rating-form'>
          <select name='rateMovieDropdown' data-testid='select-one' onChange={handleFormSelection}>
            <option value=''>--Choose a rating--</option>
            <option value='1'>1</option>
            <option value='2'>2</option>
            <option value='3'>3</option>
            <option value='4'>4</option>
            <option value='5'>5</option>
            <option value='6'>6</option>
            <option value='7'>7</option>
            <option value='8'>8</option>
            <option value='9'>9</option>
            <option value='10' data-testid='val10'>10</option>
          </select>
          <input type='submit' value='Submit' className='submit-rating' onClick={addRating} />
          <span className='close' onClick={hideForm}>X</span>
        </form>
     </section>
    </section>
   )
 }

 AddRatingForm.propTypes = {
   hideForm: PropTypes.func,
   show: PropTypes.bool,
   handleFormSelection: PropTypes.func,
   addRating: PropTypes.func
 }

 export default AddRatingForm; 