import React from 'react';
import { Button } from 'react-bootstrap';
import './ToolPanel.css';

const ToolPanel = ({ onZoomIn, onZoomOut, onDraw, onReset }) => {
  return (
    <div className="tool-panel">
      <Button variant="outline-primary" onClick={onReset}>
        <i className='bx bxs-map-pin'></i>      </Button>
      <Button variant="outline-primary" onClick={onZoomIn}>
        <i className="bx bx-zoom-in"></i>
      </Button>
      <Button variant="outline-primary" onClick={onZoomOut}>
        <i className="bx bx-zoom-out"></i>
      </Button>
      <Button variant="outline-primary" onClick={onDraw}>
        <i className="bx bxs-layer"></i>
      </Button>
      {/* Add more tools as needed */}
    </div>
  );
};

export default ToolPanel;
