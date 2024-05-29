
const app = express();
const PORT = process.env.PORT || 8080;


// Starta server
app.listen(PORT, (req, res) => {
    console.log(`Server is running on port ${PORT}`);
});