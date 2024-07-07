import React, { useState } from 'react';
import Sidebar from '../Slidebar';

const About = () => {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [activeItem, setActiveItem] = useState('Giới thiệu'); 

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
      <div className="home_content bg-white">
        <div className="text">BẢN ĐỒ DU LỊCH TỰ NHIÊN TỈNH BẮC KẠN</div>
        <div bg="light" className='p-2  bg-light border-top' 	style={{ height: "100%" }}>
          <h4>Giới thiệu</h4>
        </div>
      </div>
    </>
  );
};

export default About;
