import React from 'react';
import { Accordion, Card, Container } from 'react-bootstrap';
import { Sheet } from './SPA';

interface SheetsProps {
  sheets: Sheet[];
}

const Sheets: React.FC<SheetsProps> = ({sheets}) => {
  return (
    <Container>
      <Card>
        <Card.Body>
          <Card.Title>Sheets</Card.Title>
        </Card.Body>
      </Card>
      <Accordion>
      {sheets.map((sheet) => (
        <Accordion.Item eventKey={sheet.uuid}>
          <Accordion.Header>{sheet.url.pathname}</Accordion.Header>
          <Accordion.Body>
            <iframe src={sheet.url.toString()} width={300} height={400}></iframe>
          </Accordion.Body>
        </Accordion.Item>
      ))}
      </Accordion>
    </Container>
  );
};

export default Sheets;