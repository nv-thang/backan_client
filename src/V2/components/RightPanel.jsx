import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import CustomModal from './CustomModal';

const RightPanel = ({ data }) => {
  const [showModal, setShowModal] = useState(false);
  const [placeData, setPlaceData] = useState({});
  const [loading, setLoading] = useState(false);

  const handleCloseModal = () => setShowModal(false);


const handleShowModal = () => {
    setShowModal(true);
};

  useEffect(() => {
    if (data.action) {
      fetchPlaceData(data.id);
    }
  }, [data.action, data.id]);

  const fetchPlaceData = async (id) => {
    setLoading(true);
    try {
        const urlGetPlaceById = `${process.env.REACT_APP_API_URL}/place/getPlaceById?id=${id}`;
        const response = await fetch(urlGetPlaceById);
        const result = await response.json();
        setPlaceData(result);

    } catch (error) {
      console.error('Error fetching place data:', error);
    } finally {
      setLoading(false);
    }
  };

  const imagesArray = placeData.images ? placeData.images.split(',') : [];


  return (
    <div className="right-panel">
      <Card>
        <Card.Header as="h5">THÔNG TIN</Card.Header>
        <Card.Body>
          <Card.Title>{data.action === true ? loading ? 'Đang tải...' : placeData.place_name : ''}</Card.Title>
          <Card.Text>
            {data.desc.length > 250 ? `${data.desc.substring(0, 250)}...` : data.desc}
          </Card.Text>
          {
            data.action ?
              <Button variant="primary" size="sm" onClick={handleShowModal} disabled={loading}>
                {loading ? 'Đang tải...' : 'Xem thêm'}
              </Button>
              : <></>
          }
        </Card.Body>
      </Card>

      <CustomModal
        show={showModal}
        onHide={handleCloseModal}
        place={placeData}
        images={imagesArray}
      />
    </div>
  );
};

export default RightPanel;
