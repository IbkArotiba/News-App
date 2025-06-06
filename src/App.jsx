import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './Components/Auth/SignIn.jsx';
import SignUp from './Components/Auth/SignUp.jsx';
import News from './Components/News.jsx';
import NewsRecap from './Components/newsrecap.jsx';
import { Amplify } from 'aws-amplify';

console.log('App component is loading');

Amplify.configure({
  Auth: {
    Cognito: {
      region: import.meta.env.VITE_AWS_REGION,
      userPoolId: import.meta.env.VITE_AWS_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_AWS_CLIENT_ID
    }
  }
});

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/news" element={<News />} />
        <Route path="/newsrecap" element={<NewsRecap />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;