import Role from '../models/Role.js';

export const createRole = async (req, res) => {
  const { name, permissions } = req.body;

  try {
    const role = new Role({ name, permissions });
    await role.save();
    res.status(201).json(role);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateRole = async (req, res) => {
  const { name, permissions } = req.body;

  try {
    let role = await Role.findById(req.params.id);

    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    role.name = name || role.name;
    role.permissions = permissions || role.permissions;

    await role.save();
    res.json(role);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);

    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    await role.remove();
    res.json({ message: 'Role deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};