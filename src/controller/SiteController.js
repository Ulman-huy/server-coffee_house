class SiteController {
  upload(req, res) {
    try {
      const file = req.file;
      return res.status(200).json({ url: file.filename });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "error" });
    }
  }
}

module.exports = new SiteController();
