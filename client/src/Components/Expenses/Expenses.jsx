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
import { ArrowLeft } from 'react-bootstrap-icons';

import EditExpense from './EditExpenses';
import ThemeToggle from '../ToggleTheme/ToggleTheme';
//using reducer
import { useDispatch, useSelector } from 'react-redux';
import { expenseActions } from '../store/expenseSlice';

import { useNavigate } from 'react-router-dom';
import DownloadExpenses from '../Download/DownloadExpenses';
import { jwtDecode } from 'jwt-decode';
function Expenses() {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Food');
  //const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const firebaseURL = `${process.env.REACT_APP_FIREBASE_URL}/expenses.json`;
  const [showEdit, setShowEdit] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);

  const REACT_APP_FIREBASE_URL = process.env.REACT_APP_FIREBASE_URL;

  const dispatch = useDispatch();
  const expenses = useSelector((state) => state.expenses.items);
  const token = useSelector((state) => state.auth.token);
  const isPremiumActivated = useSelector(
    (state) => state.theme.isPremiumActivated
  );

  const navigate = useNavigate();
  //loading expenses on log in
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await axios.get(firebaseURL);
        const fetchedExpenses = [];
        const decodedToken = jwtDecode(localStorage.getItem('token'));
        const currentUserId = decodedToken.user_id;

        for (const key in res.data) {
          if (res.data[key].userId === currentUserId) {
            fetchedExpenses.push({
              id: key,
              ...res.data[key],
            });
          }
        }

        //setExpenses(fetchedExpenses);
        dispatch(expenseActions.setExpenses(fetchedExpenses));
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch expenses', err);
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [firebaseURL]);

  //delete expense handler
  const deleteExpenseHandler = async (id) => {
    try {
      await axios.delete(`${REACT_APP_FIREBASE_URL}/expenses/${id}.json`);
      console.log('Expense successfully deleted');
      //setExpenses(expenses.filter((expense) => expense.id !== id));
      dispatch(expenseActions.deleteExpense(id));
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  //edit expense handler
  const editExpenseHandler = (expense) => {
    setExpenseToEdit(expense);
    setShowEdit(true);
  };

  const totalAmount = expenses.reduce(
    (acc, expense) => acc + Number(expense.amount),
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const decodedToken = jwtDecode(localStorage.getItem('token'));
    const userId = decodedToken.user_id;
    const newExpense = { amount, description, category, userId };
    try {
      const res = await axios.post(firebaseURL, newExpense);

      if (res.status === 200) {
        const id = res.data.name;
        //setExpenses((prev) => [...prev, { id, ...newExpense }]);

        dispatch(expenseActions.addExpense({ id, ...newExpense }));
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
      <Button
        variant="light"
        onClick={() => navigate('/')}
        className="position-fixed rounded-circle shadow-sm p-2"
        style={{ left: '10px', top: '10px' }}
      >
        <ArrowLeft size={20} />
      </Button>
      {isPremiumActivated && (
        <>
          <ThemeToggle />
          <DownloadExpenses />
        </>
      )}
      <div style={{ maxWidth: '650px', width: '100%' }}>
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
            <Button type="submit" variant="primary" name="add expenses">
              Add Expense
            </Button>
          </div>
        </Form>

        <hr className="my-3" />

        <h5 className="mb-3 text-center">Your Expenses</h5>
        {totalAmount > 10000 && !isPremiumActivated && (
          <Button
            variant="dark"
            className="w-100 mb-3"
            onClick={() => dispatch({ type: 'ACTIVATE_PREMIUM' })}
          >
            Activate Premium
          </Button>
        )}
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
                  <Col className="d-flex gap-2 justify-content-start">
                    <Button
                      variant="danger"
                      onClick={() => deleteExpenseHandler(expense.id)}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="warning"
                      onClick={() => editExpenseHandler(expense)}
                    >
                      Edit
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))
        )}
      </div>

      {showEdit && expenseToEdit && (
        <EditExpense
          expense={expenseToEdit}
          onClose={() => setShowEdit(false)}
          onUpdateExpense={(updatedExpense) => {
            // setExpenses(
            //   expenses.map((expense) =>
            //     expense.id === updatedExpense.id ? updatedExpense : expense
            //   )
            // );
            dispatch(expenseActions.updateExpense(updatedExpense));
            setShowEdit(false);
          }}
        />
      )}
    </Container>
  );
}

export default Expenses;
