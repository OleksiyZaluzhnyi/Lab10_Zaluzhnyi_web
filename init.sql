-- 1. Створення бази даних (виконується під суперкористувачем postgres)
CREATE DATABASE library;

-- 2. Створення таблиці books
CREATE TABLE IF NOT EXISTS books (
                                     id SERIAL PRIMARY KEY,
                                     title VARCHAR(100) NOT NULL,
    author VARCHAR(100) NOT NULL,
    published_year INTEGER NOT NULL
    );

-- 3. Наповнення початковими даними (4 записи)
INSERT INTO books (title, author, published_year) VALUES
                                                      ('The Hobbit', 'J.R.R. Tolkien', 1937),
                                                      ('1984', 'George Orwell', 1949),
                                                      ('Clean Code', 'Robert C. Martin', 2008),
                                                      ('Node.js Guide', 'John Doe', 2022);