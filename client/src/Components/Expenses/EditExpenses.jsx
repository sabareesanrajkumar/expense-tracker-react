import React, { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import axios from 'axios';

const EditExpense = ({ expense, onClose, onUpdateExpense }) => {
  const [amount, setAmount] = useState(expense.amount);
  const [description, setDescription] = useState(expense.description);
  const [category, setCategory] = useState(expense.category);

  const REACT_APP_FIREBASE_URL = process.env.REACT_APP_FIREBASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedExpense = {
      amount,
      description,
      category,
    };

    try {
      await axios.put(
        `${REACT_APP_FIREBASE_URL}/expenses/${expense.id}.json`,
        updatedExpense
      );
      console.log('Expense updated successfully');

      onUpdateExpense({ ...expense, ...updatedExpense });
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Expense</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="amount">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              placeholder="Amount"
            />
          </Form.Group>

          <Form.Group controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Description"
            />
          </Form.Group>

          <Form.Group controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option>Food</option>
              <option>Petrol</option>
              <option>Salary</option>
              <option>Travel</option>
            </Form.Select>
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="mt-2 d-block mx-auto"
          >
            Update Expense
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditExpense;
