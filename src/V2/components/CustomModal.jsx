import React, { useState } from 'react';
import { Modal, Button, Tab, Tabs, Image } from 'react-bootstrap';

const CustomModal = ({ show, onHide, place, images }) => {
  const [activeTab, setActiveTab] = useState('info');

  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const openModal = (image) => {
    setSelectedImage(image);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };


  const handleTabSelect = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{place.place_name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs activeKey={activeTab} onSelect={handleTabSelect}>
          <Tab eventKey="info" title="Thông tin">
            <p className='mt-2'><b>Địa chỉ:</b> {place.address}</p>
            <p ><b>Vị trí:</b> {place.longitude} - {place.latitude} </p>
            <p ><b>Thể loại:</b> {place.category}</p>
            <p >{place.description}</p>
            
          </Tab>
          <Tab eventKey="images" title="Hình ảnh">
            <div className="flex overflow-x-auto">
              {
                !images.length <= 0 ?
                images.map((image, index) => (
                    <Image
                    key={index}
                    src={`data:image/jpeg;base64,${image}`}
                    alt={`Ảnh ${index}`}
                    width={100}
                    height={100}
                    className={index !== 0 ? 'ml-1' : ''}
                    thumbnail
                    onClick={() => openModal(`data:image/jpeg;base64,${image}`)}

                    />
              )): 
              <p className='mt-2'>
                    Không có hình ảnh để hiển thị!
              </p>}
            </div>
          </Tab>
        </Tabs>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>


    {/* Modal phóng to ảnh */}
    <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xem hình ảnh</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Image src={selectedImage} alt="Ảnh phóng to" fluid />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CustomModal;
