import React, { useState } from 'react';
import Sidebar from '../Slidebar';
import MapWithPanel from '../../V2/components/MapWithPanel';

const App = () => {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [activeItem, setActiveItem] = useState('Bản đồ'); 

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
      <div className="home_content">
        <div className="text">BẢN ĐỒ DU LỊCH TỰ NHIÊN TỈNH BẮC KẠN</div>
        <MapWithPanel/>
      </div>
    </>
  );
};

export default App;
