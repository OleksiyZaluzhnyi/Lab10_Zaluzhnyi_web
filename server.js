const express = require('express');
const db = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Парсинг JSON-тіла запитів
app.use(express.json());

// 1. GET /books — Отримання списку всіх книг
app.get('/books', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM books ORDER BY id ASC');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Помилка при отриманні списку книг:', err.message);
        res.status(500).json({ error: 'Помилка сервера' });
    }
});

// 2. GET /books/:id — Отримання книги за її id
app.get('/books/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query('SELECT * FROM books WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: `Книгу з id ${id} не знайдено` });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Помилка при пошуку книги:', err.message);
        res.status(500).json({ error: 'Помилка сервера' });
    }
});

// 3. POST /books — Створення нового запису
app.post('/books', async (req, res) => {
    const { title, author, published_year } = req.body;

    if (!title || !author || !published_year) {
        return res.status(400).json({
            error: 'Усі поля є обов’язковими: title, author, published_year',
        });
    }

    try {
        const queryText = `
      INSERT INTO books (title, author, published_year)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
        const values = [title, author, published_year];
        const result = await db.query(queryText, values);

        res.status(201).json({
            message: 'Книгу успішно додано',
            book: result.rows[0],
        });
    } catch (err) {
        console.error('Помилка при створенні книги:', err.message);
        res.status(500).json({ error: 'Помилка сервера' });
    }
});

// 4. PUT /books/:id — Оновлення інформації про книгу
app.put('/books/:id', async (req, res) => {
    const { id } = req.params;
    const { title, author, published_year } = req.body;

    if (!title || !author || !published_year) {
        return res.status(400).json({
            error: 'Усі поля є обов’язковими: title, author, published_year',
        });
    }

    try {
        const queryText = `
      UPDATE books
      SET title = $1, author = $2, published_year = $3
      WHERE id = $4
      RETURNING *
    `;
        const values = [title, author, published_year, id];
        const result = await db.query(queryText, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: `Книгу з id ${id} не знайдено` });
        }

        res.status(200).json({
            message: 'Дані книги успішно оновлено',
            book: result.rows[0],
        });
    } catch (err) {
        console.error('Помилка при оновленні книги:', err.message);
        res.status(500).json({ error: 'Помилка сервера' });
    }
});

// 5. DELETE /books/:id — Видалення книги за її id
app.delete('/books/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query('DELETE FROM books WHERE id = $1 RETURNING *', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: `Книгу з id ${id} не знайдено` });
        }

        res.status(200).json({
            message: `Книгу з id ${id} успішно видалено`,
            deletedBook: result.rows[0],
        });
    } catch (err) {
        console.error('Помилка при видаленні книги:', err.message);
        res.status(500).json({ error: 'Помилка сервера' });
    }
});

app.listen(PORT, () => {
    console.log(`Сервер працює на http://localhost:${PORT}`);
});