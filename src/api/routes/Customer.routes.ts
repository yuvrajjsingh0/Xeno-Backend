import { Router } from "express";
import { createCustomer, getCustomerById, getCustomers, getCustomersByRules } from "../controllers/Customer.controller";

const router = Router();

router.post('/rules', getCustomersByRules);

router.post('/', createCustomer);
  
router.get('/', getCustomers);
  
router.get('/:id', getCustomerById);

export default router;