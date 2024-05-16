const express = require("express");
const app = express();
const port = 8000;
const users = require("../MOCK.json")
const fs = require("fs");

app.use(express.urlencoded({ extended: false }));

app.get("/api/users", (req, res) => {
    return res.json(users);
})

app.get("/users", (req, res) => {
    const html = `
<ul>
${users.map((user, i) => `<li>${user.first_name}</li>`).join("")}
</ul>
`
    res.send(html);
})

app.route("/api/users/:id")
    .get((req, res) => {
        const id = Number(req.params.id);
        const user = users.find((user) => user.id === id);
        return res.json(user);

    })
    .patch((req, res) => {
        app.patch("/api/users/:id", (req, res) => {
            const id = Number(req.params.id);
            const body = req.body;
            const index = users.findIndex(user => user.id === id);
            
            if (index !== -1) {
                // Update user data
                users[index] = { ...users[index], ...body };
                fs.writeFile("../MOCK.json", JSON.stringify(users), (err) => {
                    if (err) {
                        return res.status(500).json({ error: "Internal Server Error" });
                    }
                    return res.json(users[index]);
                });
            } else {
                return res.status(404).json({ error: "User not found" });
            }
        });
        
    })
    .delete((req, res) => {
        const id = Number(req.params.id);
        const index = users.findIndex(user => user.id === id);
        if (index !== -1) {
            users.splice(index, 1);
            fs.writeFile("../MOCK.json", JSON.stringify(users), (err) => {
                if (err) {
                    return res.status(500).json({ error: "Internal Server Error" });
                }
                return res.json(users);
            });
        } else {
            return res.status(404).json({ error: "User not found" });
        }
    });
    
app.post("/api/users", (req, res) => {
    const body = req.body;
    users.push({ id: users.length + 1, ...body });
    fs.writeFile("../MOCK.JSON", JSON.stringify(users), (err, data) => {

        return res.json({ status: 'success', id: users.length })
    })
})

app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
})