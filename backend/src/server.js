const app = require('./app');
const dotenv = require('dotenv');
require('./config/firebase'); // Initialize Firebase

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
