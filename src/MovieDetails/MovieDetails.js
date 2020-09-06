import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CommentContainer from '../CommentContainer/CommentContainer';
import './MovieDetails.css';
import { deleteRating, postNewRating, getMovieDetails, getMovieVideo } from '../apiCalls';
import heartFavoriteFalse from '../images/heart-outline.png';
import heartFavoriteTrue from '../images/heart.png';
import ReactPlayer from 'react-player/youtube'
import AddRatingForm from '../AddRatingForm/AddRatingForm'

class MovieDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      formValue: null,
      error: '',
      movieDetails: {},
      videos: [],
      formDisplay: false 
    }
  }

  async componentDidMount() {
    try {
      const movieDetails = await getMovieDetails(this.props.currentMovie.id)
      const videos = await getMovieVideo(this.props.currentMovie.id);
      this.setState({movieDetails: movieDetails.movie, videos: videos.videos})
    } catch(error) {
      this.setState({error: 'Error retrieving movie details'})
    }
  }

  handleFormSelection = (event) => {
    this.setState({formValue: event.target.value});
  }

  addRating = (event) => {
    event.preventDefault();
    postNewRating(this.props.userId, this.props.currentMovie.id, this.state.formValue)
    .then(response => {
      console.log(response);
      this.props.updateUserRatings();
      this.setState({formDisplay: false})
    })
    .catch(error => {
      console.log(error);
      this.setState({error:'Sorry, your rating could not be added.'});
    })
  }

  handlingRatingDeletion = async event => {
    event.preventDefault();
    await deleteRating(this.props.userId, this.props.currentMovieRatingInfo.id)
      .then(response => {
        console.log(response);
        this.props.updateUserRatings();
      })
      .catch(error => { 
        console.log(error);
        this.setState({ error:'Sorry, your rating could not be deleted.'});
      })
  }

  showForm = () => {
    this.setState({ formDisplay: true });
  }

  hideForm = () => {
    this.setState({ formDisplay: false });
  }

  render() {
    const inFavorites = this.props.favorites.find(movieId => movieId === this.props.currentMovie.id); 
    const { title, poster_path, backdrop_path, release_date, overview, average_rating, genres, budget, revenue, runtime, tagline } = this.state.movieDetails;
    return (
      <section className='MovieDetails'>
        <section className='title-section'>
          <h2 className='title'>{title}
            {this.props.loggedIn &&
              <img
                className='details-heart'
                id={`heart${this.props.currentMovie.id}`}
                src={inFavorites ? heartFavoriteTrue : heartFavoriteFalse}
                alt={inFavorites ? 'favorited' : 'not favorited'}
                onClick={(event) => { this.props.toggleFavorite(event) }}
              />
            }
          </h2>
          <p><span className='category'>{tagline}</span></p>
          {this.state.error &&
            <h3 className='error-msg'>{this.state.error}</h3>
          }
        </section>
        <section className='main-movie-section'>
          <section className='poster-column'>
            <img className='poster' src={poster_path}/>
          </section>
          <section className='movie-info'>
            <p className='avg-rating'>{Math.round(average_rating * 100) / 100}/10</p>
            <p><span className='category'>Release Date:</span> {release_date}</p>
            <p><span className='category'>Overview:</span> {overview}</p>
            <p><span className='category'>Genres:</span> {genres ? genres.join(', '): ''}</p>
            <p><span className='category'>Budget:</span> ${budget}</p>
            <p><span className='category'>Revenue:</span> ${revenue}</p>
            <p><span className='category'>Runtime:</span> {runtime} minutes</p>
            {this.props.loggedIn && !this.props.currentMovieRatingInfo && 
              <>
              <button onClick={this.showForm} className='rating-btn'>Add rating</button>
                <AddRatingForm 
                  show={this.state.formDisplay}
                  hideForm={this.hideForm}
                  handleFormSelection={this.handleFormSelection}
                  addRating={this.addRating}
                />
              </>
            }
            {this.props.loggedIn && this.props.currentMovieRatingInfo && 
              <>
                <p><span className='category'>Your Rating:</span> {this.props.currentMovieRatingInfo.rating}</p>
                <button className='rating-btn' id={this.props.currentMovieRatingInfo.id} onClick={this.handlingRatingDeletion}>Delete rating</button>
              </>
            }
          </section>
        </section>
        <section className='trailer-comments'>
          <section className='video-container'>
            {this.state.videos.length > 0 ? 
              <>
                <h3>Watch Preview</h3>
                <ReactPlayer 
                  alt='trailer'
                  url={`www.youtube.com/watch?v=${this.state.videos[0].key}`}
                /> 
              </> :
              <img src={backdrop_path} alt={title}/>
          } 
          </section>
          <section className='comments-section'>
            <CommentContainer loggedIn={this.props.loggedIn} movieId={this.props.id} />
          </section>
        </section>
      </section>
    )
  }
}

MovieDetails.propTypes = {
  userRatings: PropTypes.array,
  currentMovie: PropTypes.object,
  currentMovieRatingInfo: PropTypes.object,
  loggedIn: PropTypes.bool,
  userId: PropTypes.number,
  updateUserRatings: PropTypes.func,
  favorites: PropTypes.array,
  toggleFavorite: PropTypes.func
}

export default MovieDetails 