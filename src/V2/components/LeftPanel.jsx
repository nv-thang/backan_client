import { useState } from "react";

import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import Adventure from "../../Images/adventure.png";
import Cave from "../../Images/cave.png";
import Lake from "../../Images/lake.png";
import Relic from "../../Images/relic.png";
import Reserve from "../../Images/reserve.png";
import Terraces from "../../Images/terraces.png";
import Waterfall from "../../Images/waterfall.png";
import DaMyNghe from "../../Images/damynghe.png";

// import './LeftPanel.css';

import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';


const groupPlacesByCluster = (places) => {
    const placesArray = Object.values(places); // Chuyển đổi object thành mảng
    return placesArray.reduce((acc, place) => {
      const clusterName = place.cluster;
  
      if (!acc[clusterName]) {
        acc[clusterName] = [];
      }
  
      acc[clusterName].push(place);
      return acc;
    }, {});
};

const handleWheel = (event) => {
    event.stopPropagation();
};
  
const LeftPanel =({ data, onPlaceClick }) => {

    const groupedPlaces = groupPlacesByCluster(data);

    const handlePlaceClick = (place) => {
        onPlaceClick(place);
    };

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPlaces, setFilteredPlaces] = useState(groupedPlaces);
  
    const handleSearch = () => {
      if (!searchTerm) {
        setFilteredPlaces(groupedPlaces);
        return;
      }
  
      const results = Object.keys(groupedPlaces).reduce((acc, cluster) => {
        const filteredCluster = groupedPlaces[cluster].filter(place =>
          place.place_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
  
        if (filteredCluster.length > 0) {
          acc[cluster] = filteredCluster;
        }
        return acc;
      }, {});
  
      setFilteredPlaces(results);
    };

    return (
        <div className="map-panel" >
          <Tabs>
            <TabList>
              <Tab><h6><i className='bx bx-food-menu'></i> CHÚ GIẢI</h6></Tab>
              <Tab><h6><i className='bx bx-search-alt-2'></i> TÌM KIẾM</h6></Tab>
            </TabList>
    
            <TabPanel>
              <PerfectScrollbar style={{ maxHeight: '500px' }} onWheel={handleWheel}>
                <div id="legendList">
                  <h6><img src={Cave} alt="Hang động" width="20" height="20" /> Hang động Karst</h6>
                  <h6><img src={Waterfall} alt="Thác nước" width="20" height="20" /> Thác nước</h6>
                  <h6><img src={Lake} alt="Hồ ao" width="20" height="20" /> Hồ ao</h6>
                  <h6><img src={Adventure} alt="Khu sinh thái" width="20" height="20" /> Khu du lịch sinh thái</h6>
                  <h6><img src={Terraces} alt="Ruộng bậc thang" width="20" /> Cảnh quan ruộng bậc thang</h6>
                  <h6><img src={Relic} alt="Di tích lịch sử" width="20" height="20" /> Khu di tích lịch sử</h6>
                  <h6><img src={Reserve} alt="Khu bảo tồn" width="20" height="20" /> Khu bảo tồn</h6>
                  <h6><img src={DaMyNghe} alt="Đá mỹ nghệ" width="20" height="20" /> Đá mỹ nghệ</h6>
                </div>
              </PerfectScrollbar>
            </TabPanel>
    
            <TabPanel>
              <Form className="d-flex">
              <Form.Control
              type="search"
              placeholder="Nhập tên điểm"
              className="me-2"
              aria-label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline-success" onClick={handleSearch}>Tìm</Button>
              </Form>
              <PerfectScrollbar style={{ maxHeight: '500px', marginTop: '1rem' }} onWheel={handleWheel}>
                {
                !searchTerm.length >  0 ? 
                 <Accordion>
                  {Object.keys(groupedPlaces).map((clusterName, index) => (
                    <Accordion.Item eventKey={index.toString()} key={clusterName} onWheel={handleWheel}>
                      <Accordion.Header>{clusterName}</Accordion.Header>
                      <Accordion.Body>
                        <PerfectScrollbar style={{ maxHeight: '300px' }} onWheel={handleWheel}>
                          {groupedPlaces[clusterName].map((place) => (
                            <div key={place.id} onClick={() => handlePlaceClick(place)}>
                              <h6>{place.place_name}</h6>
                            </div>
                          ))}
                        </PerfectScrollbar>
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion> :
                    <div className="search-results" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        <Accordion>
                            {Object.keys(filteredPlaces).map((cluster, clusterIndex) => (
                                <Accordion.Item eventKey={clusterIndex.toString()} key={cluster}>
                                <Accordion.Header>{cluster}</Accordion.Header>
                                <Accordion.Body>
                                    {filteredPlaces[cluster].map((place, placeIndex) => (
                                    <div
                                        key={place.id}
                                        onClick={() => onPlaceClick(place)}
                                        style={{ cursor: 'pointer', padding: '5px 0' }}
                                    >
                                        {place.place_name}
                                    </div>
                                    ))}
                                </Accordion.Body>
                                </Accordion.Item>
                            ))}
                        </Accordion>
                    </div>
                }
              </PerfectScrollbar>
            </TabPanel>
          </Tabs>
        </div>
      );
    };
    
export default LeftPanel;