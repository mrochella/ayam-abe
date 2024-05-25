import express from 'express';
import db from '../config/Databasesql.js';
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/pendingOrder', (req, res) => {
    const query = 'SELECT * FROM pending_transaction_view;';
  db.query(query, (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

router.get('/completeOrder', (req, res) => {
    const query = 'SELECT * FROM complete_transaction_view;';
  db.query(query, (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

router.get('/dineInOrder', (req, res) => {
    const query = 'SELECT * FROM dineine_orders_views;';
  db.query(query, (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

router.get('/takeAwayOrder', (req, res) => {
    const query = 'SELECT * FROM takeAway_orders_views;';
  db.query(query, (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

router.get('/completetakeAwayOrder', (req, res) => {
    const query = 'SELECT * FROM completed_takeaway_orders_views;';
  db.query(query, (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

router.get('/pendingtakeAwayOrder', (req, res) => {
    const query = 'SELECT * FROM pending_takeaway_orders_views;';
  db.query(query, (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

router.get('/completedineInOrder', (req, res) => {
    const query = 'SELECT * FROM completed_dineine_orders_views;';
  db.query(query, (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

router.get('/pendingdineInOrder', (req, res) => {
    const query = 'SELECT * FROM pending_dineine_orders_views;';
  db.query(query, (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

export default router;
