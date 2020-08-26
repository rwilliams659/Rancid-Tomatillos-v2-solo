import React from 'react';
import App from '../App/App.js'
import Header from './Header.js';
import { screen, fireEvent, render }
  from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from "react-router-dom";

describe('Header Component', () => {
  it('should have the correct content when rendered', () => {
    render(
      <BrowserRouter>
        <Header
          loggedIn={false}
          updateLoginStatus={jest.fn()} 
          updateUserId={jest.fn()} 
        />
      </BrowserRouter>
    )
    
    const loginBtn = screen.getByRole('button');
    const heading = screen.getByRole('heading');
    const homeLink = screen.getByLabelText('Go home');
    
    expect(loginBtn).toBeInTheDocument();
    expect(heading).toBeInTheDocument();
    expect(homeLink).toBeInTheDocument(); 
  })

  it('should fire functions when the log out button is clicked', () => {
    const mockUpdateLoginStatus = jest.fn()
    const mockUpdateUserId = jest.fn()
    
    render(
      <BrowserRouter>
        <Header
          loggedIn= {true}
          updateLoginStatus={mockUpdateLoginStatus}
          updateUserId={mockUpdateUserId}
        />
      </BrowserRouter>
    )
    
    const button = screen.getByRole('button');
    fireEvent.click(button); 

    expect(mockUpdateLoginStatus).toBeCalledTimes(1);
    expect(mockUpdateLoginStatus).toBeCalledWith(false);

    expect(mockUpdateUserId).toBeCalledTimes(1);
    expect(mockUpdateUserId).toBeCalledWith(null);
  });
})