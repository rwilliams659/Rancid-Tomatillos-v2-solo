import React, { Component } from 'react';
import './Login.css';
import PropTypes from 'prop-types';
import { checkLoginCredentials } from '../apiCalls';
import { Redirect } from 'react-router-dom';

class Login extends Component {
  constructor(props) {
    super(props) 
    this.state = {
      email: '',
      password: '',
      loginError: ''
    }
  }

  render() {
    if (this.props.loggedIn === true) {
      return <Redirect to='/' />
    }

    return (
      <form className='Login'>
        <input 
          type='email'
          placeholder='Email address'
          name='email'
          value={this.state.email}
          onChange={this.updateUserLogin}/>
        <input
          type='password'
          placeholder='Password'
          name='password'
          value={this.state.password} 
          onChange={this.updateUserLogin}/>

        <button className='login-form-btn'
          onClick={this.handleLogin}>Submit</button>

        {this.state.loginError &&
          <h3 className='error-msg'>{this.state.loginError}</h3>
        }
      </form>
    )
  }

  updateUserLogin = event => {
    const inputName = event.target.name;
    const inputValue = event.target.value; 
    this.setState({[inputName]: inputValue}); 
  }

  resetForm = () => {
    this.setState({
      email: '',
      password: ''
    });
  }

  validateLogin = () => {
    const loginInfo = {
      email: this.state.email,
      password: this.state.password
    };
    checkLoginCredentials(loginInfo)
    .then(response => {
      console.log(response);
      this.handleSuccessfulLogin(response.user.id); 
    })
    .catch(error => {
      console.log(error);
      this.setState({ loginError: 'Invalid username or password'});
    })
  }

  handleSuccessfulLogin = (id) => {
    this.props.updateUserId(id);
    this.props.getUserRatings();
    this.props.setFavoriteMovies(); 
    this.setState({ loginError: '' });
    this.props.updateLoginStatus(true);
  }

  handleLogin = event => {
    event.preventDefault();
    this.validateLogin(event);
    this.resetForm();
  }
}

Login.propTypes = {
  updateUserId: PropTypes.func,
  loggedIn: PropTypes.bool,
  updateLoginStatus: PropTypes.func,
  getUserRatings: PropTypes.func,
  setFavoriteMovies: PropTypes.func
}

export default Login