const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");
const { giveCurrentDateTime } = require("../util/index");
const { initializeApp } = require("firebase/app");
const { firebaseConfig } = require("../config/firebase");
// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
initializeApp(firebaseConfig);
// Initialize Cloud Storage and get a reference to the service
const storage = getStorage();

class SiteController {
  async upload(req, res) {
    try {
      const dateTime = giveCurrentDateTime();
      const storageRef = ref(
        storage,
        `files/${req.file.originalname + " " + dateTime}`
      );

      // Create file metadata including the content type
      const metadata = {
        contentType: req.file.mimetype,
      };
      // Upload the file in the bucket storage
      const snapshot = await uploadBytesResumable(
        storageRef,
        req.file.buffer,
        metadata
      );
      //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel
      // Grab the public url
      const url = await getDownloadURL(snapshot.ref);

      return res.status(200).json({
        url: url,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "error" });
    }
  }
  getup(req, res) {
    return res.status(200).json({ message: "OK" });
  }
}
// giveCurrentDateTime
module.exports = new SiteController();
