import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Card,
  Spinner,
} from 'react-bootstrap';

function Expenses() {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Food');
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const firebaseURL = `${process.env.REACT_APP_FIREBASE_URL}/expenses.json`;

  //loading expenses on log in
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await axios.get(firebaseURL);
        const fetchedExpenses = [];

        for (const key in res.data) {
          fetchedExpenses.push({
            id: key,
            ...res.data[key],
          });
        }

        setExpenses(fetchedExpenses);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch expenses', err);
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [firebaseURL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newExpense = { amount, description, category };
    try {
      const res = await axios.post(firebaseURL, newExpense);

      if (res.status === 200) {
        const id = res.data.name;
        setExpenses((prev) => [...prev, { id, ...newExpense }]);
        setAmount('');
        setDescription('');
        setCategory('Food');
      }
    } catch (err) {
      console.error('Error adding expense:', err);
    }
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
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : (
          expenses.map((expense) => (
            <Card key={expense.id} className="mb-2">
              <Card.Body className="py-2">
                <Row>
                  <Col>
                    <strong>₹{expense.amount}</strong>
                  </Col>
                  <Col>{expense.description}</Col>
                  <Col>
                    <em>{expense.category}</em>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))
        )}
      </div>
    </Container>
  );
}

export default Expenses;
