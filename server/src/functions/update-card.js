"use strict";
const AWS = require("aws-sdk");

module.exports.updateCard = async (
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

  // check the image_url, card_title and card_description type
  if (
    typeof image_url !== "string" ||
    typeof card_title !== "string" ||
    typeof card_description !== "string"
  ) {
    return {
      statusCode: 400,
      body: `Couldn\'t update the card item. Type of image_url, card_title and card_description must be string.`,
    };
  }

  // card update object
  const updateCardParams = {
    TableName: process.env.DYNAMODB_CARD_TABLE,
    Key: {
      cardid: event.pathParameters.cardid,
    },
    ConditionExpression:
      "attribute_exists(cardid)",
    ExpressionAttributeNames: {
      "#image_url": "image_url",
      "#card_title": "card_title",
      "#card_description": "card_description",
    },
    ExpressionAttributeValues: {
      ":image_url": image_url,
      ":card_title": card_title,
      ":card_description": card_description,
    },
    UpdateExpression:
      "SET #image_url = :image_url, #card_title = :card_title, #card_description = :card_description",
    ReturnValues: "UPDATED_NEW",
  };

  const dynamodb =
    new AWS.DynamoDB.DocumentClient();

  try {
    const updateResult = await dynamodb
      .update(updateCardParams)
      .promise();
    return {
      statusCode: 200,
      body: JSON.stringify(
        updateResult.Attributes
      ),
    };
  } catch (error) {
    return {
      statusCode: error.statusCode || 501,
      body: `Couldn\'t update the card item. ${error}`,
    };
  }
};
