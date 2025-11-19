USE berties_books;

-- Sample books
INSERT INTO books (name, price) VALUES
('Brighton Rock', 20.25),
('Brave New World', 25.00),
('Animal Farm', 12.99),
('Atlas of the World', 18.50),
('The Hobbit', 15.75);


INSERT INTO users (username, first_name, last_name, email, hashedPassword)
VALUES (
  'gold',
  'Gold',
  'Smiths',
  'gold.smiths@example.com',
  'REPLACE_THIS_WITH_HASHED_PASSWORD_FOR_smiths'
);
