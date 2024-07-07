import React from 'react';

const Sidebar = ({ isActive, toggleSidebar, activeItem, onItemClick }) => {
  const menuItems = [
    { name: 'Bản đồ', icon: 'bx bx-map-alt', link: '/' },
    // { name: 'Địa điểm', icon: 'bx bx-spreadsheet' },
    { name: 'Giới thiệu', icon: 'bx bx-pie-chart-alt-2' , link: '#/about'},
    { name: 'Liên hệ', icon: 'bx bx-chat', link: '#/contact' },
  ];

  return (
    <div className={`sidebar ${isActive ? 'active' : ''} bg-light`}>
      <div className="logo_content">
        <div className="logo">
          <i className='bx bxs-landscape' ></i>
          <div className="logo_name">DLTN Bắc Kạn</div>
        </div>
        <i 
          className={`bx ${isActive ? 'bx-menu-alt-right' : 'bx-menu'}`} 
          id="btn"
          onClick={toggleSidebar}
        ></i>
      </div>
      <ul className="nav_list">
        {menuItems.map((item) => (
          <li key={item.name} className={activeItem === item.name ? 'active' : ''} onClick={() => onItemClick(item.name)}>
            <a href={item.link} className={activeItem === item.name ? 'active' : ''} onClick={() => onItemClick(item.name)}>
              <i className={item.icon}></i>
              <span className="links_name">{item.name}</span>
            </a>
            <span className="tooltip">{item.name}</span>
          </li>
        ))}
      </ul>
      <div className="profile_content">
        <div className="profile">
          <div className="profile_details">
            <img src="" alt="user" />
            <div className="name_job">
              <div className="name">Thangnv</div>
              <div className="job">Web Designer</div>
            </div>
          </div>
          <i className='bx bx-log-out' id="log_out"></i>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
