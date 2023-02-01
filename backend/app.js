const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const db = new sqlite3.Database("./todoListExercicie.db", (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Database created successfully");
  }
});

//user's table
db.run(
  "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT NOT NULL, email TEXT NOT NULL, preferredLanguage TEXT,password TEXT)"
);
//todos table
db.run(
  "CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT,todo TEXT NOT NULL,completed BOOLEAN DEFAULT 0,user_id INTEGER NOT NULL,FOREIGN KEY (user_id) REFERENCES users(id))"
);

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  if (!(email && password)) {
    return res
      .status(400)
      .json({ message: "Email and password must be provided" });
  }
  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
    if (err) {
      return res.status(500).json({ message: "Error while retrieving user" });
    }
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return res.status(500).json({
          error: "Error while verifying password",
        });
      }
      if (!result) {
        return res.status(400).json({
          error: "Incorrect password",
        });
      }

      //generate a token
      const token = jwt.sign(
        {
          id: user.id,
        },
        "secret_key",
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        message: "successfull authentication",
        token: token,
      });
    });
  });
});

//middleware to check if token is valid or not
const validateToken = (req, res, next) => {
  const token = req.headers["authorization"];
  //verify if token exists
  if (!token) {
    return res.status(401).json({
      error: "No token provided",
    });
  }
  // validate token
  jwt.verify(token.split(" ")[1], "secret_key", (err, decoded) => {
    if (err) {
      return res.status(401).json({
        error: "Invalid token",
      });
    }

    //if token is valid, set decoded data
    req.userId = decoded.id;
    next();
  });
};

app.get("/api/me", validateToken, (req, res) => {
  const id = req.userId;
  db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
    if (err) {
      return res.status(500).json({
        error: "Error al obtener información del usuario.",
      });
    }
    if (!row) {
      return res.status(404).json({
        error: "Usuario no encontrado.",
      });
    }
    const { username, preferredLanguage, email } = row;
    res.status(200).json({
      username,
      preferredLanguage,
      email,
    });
  });
});

app.get("/api/todos", validateToken, (req, res) => {
  //get user's id from middleware
  const userId = req.userId;
  //check if user exists
  db.get("SELECT * FROM users WHERE id = ?", [userId], (err, row) => {
    if (err) {
      return res.status(500).json({
        error: "Error al obtener información del usuario.",
      });
    }
    if (!row) {
      return res.status(404).json({
        error: "Usuario no encontrado.",
      });
    }
    db.all("SELECT * FROM todos WHERE user_id = ?", [userId], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: "Error al obtener las todos." });
      }
      res.status(200).json(rows);
    });
  });
});

app.post("/api/todos/create", validateToken, (req, res) => {
  //get user's id from middleware
  const userId = req.userId;
  //get todo from req.body
  const { todo } = req.body;
  //check if user exists
  db.get("SELECT * FROM users WHERE id = ?", [userId], (err, row) => {
    if (err) {
      return res.status(500).json({
        error: "Error al obtener información del usuario.",
      });
    }
    if (!row) {
      return res.status(404).json({
        error: "Usuario no encontrado.",
      });
    }
    db.run(
      `INSERT INTO todos (todo,user_id) VALUES (?,?)`,
      [todo, userId],
      (err) => {
        if (err) {
          return res.status(500).json({
            error: "Error while creating todo",
          });
        }
        res.status(200).json({
          message: "Todo created successfully",
        });
      }
    );
  });
});

app.patch("/api/todos/update/:id", validateToken, (req, res) => {
  const todoId = req.params.id;
  const userId = req.userId;
  const { todo, completed } = req.body;

  if (!todoId) {
    return res.status(400).json({
      error: "todo id not provided",
    });
  }
  db.get("SELECT * FROM users WHERE id = ?", [userId], (err, row) => {
    if (err) {
      console.log("error: ", err);
      return res.status(500).json({
        error: "Error en la consulta de la base de datos" + err,
      });
    }
    if (!row) {
      return res.status(404).json({
        error: "Usuario no encontrado.",
      });
    }
    db.get(
      "SELECT * FROM todos WHERE id = ? AND user_id = ?",
      [todoId, userId],
      (err, row) => {
        if (err) {
          return res.status(500).json({
            error: "Error en la consulta de la base de datos" + err,
          });
        }
        if (!row) {
          return res.status(404).json({
            error: "Todo no encontrada.",
          });
        }
        db.run(
          "UPDATE todos SET todo = ?, completed = ? WHERE id = ?",
          [todo, completed, todoId],
          (err) => {
            if (err) {
              return res.status(500).json({
                error: "Error al actualizar la todo",
              });
            }
            res.status(200).json({ message: "todo updated successfully" });
          }
        );
      }
    );
  });
});

app.get("/api/todos/:id", validateToken, (req, res) => {
  const todoId = req.params.id;
  const userId = req.userId;

  if (!todoId) {
    return res.status(400).json({
      error: "todo id not provided",
    });
  }
  db.get("SELECT * FROM users WHERE id = ?", [userId], (err, row) => {
    if (err) {
      console.log("error: ", err);
      return res.status(500).json({
        error: "Error en la consulta de la base de datos" + err,
      });
    }
    if (!row) {
      return res.status(404).json({
        error: "Usuario no encontrado.",
      });
    }
    db.get(
      "SELECT * FROM todos WHERE id = ? AND user_id = ?",
      [todoId, userId],
      (err, row) => {
        if (err) {
          return res.status(500).json({
            error: "Error en la consulta de la base de datos" + err,
          });
        }
        if (!row) {
          return res.status(404).json({
            error: "Todo no encontrada.",
          });
        }
        res.status(200).json(row);
      }
    );
  });
});

app.delete("/api/todos/:id/delete", validateToken, (req, res) => {
  const todoId = req.params.id;
  const userId = req.userId;

  if (!todoId) {
    return res.status(400).json({
      error: "todo id not provided",
    });
  }
  db.get("SELECT * FROM users WHERE id = ?", [userId], (err, row) => {
    if (err) {
      console.log("error: ", err);
      return res.status(500).json({
        error: "Error en la consulta de la base de datos" + err,
      });
    }
    if (!row) {
      return res.status(404).json({
        error: "Usuario no encontrado.",
      });
    }
    db.get(
      "SELECT * FROM todos WHERE id = ? AND user_id = ?",
      [todoId, userId],
      (err, row) => {
        if (err) {
          return res.status(500).json({
            error: "Error en la consulta de la base de datos" + err,
          });
        }
        if (!row) {
          return res.status(404).json({
            error: "Todo no encontrada.",
          });
        }
        db.run("DELETE FROM todos WHERE id = ?", [todoId], (err) => {
          if (err) {
            return res.status(500).json({
              error: "Error al eliminar la todo del usuario",
            });
          }
          res.status(200).json({ message: "todo deleted successfully" });
        });
      }
    );
  });
});

app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!(email && username && password)) {
    return res.status(400).json({
      error: "All fields required",
    });
  }

  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
    if (err) {
      return res.status(500).json({
        error: "Error en la consulta de la base de datos",
      });
    }
    if (row) {
      res.status(500).json({ error: "Usuario ya existe" });
    } else {
      //hash password
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({
            error: "Error en la comparacion de contraseñas",
          });
        }

        db.run(
          `INSERT INTO users (username,email,preferredLanguage,password) VALUES (?,?,?,?)`,
          [username, email, "ES", hash],
          (err) => {
            if (err) {
              return res
                .status(500)
                .json({ message: "Error while creating account" });
            }
            //get id of inserted user
            db.get("SELECT last_insert_rowid() as id", (err, row) => {
              if (err) {
                return res
                  .status(500)
                  .json({ message: "Error while getting user's id" });
              }
              const token = jwt.sign({ id: row.id }, "secret_key", {
                expiresIn: "1h",
              });
              res.status(200).json({ token });
            });
          }
        );
      });
    }
  });
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
