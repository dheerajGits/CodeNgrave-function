
module.exports.handler = async (event) => {
  console.log('Environment:', process.env.NODE_ENV);

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Go Serverless v3.0! Your function executed successfully!",
        input: event,
      },
      null,
      2
    ),
  };
};
