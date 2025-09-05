import fs from "fs"
import mongoose from "mongoose"
import logger from "../logger/winston.logger.js"


export const getPaginatedPayload = (dataArray, page, limit) => {
  const startPosition = +(page - 1) * limit

  const totalItems = dataArray.length 
  const totalPages = Math.ceil(totalItems / limit)

  dataArray = structuredClone(dataArray).slice(
    startPosition,
    startPosition + limit
  )

  const payload = {
    page,
    limit,
    totalPages,
    previousPage: page > 1,
    nextPage: page < totalPages,
    totalItems,
    currentPageItems: dataArray?.length,
    data: dataArray,
  }
  return payload
}

export const getMongoosePaginationOptions = ({
  page = 1,
  limit = 10,
  customLabels,
}) => {
  return {
    page: Math.max(page, 1),
    limit: Math.max(limit, 1),
    pagination: true,
    customLabels: {
      pagingCounter: "serialNumberStartFrom",
      ...customLabels,
    },
  }
}

