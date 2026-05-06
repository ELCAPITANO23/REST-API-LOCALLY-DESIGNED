//file operations for interns.json
const fs = require("fs");
const path = require("path");

// path to your JSON file
const filePath = path.join(__dirname, "interns.json");//

const getAllInterns = () => {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
};

const saveAllInterns = (data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));//
};

module.exports = {
    getAllInterns,
    saveAllInterns
};

