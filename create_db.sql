-- create_db.sql - sets up Berties Books database, tables, and app user

CREATE DATABASE IF NOT EXISTS berties_books;

USE berties_books;

-- Books table
CREATE TABLE IF NOT EXISTS books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  price DECIMAL(5,2) UNSIGNED
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  email VARCHAR(100),
  hashedPassword VARCHAR(255) NOT NULL
);

-- Audit log table
CREATE TABLE IF NOT EXISTS audit_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50),
  success BOOLEAN,
  message VARCHAR(255),
  log_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Application user
CREATE USER IF NOT EXISTS 'berties_books_app'@'localhost' IDENTIFIED BY 'qwertyuiop';
GRANT ALL PRIVILEGES ON berties_books.* TO 'berties_books_app'@'localhost';
FLUSH PRIVILEGES;
