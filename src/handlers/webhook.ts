import { Request, Response } from "express";

import CallService from "@services/CallService";
import { Call } from "@interfaces/Data";

import { validationResult } from "express-validator/check";

const webhookHandler = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const call: Call = req.body;
    const { type } = call;

    switch (type) {
      case "call.new":
        await CallService.newCall(call);
        break;
      case "call.standby":
        await CallService.standBy(call);
        break;
      default:
        await CallService.update(call);
        break;
    }

    return res.status(200).json({ status: "ok" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Internal server error", info: err.message });
  }
};

export default webhookHandler;
