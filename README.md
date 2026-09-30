# Library Management REST API

REST API сервіс для управління каталогом книг бібліотеки. Проєкт розроблено на платформі **Node.js** з використанням вебфреймворку **Express** та реляційної бази даних **PostgreSQL**.

---

## 🛠 Технологічний стек

- **Платформа:** Node.js
- **Фреймворк:** Express.js
- **База даних:** PostgreSQL
- **Драйвер підключення до БД:** `pg` (node-postgres)
- **Конфігурація середовища:** `dotenv`
- **Інструмент тестування:** Postman

---

## 📁 Структура проєкту

```text
library-api/
├── db.js              # Конфігурація пулу з'єднань з PostgreSQL
├── server.js          # Головний файл Express-сервера та CRUD-маршрути
├── init.sql           # SQL-скрипт створення БД, таблиць та тестових даних
├── package.json       # Опис залежностей та скрипти запуску
├── .env.example       # Шаблон змінних середовища
├── .gitignore         # Список ігнорованих Git файлів
└── README.md          # Документація проєкту
```

---

## 📋 Вимоги до оточення

Перед початком переконайтеся, що на вашому комп'ютері встановлено:
- [Node.js](https://nodejs.org/) (версія 18.x або новіша)
- [PostgreSQL](https://www.postgresql.org/) (версія 13 або новіша)
- [Postman](https://www.postman.com/downloads/) (для тестування запитів)

---

## 🚀 Встановлення та запуск

### 1. Клонування репозиторію

```bash
git clone https://github.com/your-username/library-api.git
cd library-api
```

### 2. Встановлення залежностей

```bash
npm install
```

### 3. Налаштування бази даних PostgreSQL

Відкрийте термінал `psql` або графічний клієнт (наприклад, pgAdmin) та виконайте команди зі скрипту `init.sql`:

```sql
-- Створення бази даних
CREATE DATABASE library;

-- Підключення до бази (у консолі psql)
\c library

-- Створення таблиці книг
CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    author VARCHAR(100) NOT NULL,
    published_year INTEGER NOT NULL
);

-- Наповнення початковими записами
INSERT INTO books (title, author, published_year) VALUES
    ('The Hobbit', 'J.R.R. Tolkien', 1937),
    ('1984', 'George Orwell', 1949),
    ('Clean Code', 'Robert C. Martin', 2008),
    ('Node.js Guide', 'John Doe', 2022);
```

Або виконайте файл напряму через термінал:
```bash
psql -U postgres -f init.sql
```

### 4. Налаштування змінних оточення

Створіть у корені проєкту файл `.env` (на основі `.env.example`) та вкажіть параметри підключення до своєї локальної бази даних:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=library
```

### 5. Запуск сервера

Для запуску у стандартному режимі:
```bash
npm start
```

Для запуску у режимі розробки з автоперезавантаженням (Node.js 18+):
```bash
npm run dev
```

Після успішного старту в консолі з'явиться повідомлення:
```text
Сервер працює на http://localhost:3000
```

---

## 📡 Опис маршрутів API (Endpoints)

| Метод | Маршрут | Опис | Тіло запиту (Body) | Очікуваний статус |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/books` | Отримати список усіх книг | Відсутнє | `200 OK` |
| **GET** | `/books/:id` | Отримати книгу за ідентифікатором | Відсутнє | `200 OK` / `404 Not Found` |
| **POST** | `/books` | Додати нову книгу | JSON з полями книги | `201 Created` / `400 Bad Request` |
| **PUT** | `/books/:id` | Оновити інформацію про книгу | JSON з оновленими полями | `200 OK` / `404 Not Found` |
| **DELETE**| `/books/:id` | Видалити книгу за ідентифікатором | Відсутнє | `200 OK` / `404 Not Found` |

---

## 🧪 Інструкція з тестування в Postman

### 1. Отримання всіх книг (GET)
- **Метод:** `GET`
- **URL:** `http://localhost:3000/books`
- **Очікуваний результат:** Масив JSON-об'єктів з усіма записами з таблиці `books`.

### 2. Отримання книги за ID (GET)
- **Метод:** `GET`
- **URL:** `http://localhost:3000/books/1`
- **Очікуваний результат:** JSON-об'єкт обраної книги або статус `404`, якщо запис не знайдено.

### 3. Додавання нової книги (POST)
- **Метод:** `POST`
- **URL:** `http://localhost:3000/books`
- **Вкладка Headers:** `Content-Type: application/json`
- **Вкладка Body:** виберіть режим `raw` та тип `JSON`:
  ```json
  {
    "title": "Design Patterns",
    "author": "Erich Gamma",
    "published_year": 1994
  }
  ```
- **Очікуваний результат:** Статус `201 Created` та повернений об'єкт створеної книги з новим `id`.

### 4. Оновлення даних книги (PUT)
- **Метод:** `PUT`
- **URL:** `http://localhost:3000/books/1`
- **Вкладка Body:** `raw` -> `JSON`:
  ```json
  {
    "title": "The Hobbit: 75th Anniversary Edition",
    "author": "J.R.R. Tolkien",
    "published_year": 2012
  }
  ```
- **Очікуваний результат:** Статус `200 OK` та оновлений об'єкт книги.

### 5. Видалення книги (DELETE)
- **Метод:** `DELETE`
- **URL:** `http://localhost:3000/books/1`
- **Очікуваний результат:** Статус `200 OK` із повідомленням про успішне видалення та даними видаленого запису.

---

## ⚠️ Коди відповідей та обробка помилок

- `200 OK` — успішне виконання запиту (GET, PUT, DELETE).
- `201 Created` — успішне створення нового запису (POST).
- `400 Bad Request` — у тілі запиту пропущено одне з обов'язкових полів (`title`, `author`, `published_year`).
- `404 Not Found` — запис із вказаним `id` не знайдено в базі даних.
- `500 Internal Server Error` — внутрішня помилка сервера або бази даних.