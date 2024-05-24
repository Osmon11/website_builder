"use strict";
const AWS = require("aws-sdk");

module.exports.getCard = async (
  event,
  context
) => {
  const getCardParams = {
    TableName: process.env.DYNAMODB_CARD_TABLE,
    Key: {
      cardid: event.pathParameters.cardid,
    },
  };

  try {
    const dynamodb =
      new AWS.DynamoDB.DocumentClient();
    const getResult = await dynamodb
      .get(getCardParams)
      .promise();

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: getResult.Item,
      }),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Headers":
          "Authorization",
      },
    };
  } catch (getError) {
    console.log(
      "There was an error putting the new item."
    );
    console.log("getError", getError);
    console.log("getCardParams", getCardParams);
    return new Error(
      "There was an error putting the new item."
    );
  }
};
