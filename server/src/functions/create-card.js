"use strict";
const AWS = require("aws-sdk");
const uuid = require("uuid");

module.exports.createCard = async (
  event,
  context
) => {
  // extract image_url, card_title and card_description
  const body = JSON.parse(event.body);
  const {
    image_url,
    card_title,
    card_description,
  } = body;
  // create a random cardid
  const cardid = uuid.v1();

  // create new card object
  const newCardParams = {
    TableName: process.env.DYNAMODB_CARD_TABLE,
    Item: {
      cardid,
      image_url,
      card_title,
      card_description,
    },
    ReturnValues: "ALL_OLD",
  };

  try {
    const dynamodb =
      new AWS.DynamoDB.DocumentClient();
    const putResult = await dynamodb
      .put(newCardParams)
      .promise();

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: `Card successfully created: ${cardid}`,
        result: putResult,
      }),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Headers":
          "Authorization",
      },
    };
  } catch (putError) {
    console.log(
      "There was an error putting the new item."
    );
    console.log("putError", putError);
    console.log("newCardParams", newCardParams);
    return new Error(
      "There was an error putting the new item."
    );
  }
};
