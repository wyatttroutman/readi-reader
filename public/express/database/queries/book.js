export const initializeBookQuery = `create table if not exists book (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title text,
    author text,
    description text,
    language text,
    subject text,
    path text,
    publishDate TIMESTAMP,
    createDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

export const insertBookQuery = `INSERT INTO book (
    title, 
    author, 
    description, 
    language, 
    subject, 
    path,
    publishDate
    ) VALUES (?,?,?,?,?,?,?)`;

export const deleteBookByIdQuery = `delete from book where id = ?`;
export const getBookByIdQuery = `select * from book where id = ?`;
export const getBooksQuery = `select * from book`;
