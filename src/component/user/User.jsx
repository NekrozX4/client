import React, { useState } from 'react';
import './user.css';
import NewUser from './newUser';

const User = () => {
  const [showUserList, setShowUserList] = useState(true);

  const toggleUserList = () => {
    setShowUserList(!showUserList);
  };

  return (
    <div className='user-container'>
      {showUserList ? (
        <div className='user-list'>userLists</div>
      ) : (
        <NewUser />
      )}

      <div className='buttons'>
        <button onClick={toggleUserList}>
          {showUserList ? 'add user' : 'save'}
        </button>

      </div>
    </div>
  );
};

export default User;
