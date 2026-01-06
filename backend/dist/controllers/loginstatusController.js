export default function loginStatusController(req, res) {
    res.status(200).json({ message: "successfully authenticated" });
}
