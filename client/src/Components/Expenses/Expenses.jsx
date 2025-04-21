import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';

function Expenses() {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Food');
  const [expenses, setExpenses] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newExpense = { amount, description, category };
    setExpenses((prev) => [...prev, newExpense]);
    setAmount('');
    setDescription('');
    setCategory('Food');
  };

  return (
    <Container className="mt-4 d-flex flex-column align-items-center">
      <div style={{ maxWidth: '500px', width: '100%' }}>
        <h4 className="mb-3 text-center">Add Expense</h4>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-2">
            <Form.Control
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Control
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>Food</option>
              <option>Petrol</option>
              <option>Salary</option>
              <option>Travel</option>
            </Form.Select>
          </Form.Group>
          <div className="d-grid mb-3">
            <Button type="submit" variant="primary">
              Add Expense
            </Button>
          </div>
        </Form>

        <hr className="my-3" />

        <h5 className="mb-3 text-center">Your Expenses</h5>
        {expenses.map((expense, index) => (
          <Card key={index} className="mb-2">
            <Card.Body className="py-2">
              <Row>
                <Col>
                  <strong>INR {expense.amount}</strong>
                </Col>
                <Col>{expense.description}</Col>
                <Col>
                  <em>{expense.category}</em>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))}
      </div>
    </Container>
  );
}

export default Expenses;
