import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ClusterModal = ({ show, onHide, clusters, onToggleCluster, onSave }) => {
  return (
    <Modal show={show} onHide={onHide}  backdrop="static" >
      <Modal.Header closeButton>
        <Modal.Title>Chọn các cụm</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {Object.keys(clusters).map((cluster) => (
            <Form.Check
              key={cluster}
              type="switch"
              id={`cluster-${cluster}`}
              label={cluster}
              checked={clusters[cluster]}
              onChange={() => onToggleCluster(cluster, clusters[cluster])}
            />
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ClusterModal;
