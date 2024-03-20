const errorMiddleware = async (error, req, res, next) => {
  let code = 500;
  let message = "Something wrong";

  if (typeof error === "string") {
    message = error;
  }

  if (error instanceof Error) {
    message = error.message;
  }

  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    "code" in error
  ) {
    code =
      Number(error.code) > 599 ||
      Number(error.code) < 100 ||
      !Number.isInteger(error.code)
        ? 500
        : Number(error.code);
    message = error.message;
  }

  console.log("error middleware =>", error);

  res.status(code).json({
    success: false,
    message,
  });
};

module.exports = errorMiddleware;
