import React from 'react';
import Router from './routes';

import GlobalContext from '../contexts/index';


const MainApplication = () => {

  return (

    <GlobalContext className="App">
      <Router />
    </GlobalContext>
  )
}

export default MainApplication;
