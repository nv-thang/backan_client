import React, { useState } from 'react';
import Sidebar from '../Slidebar';

import User from '../../Component/User';

const UserPage = () => {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [activeItem, setActiveItem] = useState('Người dùng'); 

  const toggleSidebar = () => {
    setIsSidebarActive(!isSidebarActive);
  };

  const handleItemClick = (item) => {
    setActiveItem(item); 
  };

  return (
    <>
      <Sidebar 
        isActive={isSidebarActive} 
        toggleSidebar={toggleSidebar} 
        activeItem={activeItem} 
        onItemClick={handleItemClick} 
      />
      <div className="home_content bg-white" >
        <div className="text">BẢN ĐỒ DU LỊCH TỰ NHIÊN TỈNH BẮC KẠN</div>
        <div bg="light" className='p-2  bg-light border-top' 	style={{ height: "100%" }}>
          <User/>
        </div>
      </div>
    </>
  );
};

export default UserPage;
