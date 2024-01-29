import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';


const DNSRecordForm = ({
  show,
  handleClose,
  handleAddRecord,
  handleEditRecord,
  currentRecord,
}) => {
  const [record, setRecord] = useState({
    domain: '',
    type: 'A',
    value: '',
  });

  useEffect(() => {
    setRecord(currentRecord);
  }, [currentRecord]);

  const handleChange = (e) => {
    setRecord({ ...record, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentRecord.domain) {
      handleEditRecord(record);
    } else {
      handleAddRecord(record);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{currentRecord.domain ? 'Edit' : 'Add'} Record</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formDomain">
            <Form.Label>Domain</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter domain"
              name="domain"
              value={record.domain}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formType">
            <Form.Label>Type</Form.Label>
            <Form.Control
              as="select"
              name="type"
              value={record.type}
              onChange={handleChange}
            >
              <option value="A">A (Address)</option>
              <option value="AAAA">AAAA (IPv6 Address)</option>
              <option value="CNAME">CNAME (Canonical Name)</option>
              <option value="MX">MX (Mail Exchange)</option>
              <option value="NS">NS (Name Server)</option>
              <option value="PTR">PTR (Pointer)</option>
              <option value="SOA">SOA (Start of Authority)</option>
              <option value="SRV">SRV (Service)</option>
              <option value="TXT">TXT (Text)</option>
              <option value="DNSSEC">DNSSEC</option>
              {/* Add more options for other DNS record types */}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formValue">
            <Form.Label>Value</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter value"
              name="value"
              value={record.value}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            {currentRecord.domain ? 'Edit' : 'Add'} Record
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default DNSRecordForm;
