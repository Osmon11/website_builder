"use strict";
const AWS = require("aws-sdk");

module.exports.scanCards = async (
  event,
  context
) => {
  const scanCardsParams = {
    TableName: process.env.DYNAMODB_CARD_TABLE,
  };

  try {
    const dynamodb =
      new AWS.DynamoDB.DocumentClient();
    const scanResult = await dynamodb
      .scan(scanCardsParams)
      .promise();

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: scanResult.Items,
      }),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Headers":
          "Authorization",
      },
    };
  } catch (scanError) {
    console.log(
      "There was an error putting the new item."
    );
    console.log("scanError", scanError);
    console.log(
      "scanCardsParams",
      scanCardsParams
    );
    return new Error(
      "There was an error putting the new item."
    );
  }
};
