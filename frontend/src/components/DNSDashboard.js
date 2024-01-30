import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Table, Dropdown } from 'react-bootstrap';
import DNSRecordForm from './DNSRecordForm';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import Papa from 'papaparse'
const initialRecord = {
  domain: '',
  type: 'A',
  value: '',
};

function DNSDashboard() {
  const [showForm, setShowForm] = useState(false);
  const [records, setRecords] = useState([]);
  const [currentRecord, setCurrentRecord] = useState(initialRecord);
  const [filterType, setFilterType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const chartData = {
    labels: records.map((record) => record.domain),
    datasets: [
      {
        label: 'Domain Distribution',
        data: records.map((record) => 1),
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
        ],
      },
    ],
  };
  useEffect(() => {
    const mockData = [
      { id: 1, domain: 'example.com', type: 'A', value: '192.168.1.1' },
    ];

    setRecords(mockData);
  }, []);

  const handleClose = () => {
    setShowForm(false);
    setCurrentRecord(initialRecord);
  };

  const handleShowForm = () => setShowForm(true);

  const handleAddRecord = (record) => {
    setRecords([...records, record]);
    handleClose();
  };

  const handleEditRecord = (record) => {
    const updatedRecords = records.map((r) =>
      r.domain === currentRecord.domain ? record : r
    );
    setRecords(updatedRecords);
    handleClose();
  };

  const handleDeleteRecord = (recordToDelete) => {
    const updatedRecords = records.filter(
      (record) => record.domain !== recordToDelete.domain
    );
    setRecords(updatedRecords);
    handleClose();
  };

  const handleEditClick = (record) => {
    setCurrentRecord(record);
    handleShowForm();
  };

  const filterRecords = () => {
    return records.filter((record) =>
      filterType === '' ? true : record.type === filterType
    );
  };

  const searchRecords = () => {
    return filterRecords().filter(
      (record) =>
        record.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.value.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
  const handleFileUpload = (file, fileType) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const fileContent = e.target.result;

      if (fileType === 'csv') {
        Papa.parse(fileContent, {
          header: true,
          dynamicTyping: true,
          complete: (result) => {
            setRecords([...records, ...result.data]);
          },
        });
      } else if (fileType === 'json') {
        const jsonData = JSON.parse(fileContent);
        setRecords([...records, ...jsonData]);
      }
    };

    reader.readAsText(file);
  };

  const handleCSVImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file, 'csv');
    }
  };

  const handleJSONImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file, 'json');
    }
  };

  
  return (
    <div>
      <h2 className='my-4'>DNS Records Dashboard</h2>
      <Button variant="primary" onClick={handleShowForm}>
        Add Record
      </Button>

      <Dropdown className='my-4'>
        <Dropdown.Toggle variant="info" id="dropdown-basic">
          Filter by Type
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => setFilterType('')}>
            Show All Types
          </Dropdown.Item>
          {['A', 'AAAA', 'CNAME', 'MX', 'NS', 'PTR', 'SOA', 'SRV', 'TXT', 'DNSSEC'].map(type => (
            <Dropdown.Item key={type} onClick={() => setFilterType(type)}>
              {type} ({getTypeName(type)})
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>

      <Form>
        <Form.Group controlId="formSearch">
          <Form.Control
            type="text"
            placeholder="Search by Domain or Value"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form.Group>
      </Form>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Domain</th>
            <th>Type</th>
            <th>Value</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {searchRecords().map((record) => (
            <tr key={record.domain}>
              <td>{record.domain}</td>
              <td>{record.type}</td>
              <td>{record.value}</td>
              <td>
                <Button variant="info" onClick={() => handleEditClick(record)}>
                  Edit
                </Button>
                <Button variant="danger" onClick={() => handleDeleteRecord(record)} > Delete </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <DNSRecordForm
        show={showForm}
        handleClose={handleClose}
        handleAddRecord={handleAddRecord}
        handleEditRecord={handleEditRecord}
        currentRecord={currentRecord}
      />
      <div className="my-4">
        <label className="mr-2">Import Data:</label>
        <input type="file" accept=".csv,.json" onChange={handleCSVImport} />
        <Button variant="success" className="ml-2" onClick={handleJSONImport}>
          Import JSON
        </Button>
      </div>

    <div className="container" style={{ width: '200px', height: '200px' }}> <Doughnut data={chartData} /> </div>
    </div>
  );
          }
  function getTypeName(type) {
    switch (type) {
      case 'A':
        return 'Address';
      case 'AAAA':
        return 'IPv6 Address';
      case 'CNAME':
        return 'Canonical Name';
      case 'MX':
        return 'Mail Exchange';
      case 'NS':
        return 'Name Server';
      case 'PTR':
        return 'Pointer';
      case 'SOA':
        return 'Start of Authority';
      case 'SRV':
        return 'Service';
      case 'TXT':
        return 'Text';
      case 'DNSSEC':
        return 'DNSSEC';
      default:
        return '';
    }
  }


export default DNSDashboard;


