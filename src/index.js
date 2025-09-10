import dotenv from "dotenv"
dotenv.config()

import connectDB from "./utils/db.js"
import logger from "./logger/winston.logger.js"
import app from "./app.js"

const startServer = () => {
  app.listen(process.env.PORT, () => {
    logger.info(
      `📑 visit the server at: http://localhost:${process.env.PORT || 8080}`
    )
    logger.info("⚙️  Server is running on port: " + process.env.PORT)
  })
}

connectDB()
  .then(() => {
    startServer()
  })
  .catch((err) => {
    logger.error("Mongo db connect error: ", err)
  })
