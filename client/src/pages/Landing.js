import React from 'react';
import main from '../assets/images/main.svg';
import Wrapper from '../assets/wrappers/LandingPage';
import { Logo } from '../components';
import { Link, Navigate } from 'react-router-dom';
import { useAppContext } from '../context/appContext';

export const Landing = () => {
    const { user } = useAppContext();
    return (
        <React.Fragment>
            {user && <Navigate to="/"/>}
            <Wrapper>
                <nav>
                    <Logo />
                </nav>
                <div className='container page'>
                    <div className='info'>
                        <h1>
                            Job <span>tracking</span> app
                        </h1>
                        <p>
                            blabla blablabla bla blabla blablabla bla
                            blabla blablabla bla
                            blabla blablabla bla
                            blabla blablabla bla blabla blablabla bla
                            blabla blablabla bla
                        </p>
                        <Link to="/register" className='btn btn-hero'>
                            Login/Register
                        </Link>
                    </div>
                    <img src={main} alt="job hunt" className='img main-img' />
                </div>
            </Wrapper>
        </React.Fragment>
    );
}
