import multer from "multer"

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp")
  },
  filename: function (req, file, cb) {
    let fileExtension = ""
    if (file.originalname.split(".").length > 1) {
      fileExtension = file.originalname.substring(
        file.originalname.lastIndexOf(".")
      )
    }

    // clean filename (sirf a-z, 0-9, dash rakhega)
    const filenameWithoutExtension = file.originalname
      .toLowerCase()
      .replace(/\s+/g, "-") // space → dash
      .replace(/[^a-z0-9-]/g, "") // sab hatado jo safe nahi hai
      .split(".")[0]

    cb(
      null,
      filenameWithoutExtension +
        "-" +
        Date.now() +
        "-" +
        Math.ceil(Math.random() * 1e5) +
        fileExtension
    )
  },
})

export const upload = multer({
  storage,
  limits: {
    fileSize: 1 * 1000 * 1000, // 1MB
  },
})
