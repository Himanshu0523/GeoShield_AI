import { Router } from 'express';

const router = Router();

let mockUsers = [
  { id: 'USR-01', name: 'Dr. Alok Verma', email: 'alok.verma@geoshield.gov.in', role: 'Admin', status: 'active', department: 'NDMA', lastLogin: '10m ago' },
  { id: 'USR-02', name: 'Inspector Suresh Rawat', email: 's.rawat@sikkim.police.gov.in', role: 'Field Responder', status: 'active', department: 'SDRF Sikkim', lastLogin: '2h ago' },
  { id: 'USR-03', name: 'Meenakshi Joshi', email: 'm.joshi@nhai.gov.in', role: 'Corridor Engineer', status: 'active', department: 'NHAI', lastLogin: 'Yesterday' },
  { id: 'USR-04', name: 'Tenzing Norbu', email: 't.norbu@hydro.met.gov.in', role: 'Analyst', status: 'invited', department: 'Central Water Commission', lastLogin: 'Never' }
];

// GET /api/admin/users
router.get('/users', (req, res) => {
  res.json(mockUsers);
});

// POST /api/admin/users/invite
router.post('/users/invite', (req, res) => {
  const { name, email, role, department } = req.body;
  const newUser = {
    id: `USR-${Math.floor(10 + Math.random() * 90)}`,
    name: name || 'Invited Officer',
    email: email || 'officer@agency.gov.in',
    role: role || 'Analyst',
    department: department || 'Regional Ops',
    status: 'invited',
    lastLogin: 'Never'
  };
  mockUsers.push(newUser);
  res.status(201).json({ message: 'Invitation dispatched', user: newUser });
});

// PATCH /api/admin/users/:id/status
router.patch('/users/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  mockUsers = mockUsers.map(u => u.id === id ? { ...u, status: status || (u.status === 'active' ? 'suspended' : 'active') } : u);
  res.json({ message: 'User status updated', users: mockUsers });
});

export default router;
