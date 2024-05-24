"use strict";
const AWS = require("aws-sdk");

module.exports.deleteCard = async (
  event,
  context
) => {
  const deleteCardParams = {
    TableName: process.env.DYNAMODB_CARD_TABLE,
    Key: {
      cardid: event.pathParameters.cardid,
    },
    ReturnValues: "ALL_OLD",
  };

  try {
    const dynamodb =
      new AWS.DynamoDB.DocumentClient();
    const deleteResult = await dynamodb
      .delete(deleteCardParams)
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Card successfully related: ${deleteResult.Attributes}`,
      }),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Headers":
          "Authorization",
      },
    };
  } catch (deleteError) {
    console.log(
      "There was an error putting the new item."
    );
    console.log("deleteError", deleteError);
    console.log(
      "deleteCardParams",
      deleteCardParams
    );
    return new Error(
      "There was an error putting the new item."
    );
  }
};
