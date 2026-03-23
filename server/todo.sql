DROP TABLE IF EXISTS task;

CREATE TABLE task (
  id SERIAL PRIMARY KEY,
  description VARCHAR(255) NOT NULL
);

INSERT INTO task (description) VALUES
  ('Buy groceries'),
  ('Finish Todo exercise'),
  ('Walk the dog');
