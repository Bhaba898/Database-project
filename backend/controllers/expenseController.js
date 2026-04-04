const db = require("../db");
const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });


//to add a spending
const addExpense = async (req, res) => {
  try {
    const { categoryId, amount, description } = req.body;
    await db.query(
      "INSERT INTO expenses (user_id, categoryId, amount, description) VALUES (?, ?, ?, ?)",
      [req.session.userId, categoryId, amount, description]
    );
    res.json({ message: "Expense added" });
  } 
  catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//in all apis , i have sed category id for joins and all operations
//to get the id and respective category name, so that you can send the id 
// of the category the person has clicked to backend for the apis
// in react while doing res.map , store the id from category as 
// their key to help you while doing useState
//basically yaha se id aur category name lena, aur ke me id store karadnea
const getCategories = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM categories");
    res.json(rows);
  } 
  catch (err) {
    res.status(500).json({ error: err.message });
  }
};


//to get all spendiongs of a user
const getExpense = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT e.id, e.amount, e.description, e.created_at, c.name AS category
      FROM expenses e
      JOIN categories c ON e.categoryId = c.id
      WHERE e.user_id = ?
      ORDER BY e.created_at DESC
    `, [req.session.userId]);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//to get specific category spending 
const getExpenseByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const [rows] = await db.query(`
        SELECT e.id, e.amount, e.description, e.created_at, c.name AS category
        FROM expenses e
        JOIN categories c ON e.categoryId = c.id
        WHERE e.user_id = ? AND e.categoryId = ?
        ORDER BY e.created_at DESC
        `, [req.session.userId, category]);

    res.json(rows);
  }
  catch(err){
    res.status(500).json({error:err.message});
  }
};

//to get specific month spending
const getExpenseByMonth = async (req, res) => {
  try {
    const { month } = req.params;
    const [rows] = await db.query(`
      SELECT * FROM expenses
      WHERE user_id=? AND MONTH(created_at)=?
    `, [req.session.userId, month]);
    res.json(rows);
  } 
  catch (err) {
    res.status(500).json({ error: err.message });
  }
};


//use for line graph making to show month wise spending
const spendingPerMonth = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        MONTH(e.created_at) AS month_num,
        MONTHNAME(e.created_at) AS month,
        SUM(e.amount) AS total
      FROM expenses e
      WHERE e.user_id = ?
      GROUP BY month_num
      ORDER BY month_num
    `, [req.session.userId]);
    res.json(rows);
  } 
  catch (err) {
    res.status(500).json({ error: err.message });
  }
};


//use for pie-chat->category wise spending
const spendingPerCategory = async (req, res) => {
  try {
    const [rows] = await db.query(`
        SELECT 
        c.name AS category,SUM(e.amount) AS total
        FROM expenses e
        JOIN categories c ON e.category_id = c.id
        WHERE e.user_id = ?
        GROUP BY c.name
        ORDER BY total DESC;
    `, [req.session.userId]);
    res.json(rows);
  } 
  catch (err) {
    res.status(500).json({ error: err.message });
  }
};


//to get llm report on spending
const getReport = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        e.amount,
        e.description,
        e.created_at,
        c.name AS category
      FROM expenses e
      JOIN categories c ON e.category_id = c.id
      WHERE e.user_id = ?
      ORDER BY e.created_at ASC
    `, [req.session.userId]);

    if (rows.length === 0) {
      return res.json({ message: "No expenses found" });
    }

    const expenses = rows.map(r => ({
      amount: Number(r.amount),
      description: r.description,
      category: r.category,
      date: r.created_at
    }));

    const prompt = `
        You are a financial analyst AI.
        Analyze the following expenses and return ONLY valid JSON.
        Expenses:
        ${JSON.stringify(expenses)}
        Return STRICT JSON in this format:
        {
        "total_spent": number,
        "highest_spending_month": "month name",
        "lowest_spending_month": "month name",
        "highest_spending_category": "category name",
        "lowest_spending_category": "category name",
        "spending_habits": "detailed explanation",
        "summary": "overall financial summary"
        }
        Rules:
        - DO NOT return anything except JSON
        - DO NOT add backticks
        - DO NOT add explanations outside JSON
        - Month must be full name (January, February, etc.)
        - Be strictly based on given data
        - Be gentle and tell the exact spending habit of the user based exactly on the given data
    `;
    const response = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2
    });
    const raw = response.choices[0].message.content;
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          parsed = JSON.parse(match[0]);
        } catch (e) {
          return res.json({ raw });
        }
      } else {
        return res.json({ raw });
      }
    }
    res.json(parsed);
  } 
  catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addExpense,
  getCategories,
  getExpense,
  getExpenseByCategory,
  getExpenseByMonth,
  spendingPerMonth,
  spendingPerCategory,
  getReport
};