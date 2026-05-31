const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "zenstyle",
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed");
    console.log(err);
    return;
  }

  console.log("MySQL Connected");
});

app.get("/", (req, res) => {
  res.json({
    message: "ZenStyle API Running",
  });
});

app.get("/api/staffs", (req, res) => {
  db.query("SELECT * FROM staffs", (err, results) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(results);
  });
});

app.post("/api/staffs", (req, res) => {
  const { name, position, phone, email } = req.body;

  const sql =
    "INSERT INTO staffs (name, position, phone, email, status) VALUES (?, ?, ?, ?, 'Active')";

  db.query(sql, [name, position, phone, email], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      message: "Staff added",
      id: result.insertId,
    });
  });
});

app.put("/api/staffs/:id", (req, res) => {
  const { id } = req.params;

  const { name, position, phone, email, status } = req.body;

  const sql =
    "UPDATE staffs SET name=?, position=?, phone=?, email=?, status=? WHERE id=?";

  db.query(sql, [name, position, phone, email, status, id], (err) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      message: "Staff updated",
    });
  });
});

app.delete("/api/staffs/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM staffs WHERE id=?", [id], (err) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      message: "Staff deleted",
    });
  });
});
// GET ALL SERVICES
app.get("/api/services", (req, res) => {
  db.query("SELECT * FROM services", (err, results) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(results);
  });
});

app.post("/api/services", (req, res) => {
  const { name, category, duration, price } = req.body;

  const sql =
    "INSERT INTO services (name, category, duration, price, status) VALUES (?, ?, ?, ?, 'Active')";

  db.query(sql, [name, category, duration, price], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      message: "Service added",
      id: result.insertId,
    });
  });
});

app.put("/api/services/:id", (req, res) => {
  const { id } = req.params;

  const { name, category, duration, price, status } = req.body;

  const sql =
    "UPDATE services SET name=?, category=?, duration=?, price=?, status=? WHERE id=?";

  db.query(sql, [name, category, duration, price, status, id], (err) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      message: "Service updated",
    });
  });
});

app.delete("/api/services/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM services WHERE id=?", [id], (err) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      message: "Service deleted",
    });
  });
});

// ====================== CUSTOMERS ======================

// GET ALL CUSTOMERS
app.get("/api/customers", (req, res) => {
  db.query("SELECT * FROM customers", (err, results) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(results);
  });
});

// ADD CUSTOMER
app.post("/api/customers", (req, res) => {
  const { name, phone, email, gender } = req.body;

  const sql =
    "INSERT INTO customers (name, phone, email, gender, status) VALUES (?, ?, ?, ?, 'Active')";

  db.query(sql, [name, phone, email, gender], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      message: "Customer added",
      id: result.insertId,
    });
  });
});

// UPDATE CUSTOMER
app.put("/api/customers/:id", (req, res) => {
  const { id } = req.params;

  const { name, phone, email, gender, status } = req.body;

  const sql =
    "UPDATE customers SET name=?, phone=?, email=?, gender=?, status=? WHERE id=?";

  db.query(sql, [name, phone, email, gender, status, id], (err) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      message: "Customer updated",
    });
  });
});

// DELETE CUSTOMER
app.delete("/api/customers/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM customers WHERE id=?", [id], (err) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      message: "Customer deleted",
    });
  });
});

// ====================== APPOINTMENTS ======================

// GET ALL APPOINTMENTS
app.get("/api/appointments", (req, res) => {
  const sql = `
    SELECT
      a.id,
      c.name AS customer,
      s.name AS staff,
      sv.name AS service,
      DATE(a.appointment_date) AS date,
      TIME(a.appointment_date) AS time,
      a.status
    FROM appointments a
    LEFT JOIN customers c ON a.customer_id = c.id
    LEFT JOIN staffs s ON a.staff_id = s.id
    LEFT JOIN services sv ON a.service_id = sv.id
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(results);
  });
});

// ADD APPOINTMENT
app.post("/api/appointments", (req, res) => {
  const { customer_id, staff_id, service_id, appointment_date, status } =
    req.body;

  const sql = `
    INSERT INTO appointments
    (customer_id, staff_id, service_id, appointment_date, status)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [customer_id, staff_id, service_id, appointment_date, status || "Pending"],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        message: "Appointment added",
        id: result.insertId,
      });
    },
  );
});

// UPDATE APPOINTMENT
app.put("/api/appointments/:id", (req, res) => {
  const { id } = req.params;
  const { staff_id } = req.body;

  db.query(
    "UPDATE appointments SET staff_id=? WHERE id=?",
    [staff_id, id],
    (err) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        message: "Appointment updated",
      });
    },
  );
});
// DELETE APPOINTMENT
app.delete("/api/appointments/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM appointments WHERE id=?", [id], (err) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      message: "Appointment deleted",
    });
  });
});

// ====================== LOGIN ======================

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  const sql =
    "SELECT id, username, role FROM users WHERE username=? AND password=?";

  db.query(sql, [username, password], (err, results) => {
    if (err) {
      return res.status(500).json(err);
    }

    if (results.length === 0) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    res.json({
      message: "Login successful",
      user: results[0],
    });
  });
});
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
