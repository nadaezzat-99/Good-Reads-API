require('dotenv').config();
const app = require('./app.ts');
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server Running here 👉 http://localhost:${port}`);
});
