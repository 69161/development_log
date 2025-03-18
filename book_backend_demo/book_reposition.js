class BookReposition {
  constructor(books) {
    this.books = books;
    this.bookId = books.length + 1;
  }
  // 读取全部书籍
  async findAll() {
    return [...this.books]; // 返回一个新的数组，防止修改原数组
  }
  // 读取单本书籍
  async findById(id) {
    return this.books.find(book => book.id === id)
  }
  // 新增书籍
  async create(book) {
    const newBook = {
      id: this.bookId++,
      ...book,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.books.push(newBook);
    return newBook;
  }
  // 更新书籍
  async update(id, updateBook) {
    const index = this.books.findIndex(book => book.id === id);
    if(index === -1) {
      throw new Error('书籍没有找到');
    }
    const book = {
     ...this.books[index], // 合并原有书籍信息
     ...updateBook, // 合并更新信息
    };
    this.books[index] = book; // 更新原有书籍信息
    return book; // 返回更新后的书籍信息
  }

  // 删除书籍
  async delete(id) {
    const index = this.books.findIndex(book => book.id === id);
    if(index === -1) {
      throw new Error('书籍没有找到');
    }
    return this.books.splice(index, 1)[0];   // 返回被删除的书籍
  }
}
    
module.exports = BookReposition;
