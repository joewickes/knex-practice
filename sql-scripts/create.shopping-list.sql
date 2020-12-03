DROP TYPE IF EXISTS grocery;
CREATE TYPE grocery AS ENUM (
    'Main',
    'Snack',
    'Lunch',
    'Breakfast'
);

CREATE TABLE IF NOT EXISTS shopping_list (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    name TEXT not NULL,
    price decimal(12,2) not NULL,
    date_added TIMESTAMP DEFAULT now() not NULL,
    checked BOOLEAN DEFAULT false not NULL,
    category grocery not NULL
);
